export interface Product {
  _id: string;
  name: string;
  description: string;
  image: string;
  price: number;
  category: string;
  isAvailable: boolean;
  stock: number;
  featured: boolean;
  rating: number;
  reviews: Review[];
  weatherSensitive: boolean;
  minimumStock: number;
  maximumStock: number;
  flavors: string[];
  sizes: string[];

  // NEW: Add this to distinguish product types
  productType: 'cake' | 'cookie' | 'sweet' | 'bakery';
}




export interface Review {
  _id: string;
  user: {
    _id: string;
    name: string;
  };
  rating: number;
  comment: string;
  createdAt: string;
}

export interface User {
  _id: string;
  name: string;
  email: string;
  isAdmin: boolean;
}

export interface CartItem {
  _id: string;
  product?: {
    _id: string;
    name: string;
    price: number;
    image: string;
  };
  customCake?: {
    _id: string;
    size: string;
    flavor: string;
    price: number;
  };
  quantity: number;
  isCustom: boolean;
  customOptions?: {
    size: string;
    flavor: string;
    frosting: string;
    decorations: string[];
    message: string;
  };
  reservationDate?: string;
}


export interface CustomCakeOptions {
  size: string;
  flavor: string;
  frosting: string;
  decorations: string[];
  message: string;
}

export interface Order {
  _id: string;
  user: {
    _id: string;
    name: string;
    email: string;
  };
  orderItems: CartItem[];
  shippingAddress: {
    address: string;
    city: string;
    postalCode: string;
    country: string;
  };
  paymentMethod: string;
  paymentResult?: {
    id: string;
    status: string;
    update_time: string;
    email_address: string;
  };
  itemsPrice: number;
  taxPrice: number;
  shippingPrice: number;
  totalPrice: number;
  isPaid: boolean;
  paidAt?: string;
  isDelivered: boolean;
  isCancelled: boolean;
  deliveredAt?: string;
  createdAt: string;
}