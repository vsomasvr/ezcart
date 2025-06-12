import { Product, Review } from './types';

// Base URL is empty because we're using full paths with /api prefix
const API_BASE_URL = '';

async function fetchApi<T>(url: string, options: RequestInit = {}): Promise<T> {
  try {
    // Add timestamp to prevent caching
    const timestamp = new Date().getTime();
    const separator = url.includes('?') ? '&' : '?';
    const urlWithCacheBust = `${API_BASE_URL}${url}${separator}_t=${timestamp}`;
    
    const response = await fetch(urlWithCacheBust, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return (await response.json()) as T;
  } catch (error) {
//     console.error('API call failed:', error);
    throw error;
  }
}

export async function getProducts(): Promise<Product[]> {
  try {
    return await fetchApi<Product[]>('/api/catalog/products');
  } catch (error) {
//     console.error('Failed to fetch products:', error);
    return [];
  }
}

export async function getProductById(id: string): Promise<Product | undefined> {
  try {
    const response = await fetchApi<Product>(`/api/catalog/products/${id}`);
    return response || undefined;
  } catch (error) {
//     console.error(`Failed to fetch product with id ${id}:`, error);
    return undefined;
  }
}

export async function searchProductsByCategory(category: string): Promise<Product[]> {
  try {
    const encodedCategory = encodeURIComponent(category);
    return await fetchApi<Product[]>(`/api/catalog/products/category/${encodedCategory}`);
  } catch (error) {
//     console.error(`Failed to search products by category ${category}:`, error);
    return [];
  }
}
export async function getReviewsByProductId(productId: string): Promise<Review[]> {
  try {
    const response = await fetchApi<Review[]>(`/api/reviews/product/${productId}`);
    return response || [];
  } catch (error) {
//     console.error(`Failed to fetch reviews for product ${productId}:`, error);
    return [];
  }
}

