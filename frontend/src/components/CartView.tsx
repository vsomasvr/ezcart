
import React from 'react';
import { DetailedCartItem } from '../types';
import CartItemRow from './CartItemRow';

interface CartViewProps {
  // isOpen: boolean; // Removed
  // onClose: () => void; // Removed
  onBackToList: () => void; // Added
  cartItems: DetailedCartItem[];
  onRemoveItem: (productId: string) => void;
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onClearCart: () => void;
}

const CartView: React.FC<CartViewProps> = ({
  // isOpen, // Removed
  // onClose, // Removed
  onBackToList, // Added
  cartItems,
  onRemoveItem,
  onUpdateQuantity,
  onClearCart,
}) => {
  // if (!isOpen) return null; // Removed, always renders if currentView is 'cart'

  const cartTotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

  return (
    // Removed modal overlay div. This is now a page section.
    <div 
      className="bg-slate-800 rounded-lg shadow-2xl w-full max-w-4xl mx-auto my-8 p-4 sm:p-6 lg:p-8 flex flex-col border border-slate-700 animate-fadeIn"
      // Removed role="dialog", aria-modal="true"
    >
      <header className="pb-4 sm:pb-6 border-b border-slate-700 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <h2 id="cart-view-title" className="text-3xl sm:text-4xl font-semibold text-sky-400">Your Shopping Cart</h2>
        <button 
          onClick={onBackToList} // Changed from onClose to onBackToList
          className="bg-slate-700 hover:bg-slate-600 text-slate-200 font-semibold py-2 px-4 rounded-lg shadow
                     transition-colors duration-200 flex items-center text-sm sm:text-base"
          aria-label="Back to product list"
        >
          <i className="fas fa-arrow-left mr-2"></i>Continue Shopping
        </button>
      </header>

      {cartItems.length === 0 ? (
        <div className="p-6 sm:p-10 text-center text-slate-400 flex-grow flex flex-col justify-center items-center">
           <i className="fas fa-cart-arrow-down text-6xl mb-6 text-slate-600"></i>
          <p className="text-2xl mb-2">Your cart is empty.</p>
          <p className="text-md text-slate-500 mb-8">Looks like you haven't added anything to your cart yet.</p>
           <button
              onClick={onBackToList} // Changed from onClose
              className="bg-cyan-600 hover:bg-cyan-500 text-white font-semibold py-3 px-8 rounded-lg shadow-md transition-all duration-200 text-lg"
            >
              Start Shopping
            </button>
        </div>
      ) : (
        <>
          <div className="py-4 sm:py-6 flex-grow overflow-y-auto space-y-4 sm:space-y-5">
            {/* Header for cart items, visible on larger screens */}
            <div className="hidden sm:flex text-xs font-medium text-slate-500 px-3 pb-2 border-b border-slate-700">
                <div className="w-2/5 pl-24">Product</div>
                <div className="w-1/5 text-center">Quantity</div>
                <div className="w-1/5 text-right">Price</div>
                <div className="w-1/5 text-right">Total</div>
            </div>
            {cartItems.map((item) => (
              <CartItemRow
                key={item.productId}
                item={item}
                onRemoveItem={onRemoveItem}
                onUpdateQuantity={onUpdateQuantity}
              />
            ))}
          </div>

          <footer className="pt-4 sm:pt-6 border-t border-slate-700 bg-slate-800">
            <div className="flex flex-col sm:flex-row justify-between items-center mb-4 sm:mb-6 gap-3">
              <button
                onClick={onClearCart}
                className="w-full sm:w-auto bg-rose-600 hover:bg-rose-500 text-white font-semibold py-2.5 px-5 rounded-md shadow transition-colors text-sm order-2 sm:order-1"
                aria-label="Clear all items from cart"
              >
                <i className="fas fa-trash-alt mr-2"></i>Clear Cart
              </button>
              <div className="text-right order-1 sm:order-2">
                <span className="text-xl font-semibold text-slate-300">Total: </span>
                <span className="text-2xl sm:text-3xl font-bold text-emerald-400">
                  {cartItems[0]?.currency || 'USD'}
                  {cartTotal.toFixed(2)}
                </span>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <button 
                onClick={onBackToList}
                className="w-full sm:w-1/2 bg-slate-600 hover:bg-slate-500 text-white font-semibold py-3 px-5 rounded-md shadow transition-colors text-base"
                aria-label="Continue Shopping"
              >
                <i className="fas fa-arrow-left mr-2"></i>Continue Shopping
              </button>
              <button 
                className="w-full sm:w-1/2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 px-5 rounded-md shadow transition-colors text-base"
                aria-label="Proceed to checkout"
              >
                <i className="fas fa-credit-card mr-2"></i>Proceed to Checkout
              </button>
            </div>
          </footer>
        </>
      )}
    </div>
  );
};

export default CartView;
