
import { CartItem, Product } from './types';

const CART_STORAGE_KEY = 'ezCart';

export const getCartItems = (): CartItem[] => {
  try {
    const storedCart = localStorage.getItem(CART_STORAGE_KEY);
    return storedCart ? JSON.parse(storedCart) : [];
  } catch (error) {
    console.error("Error reading cart from localStorage:", error);
    return [];
  }
};

const saveCartItems = (cartItems: CartItem[]): void => {
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
  } catch (error) {
    console.error("Error saving cart to localStorage:", error);
  }
};

export const addProductToCart = (productId: string): CartItem[] => {
  const cartItems = getCartItems();
  const existingItemIndex = cartItems.findIndex(item => item.productId === productId);

  if (existingItemIndex > -1) {
    cartItems[existingItemIndex].quantity += 1;
  } else {
    cartItems.push({ productId, quantity: 1 });
  }
  saveCartItems(cartItems);
  return cartItems;
};

export const removeProductFromCart = (productId: string): CartItem[] => {
  let cartItems = getCartItems();
  cartItems = cartItems.filter(item => item.productId !== productId);
  saveCartItems(cartItems);
  return cartItems;
};

export const updateProductQuantity = (productId: string, quantity: number): CartItem[] => {
  let cartItems = getCartItems();
  const itemIndex = cartItems.findIndex(item => item.productId === productId);

  if (itemIndex > -1) {
    if (quantity <= 0) {
      cartItems = cartItems.filter(item => item.productId !== productId);
    } else {
      cartItems[itemIndex].quantity = quantity;
    }
    saveCartItems(cartItems);
  }
  return cartItems;
};

export const clearCart = (): CartItem[] => {
  const emptyCart: CartItem[] = [];
  saveCartItems(emptyCart);
  return emptyCart;
};

export const getCartItemCount = (): number => {
  // Returns the total number of unique items in the cart
  return getCartItems().length;
};

export const getTotalQuantityInCart = (): number => {
  // Returns the total sum of quantities of all items
  return getCartItems().reduce((total, item) => total + item.quantity, 0);
};
