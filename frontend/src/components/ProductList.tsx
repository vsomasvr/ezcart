
import React from 'react';
import { Product, CartItem } from '../types';
import ProductCard from './ProductCard';

interface ProductListProps {
  products: Product[];
  onProductSelect: (productId: string) => void;
  onAddToCart: (productId: string) => void; // New prop
  cartItems: CartItem[]; // New prop
}

const ProductList: React.FC<ProductListProps> = ({ products, onProductSelect, onAddToCart, cartItems }) => {
  if (!products || products.length === 0) {
    // This message should ideally be handled by App.tsx for more context
    return null; // App.tsx handles loading/error/empty states
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard 
            key={product.productId} 
            product={product} 
            onProductSelect={onProductSelect}
            onAddToCart={onAddToCart} // Pass down
            isItemInCart={cartItems.some(item => item.productId === product.productId)} // Pass down
        />
      ))}
    </div>
  );
};

export default ProductList;
