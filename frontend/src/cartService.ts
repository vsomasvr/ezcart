import api from './axiosConfig';
import { CartItem } from './types';

const cartService = {
  /**
   * Fetches the user's cart from the backend.
   */
  async getCart(): Promise<CartItem[]> {
    const response = await api.get<CartItem[]>('/cart');
    return response.data;
  },

  /**
   * Adds a product to the cart. The backend handles quantity incrementing.
   */
  async addToCart(productId: string): Promise<CartItem[]> {
    const response = await api.post<CartItem[]>('/cart/items', { productId, quantity: 1 });
    return response.data;
  },

  /**
   * Updates the quantity of a specific item in the cart.
   * The backend is expected to remove the item if quantity is 0.
   */
  async updateItemQuantity(productId: string, quantity: number): Promise<CartItem[]> {
    const response = await api.put<CartItem[]>(`/cart/items/${productId}`, null, { params: { quantity } });
    return response.data;
  },

  /**
   * Removes an item from the cart completely.
   * Returns void; the component should refetch the cart.
   */
  async removeFromCart(productId: string): Promise<void> {
    await api.delete(`/cart/items/${productId}`);
  },

  /**
   * Clears the entire cart on the backend.
   * Returns void; the component should refetch the cart.
   */
  async clearCart(): Promise<void> {
    await api.delete('/cart');
  },

  /**
   * Merges a local cart with the server-side cart after login.
   */
  async mergeCart(localCartItems: CartItem[]): Promise<CartItem[]> {
    if (localCartItems.length === 0) {
      return this.getCart();
    }
    const response = await api.post<CartItem[]>('/cart/merge', localCartItems);
    return response.data;
  },
};

export default cartService;
