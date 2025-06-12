
import React from 'react';
import { DetailedCartItem } from '../types';

interface CartItemRowProps {
  item: DetailedCartItem;
  onRemoveItem: (productId: string) => void;
  onUpdateQuantity: (productId: string, quantity: number) => void;
}

const CartItemRow: React.FC<CartItemRowProps> = ({ item, onRemoveItem, onUpdateQuantity }) => {
  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuantity = parseInt(e.target.value, 10);
    if (!isNaN(newQuantity)) { 
      onUpdateQuantity(item.productId, newQuantity);
    }
  };

  const incrementQuantity = () => {
    onUpdateQuantity(item.productId, item.quantity + 1);
  };

  const decrementQuantity = () => {
    onUpdateQuantity(item.productId, item.quantity - 1); 
  };


  return (
    <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-slate-700/50 hover:bg-slate-700 rounded-lg shadow border border-slate-600 transition-colors duration-150">
      {/* Product Info: Image and Name/Price */}
      <div className="flex items-center gap-3 w-full sm:w-2/5">
        <img 
          src={item.thumbnailUrl || `https://via.placeholder.com/100x100.png?text=${encodeURIComponent(item.name)}`} 
          alt={item.name} 
          className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-md flex-shrink-0 border border-slate-600" 
        />
        <div className="flex-grow min-w-0">
          <h4 className="text-base sm:text-lg font-semibold text-slate-100 truncate hover:text-sky-300 transition-colors cursor-default" title={item.name}>{item.name}</h4>
          <p className="text-xs sm:text-sm text-slate-400 block sm:hidden">
            {item.currency}{item.price.toFixed(2)} each
          </p>
        </div>
      </div>

      {/* Quantity Control - Centered for larger screens */}
      <div className="flex items-center gap-2 w-full justify-center sm:w-1/5 sm:justify-center">
        <button 
          onClick={decrementQuantity} 
          className="w-8 h-8 bg-slate-600 hover:bg-slate-500 text-white rounded-full flex items-center justify-center transition-colors text-lg focus:ring-2 focus:ring-sky-500 focus:outline-none"
          aria-label={`Decrease quantity of ${item.name}`}
        >
          -
        </button>
        <input
          type="number"
          value={item.quantity}
          onChange={handleQuantityChange}
          className="w-12 text-center bg-slate-800 border border-slate-600 text-slate-100 rounded-md py-1.5 text-sm focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500"
          aria-label={`Quantity for ${item.name}`}
          min="0"
        />
        <button 
          onClick={incrementQuantity} 
          className="w-8 h-8 bg-slate-600 hover:bg-slate-500 text-white rounded-full flex items-center justify-center transition-colors text-lg focus:ring-2 focus:ring-sky-500 focus:outline-none"
          aria-label={`Increase quantity of ${item.name}`}
        >
          +
        </button>
      </div>

      {/* Price per unit - Hidden on small, shown on larger */}
      <p className="hidden sm:block text-sm sm:text-base text-slate-300 w-1/5 text-right">
        {item.currency}{item.price.toFixed(2)}
      </p>

      {/* Line Item Total & Remove - Aligned for larger screens */}
      <div className="flex items-center justify-between w-full sm:w-1/5 sm:justify-end gap-2">
         <p className="text-sm sm:text-base font-semibold text-emerald-400 text-right sm:flex-grow">
          {item.currency}{(item.price * item.quantity).toFixed(2)}
        </p>
        <button 
          onClick={() => onRemoveItem(item.productId)} 
          className="text-slate-500 hover:text-red-400 transition-colors text-lg sm:text-xl p-1 focus:ring-1 focus:ring-red-500 focus:outline-none rounded"
          aria-label={`Remove ${item.name} from cart`}
          title="Remove item"
        >
          <i className="fas fa-trash-alt"></i>
        </button>
      </div>
    </div>
  );
};

export default CartItemRow;
