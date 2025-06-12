
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import Navbar from './src/components/Navbar';
import ProductList from './src/components/ProductList';
import ProductDetail from './src/components/ProductDetail';
import LoadingSpinner from './src/components/LoadingSpinner';
import FilterPanel from './src/components/FilterPanel';
import CartView from './src/components/CartView';
import SignInView from './src/components/SignInView';
import ChatToggleButton from './src/components/ChatToggleButton'; // New Import
import ChatPanel from './src/components/ChatPanel'; // New Import
import { Product, CartItem, DetailedCartItem, ChatMessage, View } from './src/types'; // Added ChatMessage, View
import { getProducts } from './src/mockApiService';
import * as cartService from './src/cartService';
import { parseRamToGB, parseStorageToGB } from './src/utils';

export interface ActiveFilters {
  keyword: string;
  category: string[];
  manufacturer: string[];
  processor: string[];
  priceMin: string;
  priceMax: string;
  ram: string[];
  storage: string[];
}

const ALLOWED_USERS = ["demoUser", "testUser", "devUser", "ezUser"];

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>('list');
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [displayedProducts, setDisplayedProducts] = useState<Product[]>([]);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [cartItems, setCartItems] = useState<CartItem[]>(cartService.getCartItems());
  const [currentUser, setCurrentUser] = useState<string | null>(null);
  const [signInError, setSignInError] = useState<string | null>(null);

  // Chat State
  const [isChatPanelOpen, setIsChatPanelOpen] = useState<boolean>(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);

  const initialFilters: ActiveFilters = {
    keyword: '',
    category: [],
    manufacturer: [],
    processor: [],
    priceMin: '',
    priceMax: '',
    ram: [],
    storage: [],
  };
  const [activeFilters, setActiveFilters] = useState<ActiveFilters>(initialFilters);

  // Effect to scroll to top when view changes
  useEffect(() => {
    requestAnimationFrame(() => {
      window.scrollTo(0, 0);
    });
  }, [currentView, selectedProductId]);

  const fetchInitialProducts = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const fetchedProducts = await getProducts();
      setAllProducts(fetchedProducts);
      // setDisplayedProducts(fetchedProducts); // Let applyFilters handle this
    } catch (err) {
      setError('Failed to fetch products. Please try again later.');
      console.error(err);
      setAllProducts([]);
      setDisplayedProducts([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchInitialProducts();
  }, [fetchInitialProducts]);

  const applyFilters = useCallback(() => {
    // Only set loading if allProducts has been populated.
    if (allProducts.length > 0) {
      setIsLoading(true);
    }
    
    let productsToFilter = [...allProducts];

    if (activeFilters.keyword) {
      const keywordLower = activeFilters.keyword.toLowerCase();
      productsToFilter = productsToFilter.filter(p =>
        p.productName.toLowerCase().includes(keywordLower) ||
        p.shortDescription.toLowerCase().includes(keywordLower) ||
        p.longDescription.toLowerCase().includes(keywordLower) ||
        p.manufacturer.toLowerCase().includes(keywordLower)
      );
    }

    if (activeFilters.category.length > 0) {
      productsToFilter = productsToFilter.filter(p => activeFilters.category.includes(p.category));
    }

    if (activeFilters.manufacturer.length > 0) {
      productsToFilter = productsToFilter.filter(p => activeFilters.manufacturer.includes(p.manufacturer));
    }
    
    if (activeFilters.processor.length > 0) {
      productsToFilter = productsToFilter.filter(p => {
        const productProcessorLower = p.specifications.processor.toLowerCase();
        return activeFilters.processor.some(filterProc => productProcessorLower.includes(filterProc.toLowerCase()));
      });
    }

    const minPrice = parseFloat(activeFilters.priceMin);
    const maxPrice = parseFloat(activeFilters.priceMax);
    if (!isNaN(minPrice)) {
      productsToFilter = productsToFilter.filter(p => p.price >= minPrice);
    }
    if (!isNaN(maxPrice)) {
      productsToFilter = productsToFilter.filter(p => p.price <= maxPrice);
    }

    if (activeFilters.ram.length > 0) {
      productsToFilter = productsToFilter.filter(p => {
        const productRam = parseRamToGB(p.specifications.ram);
        return activeFilters.ram.some(filterRam => productRam === parseInt(filterRam));
      });
    }

    if (activeFilters.storage.length > 0) {
      productsToFilter = productsToFilter.filter(p => {
        const productStorage = parseStorageToGB(p.specifications.storage);
        return activeFilters.storage.some(filterStorage => {
            const filterStorageGB = parseStorageToGB(filterStorage); 
            return productStorage === filterStorageGB;
        });
      });
    }
    
    setDisplayedProducts(productsToFilter);
    if (allProducts.length > 0) { // Only stop loading if it was started
      setIsLoading(false);
    }
  }, [allProducts, activeFilters]);

  useEffect(() => {
    applyFilters(); // Apply filters whenever allProducts or activeFilters change
  }, [activeFilters, allProducts, applyFilters]);

  const handleProductSelect = (productId: string) => {
    setSelectedProductId(productId);
    setCurrentView('detail');
  };

  const handleShowList = () => {
    setCurrentView('list');
    setSelectedProductId(null);
    setSignInError(null);
  };
  
  const handleKeywordSearch = (keyword: string) => {
    setActiveFilters(prev => ({ ...prev, keyword }));
    setCurrentView('list'); 
  };

  const handleFilterChange = (filterName: keyof ActiveFilters, value: string | string[]) => {
    setActiveFilters(prev => ({ ...prev, [filterName]: value }));
    setCurrentView('list');
  };
  
  const handleClearFilters = () => {
    setActiveFilters(initialFilters);
    setCurrentView('list');
  };

  const handleAddToCart = (productId: string) => {
    const updatedCart = cartService.addProductToCart(productId);
    setCartItems(updatedCart);
  };

  const handleRemoveFromCart = (productId: string) => {
    const updatedCart = cartService.removeProductFromCart(productId);
    setCartItems(updatedCart);
  };

  const handleUpdateCartQuantity = (productId: string, quantity: number) => {
    const updatedCart = cartService.updateProductQuantity(productId, quantity);
    setCartItems(updatedCart);
  };

  const handleClearCart = () => {
    const updatedCart = cartService.clearCart();
    setCartItems(updatedCart);
  };

  const handleShowCartView = () => {
    setCurrentView('cart');
  };

  const handleShowSignInView = () => {
    setSignInError(null);
    setCurrentView('signIn');
  };

  const handleSignIn = (username: string) => {
    if (ALLOWED_USERS.includes(username)) {
      setCurrentUser(username);
      setSignInError(null);
      setCurrentView('list');
    } else {
      setSignInError("Invalid username. Please try one of: " + ALLOWED_USERS.join(', '));
    }
  };
  
  const handleSignOut = () => {
    setCurrentUser(null);
    setCartItems(cartService.clearCart()); 
    setIsChatPanelOpen(false); 
    setChatMessages([]); 
    handleShowList(); 
  };

  const detailedCartItems: DetailedCartItem[] = useMemo(() => {
    return cartItems.map(cartItem => {
      const product = allProducts.find(p => p.productId === cartItem.productId);
      return {
        ...cartItem,
        name: product?.productName || 'Product not found',
        price: product?.price || 0,
        currency: product?.currency || 'USD',
        thumbnailUrl: product?.thumbnailUrl || '',
      };
    }).filter(item => item.name !== 'Product not found');
  }, [cartItems, allProducts]);

  const toggleChatPanel = () => {
    setIsChatPanelOpen(prev => !prev);
  };

  const handleSendMessage = (messageText: string) => {
    if (!messageText.trim()) return;

    const newUserMessage: ChatMessage = {
      id: Date.now().toString() + '-user',
      text: messageText,
      sender: 'user',
      timestamp: new Date(),
    };
    setChatMessages(prev => [...prev, newUserMessage]);

    setTimeout(() => {
      const aiResponse: ChatMessage = {
        id: Date.now().toString() + '-ai',
        text: "Thanks for your message! I'm processing your request.",
        sender: 'ai',
        timestamp: new Date(),
      };
      setChatMessages(prev => [...prev, aiResponse]);
    }, 1000);
  };

  const renderContent = () => {
    if (currentView === 'signIn') {
        return <SignInView 
                    onSignIn={handleSignIn} 
                    onCancel={handleShowList} 
                    error={signInError} 
                />;
    }
    
    if (currentView === 'detail') {
      if (selectedProductId) {
        return <ProductDetail 
                  productId={selectedProductId} 
                  onBack={handleShowList} 
                  onAddToCart={handleAddToCart} 
                  cartItems={cartItems}
                />;
      }
      handleShowList(); 
      return <LoadingSpinner />;
    }

    if (currentView === 'cart') { 
        return <CartView
            cartItems={detailedCartItems}
            onRemoveItem={handleRemoveFromCart}
            onUpdateQuantity={handleUpdateCartQuantity}
            onClearCart={handleClearCart}
            onBackToList={handleShowList}
        />;
    }
    
    // Initial loading state before any products are fetched
    if (isLoading && allProducts.length === 0 && !error) { 
        return <LoadingSpinner />;
    }
    
    // Error state if initial product fetch failed
    if (error && allProducts.length === 0) { 
        return (
             <div className="bg-red-900 border border-red-700 text-red-200 px-4 py-3 rounded-lg relative mb-6 text-center" role="alert">
                <strong className="font-bold">Error:</strong>
                <span className="block sm:inline"> {error}</span>
            </div>
        );
    }
    
    // Loading state during filtering
    if (isLoading && allProducts.length > 0) {
         return <LoadingSpinner />;
    }

    // No products match filters
    if (!isLoading && displayedProducts.length === 0 && (activeFilters.keyword || activeFilters.category.length > 0 || activeFilters.manufacturer.length > 0 || activeFilters.processor.length > 0 || activeFilters.priceMin || activeFilters.priceMax || activeFilters.ram.length > 0 || activeFilters.storage.length > 0)) {
        return <div className="text-center py-10 text-slate-400">No products match your current criteria. Please try different filters or clear them.</div>;
    }
    
    // No products available at all (and no error)
    if (!isLoading && allProducts.length === 0 && !error && currentView === 'list') {
       return <div className="text-center py-10 text-slate-400">No products available at the moment.</div>;
    }

    // Default: show product list
    return <ProductList 
              products={displayedProducts} 
              onProductSelect={handleProductSelect} 
              onAddToCart={handleAddToCart}
              cartItems={cartItems}
            />;
  };
  
  const uniqueCategories = Array.from(new Set(allProducts.map(p => p.category))).sort();
  const uniqueManufacturers = Array.from(new Set(allProducts.map(p => p.manufacturer))).sort();

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-gray-900">
      <Navbar 
        onShowList={handleShowList} 
        onSearch={handleKeywordSearch} 
        currentSearchTerm={activeFilters.keyword}
        cartItemCount={cartService.getTotalQuantityInCart()}
        onShowCartView={handleShowCartView}
        currentUser={currentUser} 
        onSignOut={handleSignOut}
        onShowSignIn={handleShowSignInView}
        currentView={currentView} // Pass currentView to Navbar
      />
      <main className="flex-grow container mx-auto px-2 sm:px-4 py-8 relative">
        {currentView === 'list' && allProducts.length > 0 && (
          <FilterPanel
            activeFilters={activeFilters}
            onFilterChange={handleFilterChange}
            onClearFilters={handleClearFilters}
            availableCategories={uniqueCategories}
            availableManufacturers={uniqueManufacturers}
          />
        )}
        {renderContent()}
      </main>

      {currentUser && (
        <>
          <ChatToggleButton onClick={toggleChatPanel} isOpen={isChatPanelOpen} />
          <ChatPanel
            isOpen={isChatPanelOpen}
            onClose={toggleChatPanel}
            messages={chatMessages}
            onSendMessage={handleSendMessage}
            currentUser={currentUser}
          />
        </>
      )}

      <footer className="bg-slate-950 text-center py-6 shadow-inner">
        <p className="text-slate-500 text-sm">&copy; {new Date().getFullYear()} EZCart. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default App;
