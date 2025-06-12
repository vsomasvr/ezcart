
import React, { useState, useEffect } from 'react';
import { Product, Review, Specifications, CartItem } from '../types'; // Added CartItem
import { getProductById, getReviewsByProductId } from '../mockApiService';
import ReviewList from './ReviewList';
import LoadingSpinner from './LoadingSpinner';

interface ProductDetailProps {
  productId: string;
  onBack: () => void;
  onAddToCart: (productId: string) => void; // New prop
  cartItems: CartItem[]; // New prop
}

const formatSpecLabel = (key: string): string => {
  return key
    .replace(/([A-Z])/g, ' $1') // Add space before uppercase letters
    .replace(/^./, (str) => str.toUpperCase()); // Capitalize first letter
};

const ProductDetail: React.FC<ProductDetailProps> = ({ productId, onBack, onAddToCart, cartItems }) => {
  const [product, setProduct] = useState<Product | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProductData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const fetchedProduct = await getProductById(productId);
        if (fetchedProduct) {
          setProduct(fetchedProduct);
          const fetchedReviews = await getReviewsByProductId(productId);
          setReviews(fetchedReviews);
        } else {
          setError('Product not found.');
        }
      } catch (err) {
        setError('Failed to fetch product details.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProductData();
  }, [productId]);

  const isItemInCart = product ? cartItems.some(item => item.productId === product.productId) : false;

  const handleDetailAddToCartClick = () => {
    if (product) {
      onAddToCart(product.productId);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-10">
        <p className="text-red-400 text-2xl mb-4">{error}</p>
        <button
            onClick={onBack}
            className="bg-cyan-600 hover:bg-cyan-500 text-white font-semibold py-2 px-6 rounded-lg shadow-md
                     transition-all duration-200 transform hover:scale-105"
          >
            <i className="fas fa-arrow-left mr-2"></i>Back to Products
          </button>
      </div>
    );
  }

  if (!product) {
    return <div className="text-center py-10 text-slate-400">Product data is unavailable.</div>;
  }

  return (
    <div className="bg-slate-800 shadow-2xl rounded-xl p-6 md:p-10 animate-fadeIn">
      <button
        onClick={onBack}
        className="mb-6 bg-slate-700 hover:bg-slate-600 text-slate-200 font-semibold py-2 px-4 rounded-lg shadow
                   transition-colors duration-200 flex items-center"
        aria-label="Go back to product list"
      >
        <i className="fas fa-arrow-left mr-2"></i>Back to Products
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
        <div>
          <img 
            src={product.fullImageUrl || `https://via.placeholder.com/800x600.png?text=${encodeURIComponent(product.productName)}`} 
            alt={product.productName} 
            className="w-full h-auto rounded-lg shadow-lg object-contain max-h-[500px]"
            loading="lazy"
          />
        </div>
        <div className="flex flex-col justify-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-cyan-400 to-indigo-500 mb-3">
            {product.productName}
          </h1>
          <p className="text-slate-400 text-lg mb-1">By {product.manufacturer}</p>
          <p className="text-slate-400 text-md mb-4">Category: <span className="text-cyan-400">{product.category}</span></p>
          <p className="text-4xl font-bold text-cyan-300 mb-6">
            {product.currency}{product.price.toFixed(2)}
          </p>
          <p className="text-slate-300 text-lg mb-6 leading-relaxed">{product.shortDescription}</p>
          <button 
            onClick={handleDetailAddToCartClick}
            className={`font-bold py-3 px-8 rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-opacity-75 text-lg
                       ${isItemInCart 
                         ? 'bg-emerald-700 hover:bg-emerald-600 text-white focus:ring-emerald-500' 
                         : 'bg-emerald-600 hover:bg-emerald-500 text-white focus:ring-emerald-400'}`}
            aria-label={isItemInCart ? 'Added to Cart' : 'Add to Cart'}
          >
            {isItemInCart ? <><i className="fas fa-check mr-2"></i>Added to Cart</> : <><i className="fas fa-cart-plus mr-2"></i>Add to Cart</>}
          </button>
        </div>
      </div>

      <div className="mb-10">
        <h2 className="text-3xl font-semibold text-sky-400 mb-4 border-b-2 border-slate-700 pb-2">Description</h2>
        <p className="text-slate-300 leading-relaxed whitespace-pre-line">{product.longDescription}</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
        <div>
          <h2 className="text-3xl font-semibold text-sky-400 mb-4 border-b-2 border-slate-700 pb-2">Specifications</h2>
          <ul className="space-y-2 text-slate-300">
            {Object.entries(product.specifications).map(([key, value]) => (
              <li key={key} className="flex">
                <strong className="w-1/3 text-slate-400 font-medium">{formatSpecLabel(key)}:</strong> 
                <span className="w-2/3">
                  {Array.isArray(value) ? value.join(', ') : String(value)}
                </span>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="text-3xl font-semibold text-sky-400 mb-4 border-b-2 border-slate-700 pb-2">Features</h2>
          <ul className="list-disc list-inside space-y-2 text-slate-300 pl-1">
            {product.features.map((feature, index) => (
              <li key={index}><i className="fas fa-check-circle text-emerald-500 mr-2"></i>{feature}</li>
            ))}
          </ul>

          <h2 className="text-3xl font-semibold text-sky-400 mt-8 mb-4 border-b-2 border-slate-700 pb-2">Available Colors</h2>
          <div className="flex flex-wrap gap-3">
            {product.availableColors.map((color, index) => (
              <span key={index} className="bg-slate-700 text-slate-200 px-3 py-1 rounded-full text-sm shadow">
                {color}
              </span>
            ))}
          </div>
        </div>
      </div>
      
      <ReviewList reviews={reviews} productId={product.productId} />
    </div>
  );
};

export default ProductDetail;
