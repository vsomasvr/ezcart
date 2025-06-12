
export interface Specifications {
  processor: string;
  graphicsCard: string;
  ram: string;
  storage: string;
  display: string;
  batteryLifeHours: number;
  weightKg: number;
  ports: string[] | string; // Adjusted to handle potential string if only one port
  operatingSystem: string;
  webcam: string;
  [key: string]: any; // For any other specs
}

export interface Product {
  productId: string;
  productName: string;
  manufacturer: string;
  category: string;
  price: number;
  currency: string;
  thumbnailUrl: string;
  fullImageUrl: string;
  shortDescription: string;
  longDescription: string;
  specifications: Specifications;
  features: string[];
  availableColors: string[];
}

export interface Review {
  reviewId: string;
  productId: string;
  userId: string;
  rating: number;
  title: string;
  comment: string;
  date: string;
}

export interface CatalogData {
  products: Product[];
  reviews: Review[];
}

export interface CartItem {
  productId: string;
  quantity: number;
}

export interface DetailedCartItem extends CartItem {
  name: string;
  price: number;
  currency: string;
  thumbnailUrl: string;
  // Add any other product details needed for cart display
}

export interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

export type View = 'list' | 'detail' | 'cart' | 'signIn';
