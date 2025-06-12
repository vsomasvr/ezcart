
import React from 'react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onProductSelect: (productId: string) => void;
  onAddToCart: (productId: string) => void; // New prop
  isItemInCart: boolean; // New prop
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onProductSelect, onAddToCart, isItemInCart }) => {
  const handleCardClick = () => {
    onProductSelect(product.productId);
  };

  const handleAddToCartClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click event
    onAddToCart(product.productId);
  };

  return (
    <div 
      className="bg-slate-800 rounded-xl shadow-2xl overflow-hidden flex flex-col justify-between
                 transform hover:scale-105 transition-transform duration-300 ease-in-out group"
      // onClick and onKeyPress are primarily for the main card action (view details)
    >
      <div className="relative" onClick={handleCardClick} role="button" tabIndex={0} onKeyPress={(e) => e.key === 'Enter' && handleCardClick()} aria-label={`View details for ${product.productName}`}>
        <img 
          src={product.thumbnailUrl || `https://via.placeholder.com/400x200.png?text=${encodeURIComponent(product.productName)}`} 
          alt={product.productName} 
          className="w-full h-56 object-cover transition-opacity duration-300 group-hover:opacity-80"
          loading="lazy"
        />
        <div className="absolute top-2 right-2 bg-slate-900 bg-opacity-70 text-xs text-cyan-400 px-2 py-1 rounded">
          {product.category}
        </div>
      </div>
      <div className="p-5 flex-grow flex flex-col">
        <h3 
            className="text-xl font-semibold text-emerald-400 mb-2 truncate cursor-pointer hover:underline" 
            title={product.productName}
            onClick={handleCardClick}
            role="link"
            tabIndex={0}
            onKeyPress={(e) => e.key === 'Enter' && handleCardClick()}
        >
          {product.productName}
        </h3>
        <p className="text-xs text-slate-500 mb-1">{product.manufacturer}</p>
        <p className="text-sm text-slate-300 mb-3 flex-grow line-clamp-3">
          {product.shortDescription}
        </p>
        <div className="flex items-center justify-between mt-auto">
          <p className="text-2xl font-bold text-cyan-400">
            {product.currency}{product.price.toFixed(2)}
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={handleAddToCartClick}
              className={`font-semibold py-2 px-3 rounded-lg shadow-md transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-opacity-75 text-sm
                         ${isItemInCart 
                           ? 'bg-emerald-700 hover:bg-emerald-600 text-white focus:ring-emerald-500' 
                           : 'bg-sky-600 hover:bg-sky-500 text-white focus:ring-sky-400'}`}
              aria-label={isItemInCart ? `Added ${product.productName} to cart` : `Add ${product.productName} to cart`}
              title={isItemInCart ? 'Added to Cart' : 'Add to Cart'}
            >
              {isItemInCart ? <i className="fas fa-check"></i> : <i className="fas fa-cart-plus"></i>}
            </button>
            <button
              onClick={handleCardClick}
              className="bg-slate-600 hover:bg-slate-500 text-white font-semibold py-2 px-3 rounded-lg shadow-md
                         transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-opacity-75 text-sm"
              aria-label={`View details for ${product.productName}`}
               title="View Details"
            >
              <i className="fas fa-eye"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
