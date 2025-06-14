import React, { useState, useEffect, useCallback, useMemo } from 'react';
import Navbar from './src/components/Navbar';
import ProductList from './src/components/ProductList';
import ProductDetail from './src/components/ProductDetail';
import LoadingSpinner from './src/components/LoadingSpinner';
import FilterPanel from './src/components/FilterPanel';
import CartView from './src/components/CartView';
import SignInView from './src/components/SignInView';
import ChatToggleButton from './src/components/ChatToggleButton';
import ChatPanel from './src/components/ChatPanel';

import { Product, CartItem, DetailedCartItem, ChatMessage, View } from './src/types';
import { getProducts, searchProducts, SearchParams } from './src/apiService';
import cartService from './src/cartService';
import authService from './src/services/authService';
import chatService from './src/services/chatService';
import { parseRamToGB, parseStorageToGB } from './src/utils';

// --- STATE MANAGEMENT --- //
// Core application state
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

const App: React.FC = () => {
  // Manages the currently displayed view (e.g., list, detail, cart)
  const [currentView, setCurrentView] = useState<View>('list');
  // Master list of all products fetched from the server
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  // The subset of products to be displayed after filtering
  const [displayedProducts, setDisplayedProducts] = useState<Product[]>([]);
  // Flag to determine if filtering is client-side or server-side
  const [isServerFiltering, setIsServerFiltering] = useState<boolean>(false);
  // Holds the ID of the product being viewed in detail
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  // Global loading indicator for asynchronous operations
  const [isLoading, setIsLoading] = useState<boolean>(true);
  // Holds application-wide error messages
  const [error, setError] = useState<string | null>(null);
  // Manages items in the shopping cart - now fetched from the backend.
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  
  // Authentication state
  // Stores the name of the logged-in user
  const [currentUser, setCurrentUser] = useState<string | null>(null);
  // Error message for the sign-in form
  const [signInError, setSignInError] = useState<string | null>(null);
  // Loading state specifically for authentication
  const [isAuthLoading, setIsAuthLoading] = useState<boolean>(true); // Start true for initial check

  // Chat state
  // Toggles the visibility of the chat panel
  const [isChatPanelOpen, setIsChatPanelOpen] = useState<boolean>(false);
  // Stores the history of chat messages
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);

  // Filter state
  const initialFilters: ActiveFilters = {
    keyword: '', category: [], manufacturer: [], processor: [],
    priceMin: '', priceMax: '', ram: [], storage: [],
  };
  const [activeFilters, setActiveFilters] = useState<ActiveFilters>(initialFilters);

  // --- INITIALIZATION EFFECT --- //
  // This effect runs once when the App component mounts to fetch essential data.
  useEffect(() => {
    // 1. Checks for an active user session on the backend.
    const checkCurrentUser = async () => {
      try {
        const user = await authService.getCurrentUser();
        if (user) {
          setCurrentUser(user); // If a session exists, set the current user.
        }
      } catch (err) {
        setCurrentUser(null); // On failure, ensure no user is set.
      } finally {
        setIsAuthLoading(false); // Authentication check is complete.
      }
    };

    // Trigger both asynchronous operations on startup.
    checkCurrentUser();
  }, []);

  // --- CART DATA EFFECT --- //
  // This effect synchronizes the cart state with the backend whenever the user logs in or out.
  useEffect(() => {
    const loadCart = async () => {
      if (currentUser) {
        try {
          setIsLoading(true);
          const items = await cartService.getCart();
          setCartItems(items);
        } catch (err) {
          console.error("Failed to load cart:", err);
          setError("Could not load your cart. Please try again.");
        } finally {
          setIsLoading(false);
        }
      } else {
        // If there's no user, the cart is empty.
        setCartItems([]);
      }
    };

    loadCart();
  }, [currentUser]);

  // --- CHAT DATA EFFECT --- //
  // This effect loads the user's chat history from the backend when they log in.
  useEffect(() => {
    const loadChatHistory = async () => {
      if (currentUser) {
        try {
          const history = await chatService.getHistory();
          setChatMessages(history);
        } catch (err) {
          console.error("Failed to load chat history:", err);
        }
      } else {
        setChatMessages([]); // Clear history on logout
      }
    };

    if (!isAuthLoading) { // Only run after initial auth check
      loadChatHistory();
    }
  }, [currentUser, isAuthLoading]);

  // --- UI & DATA LOGIC --- //
  // Scrolls the window to the top whenever the view changes.
  useEffect(() => {
    requestAnimationFrame(() => {
      window.scrollTo(0, 0);
    });
  }, [currentView, selectedProductId]);

  // Load products on component mount or when filters change
  // This is a React useEffect hook. The code inside it runs after the component renders.
  //  The [isServerFiltering] part is the "dependency array."
  //  It tells React to re-run this effect automatically whenever the value of isServerFiltering changes.
  //  This allows the component to react to changes in how filtering is handled.
  useEffect(() => {
    const loadProducts = async () => {
      try {
        setIsLoading(true);
        // Only load all products if we're not using server-side filtering
        if (!isServerFiltering || allProducts.length === 0) {
          const products = await getProducts();
          setAllProducts(products);
          if (!isServerFiltering) {
            setDisplayedProducts(products);
          }
        }
      } catch (error) {
        setError('Failed to load products. Please try again later.');
        console.error('Error loading products:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadProducts();
  }, [isServerFiltering]);

  const applyFilters = useCallback(async () => {
    if (allProducts.length === 0) {
      setDisplayedProducts([]);
      return;
    }

    setIsLoading(true);
    
    // Check if we have any active filters (except keyword which is handled by the backend)
    const hasActiveFilters = 
      activeFilters.category.length > 0 ||
      activeFilters.manufacturer.length > 0 ||
      activeFilters.processor.length > 0 ||
      activeFilters.priceMin ||
      activeFilters.priceMax ||
      activeFilters.ram.length > 0 ||
      activeFilters.storage.length > 0;

    try {
      if (hasActiveFilters || activeFilters.keyword) {
        // Use server-side filtering
        setIsServerFiltering(true);
        
        const searchParams: SearchParams = {
          query: activeFilters.keyword || undefined,
          category: activeFilters.category.length > 0 ? activeFilters.category : undefined,
          manufacturer: activeFilters.manufacturer.length > 0 ? activeFilters.manufacturer : undefined,
          minPrice: activeFilters.priceMin ? parseFloat(activeFilters.priceMin) : undefined,
          maxPrice: activeFilters.priceMax ? parseFloat(activeFilters.priceMax) : undefined,
          ram: activeFilters.ram.length > 0 ? activeFilters.ram : undefined,
          processor: activeFilters.processor.length > 0 ? activeFilters.processor : undefined,
          storage: activeFilters.storage.length > 0 ? activeFilters.storage : undefined
        };
        
        const filteredProducts = await searchProducts(searchParams);
        setDisplayedProducts(filteredProducts);
      } else {
        // No filters, show all products
        setIsServerFiltering(false);
        setDisplayedProducts([...allProducts]);
      }
    } catch (error) {
      console.error('Error applying filters:', error);
      // Fallback to client-side filtering if server fails
      setIsServerFiltering(false);
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
    } finally {
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

  const handleAddToCart = async (productId: string) => {
    try {
      const updatedCart = await cartService.addToCart(productId);
      setCartItems(updatedCart);
    } catch (error) {
      console.error('Failed to add to cart:', error);
      setError('There was an issue adding the item to your cart.');
    }
  };

  const handleRemoveFromCart = async (productId: string) => {
    try {
      await cartService.removeFromCart(productId);
      // Refetch the cart to ensure consistency with the backend.
      const updatedCart = await cartService.getCart();
      setCartItems(updatedCart);
    } catch (error) {
      console.error('Failed to remove from cart:', error);
      setError('There was an issue removing the item from your cart.');
    }
  };

  const handleUpdateCartQuantity = async (productId: string, quantity: number) => {
    try {
      const updatedCart = await cartService.updateItemQuantity(productId, quantity);
      setCartItems(updatedCart);
    } catch (error) {
      console.error('Failed to update cart quantity:', error);
      setError('There was an issue updating your cart.');
    }
  };

  const handleClearCart = async () => {
    try {
      await cartService.clearCart();
      setCartItems([]);
    } catch (error) {
      console.error('Failed to clear cart:', error);
      setError('Could not clear your cart.');
    }
  };

  const handleShowCartView = () => {
    setCurrentView('cart');
  };

  const handleShowSignInView = () => {
    setSignInError(null);
    setCurrentView('signIn');
  };

  const handleSignIn = async (username, password) => {
    setIsAuthLoading(true);
    setSignInError(null);
    try {
      const user = await authService.login(username, password);
      setCurrentUser(user);
      setCurrentView('list');
      loadProducts();
    } catch (err) {
      setSignInError('Invalid username or password.');
    } finally {
      setIsAuthLoading(false);
    }
  };

  const loadProducts = async () => {
    try {
      setIsLoading(true);
      const products = await getProducts();
      setAllProducts(products); // Store the master product list.
      setDisplayedProducts(products); // Initially, display all products.
    } catch (error) {
      setError('Failed to load products. Please try again later.');
    } finally {
      setIsLoading(false); // Product loading is complete.
    }
  };

  
  const handleSignOut = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Logout failed:', error);
      // Optionally, you could show an error message to the user here.
    } finally {
      setCurrentUser(null);
      setIsChatPanelOpen(false);
      setChatMessages([]);
      handleShowList();
      window.location.reload();
    }
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

  const totalCartQuantity = useMemo(() => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  }, [cartItems]);

  const toggleChatPanel = () => {
    setIsChatPanelOpen(prev => !prev);
  };

  const handleSendMessage = async (messageText: string) => {
    if (!messageText.trim() || !currentUser) return;

    // Optimistically add the user's message for a responsive UI.
    const optimisticUserMessage: ChatMessage = {
      id: `temp-${Date.now()}`,
      text: messageText,
      sender: 'user',
      timestamp: new Date().toISOString(),
    };
    setChatMessages(prev => [...prev, optimisticUserMessage]);

    try {
      // Send the message and wait for the AI response.
      await chatService.sendMessage(messageText);
      // After the backend confirms, refresh the entire history to ensure consistency.
      const updatedHistory = await chatService.getHistory();
      setChatMessages(updatedHistory);
    } catch (error) {
      console.error('Failed to send message:', error);
      setError('Could not send your message. Please try again.');
      // On failure, remove the optimistic message.
      setChatMessages(prev => prev.filter(m => m.id !== optimisticUserMessage.id));
    }
  };

  // --- VIEW RENDERING --- //
  // Determines which main component to render based on the current application state.
  const renderContent = () => {
    // Display a loading spinner during the initial auth check.
    if (isAuthLoading) {
      return <LoadingSpinner />;
    }

    // Render the sign-in page.
    if (currentView === 'signIn') {
        return <SignInView 
                    onSignIn={handleSignIn} 
                    onCancel={handleShowList} 
                    error={signInError} 
                    isLoading={isAuthLoading}
                />;
    }
    
    // Render the product detail page.
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

    // Render the cart view.
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

  // --- ROOT COMPONENT --- //
  // Assembles the main application layout, including the navbar and dynamic content.
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-gray-900">
      <Navbar 
        onShowList={handleShowList} 
        onSearch={handleKeywordSearch} 
        currentSearchTerm={activeFilters.keyword}
        cartItemCount={totalCartQuantity}
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
