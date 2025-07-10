import api from './axiosConfig';
import { Product, Review } from './types';

// Add a request interceptor to add a cache-busting parameter
api.interceptors.request.use(config => {
  const newParams = new URLSearchParams(config.params as Record<string, string>);
  newParams.append('_t', new Date().getTime().toString());
  config.params = newParams;
  return config;
});

// Add a response interceptor to handle 401 errors
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response && error.response.status === 401) {
      // Dispatch a custom event to notify the app of authentication failure
      window.dispatchEvent(new Event('auth-error'));
    }
    return Promise.reject(error);
  }
);

export async function getProducts(): Promise<Product[]> {
  try {
    const response = await api.get<Product[]>('/catalog/products');
    return response.data;
  } catch (error) {
    console.error('Failed to fetch products:', error);
    return [];
  }
}

export async function getProductById(id: string): Promise<Product | undefined> {
  try {
    const response = await api.get<Product>(`/catalog/products/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Failed to fetch product with id ${id}:`, error);
    return undefined;
  }
}

export async function searchProductsByCategory(category: string): Promise<Product[]> {
    try {
        const encodedCategory = encodeURIComponent(category);
        const response = await api.get<Product[]>(`/catalog/products/category/${encodedCategory}`);
        return response.data;
    } catch (error) {
        console.error(`Failed to search products by category ${category}:`, error);
        return [];
    }
}

export async function getReviewsByProductId(productId: string): Promise<Review[]> {
  try {
    const response = await api.get<Review[]>(`/reviews/product/${productId}`);
    return response.data || [];
  } catch (error) {
    console.error(`Failed to fetch reviews for product ${productId}:`, error);
    return [];
  }
}

export interface SearchParams {
  query?: string;
  category?: string[];
  minPrice?: number;
  maxPrice?: number;
  manufacturer?: string[];
  ram?: string[];
  processor?: string[];
  storage?: string[];
}

export async function searchProducts(params: SearchParams): Promise<Product[]> {
    try {
        const searchParams = new URLSearchParams();
        
        if (params.query) searchParams.append('query', params.query);
        if (params.category?.length) {
          params.category.forEach(cat => searchParams.append('category', cat));
        }
        if (params.minPrice !== undefined) searchParams.append('minPrice', params.minPrice.toString());
        if (params.maxPrice !== undefined) searchParams.append('maxPrice', params.maxPrice.toString());
        if (params.manufacturer?.length) {
          params.manufacturer.forEach(mfg => searchParams.append('manufacturer', mfg));
        }
        
        if (params.ram?.length) {
          params.ram.forEach(ram => {
            const ramValue = ram.endsWith('GB') ? ram : `${ram}GB`;
            searchParams.append('spec.ram', ramValue);
          });
        }
        if (params.processor?.length) params.processor.forEach(proc => searchParams.append('spec.processor', proc));
        if (params.storage?.length) params.storage.forEach(storage => searchParams.append('spec.storage', storage));
        
        const response = await api.get<Product[]>('/catalog/search', {
            params: searchParams,
        });
        return response.data;
    } catch (error) {
        console.error('Error searching products:', error);
        return [];
    }
}