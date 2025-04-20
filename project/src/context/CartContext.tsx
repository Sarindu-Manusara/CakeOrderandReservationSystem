import React, { createContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';

interface CartItem {
  _id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  isCustom?: boolean;
  customOptions?: {
    size: string;
    flavor: string;
    frosting: string;
    decorations: string[];
    message: string;
  };
  reservationDate?: string;
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (item: CartItem) => Promise<void>;
  removeFromCart: (id: string) => Promise<void>;
  updateQuantity: (id: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  totalItems: number;
  totalPrice: number;
  loading: boolean;
  error: string | null;
}

export const CartContext = createContext<CartContextType>({
  cartItems: [],
  addToCart: async () => {},
  removeFromCart: async () => {},
  updateQuantity: async () => {},
  clearCart: async () => {},
  totalItems: 0,
  totalPrice: 0,
  loading: false,
  error: null,
});

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      fetchCartItems();
    }
  }, [isAuthenticated]);

  const fetchCartItems = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get('/api/cart', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setCartItems(data);
      calculateTotals(data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch cart items');
    } finally {
      setLoading(false);
    }
  };

  const calculateTotals = (items: CartItem[]) => {
    const itemCount = items.reduce((total, item) => total + item.quantity, 0);
    const priceTotal = items.reduce((total, item) => total + (item.price * item.quantity), 0);
    
    setTotalItems(itemCount);
    setTotalPrice(priceTotal);
  };

  const addToCart = async (item: CartItem) => {
    try {
      setLoading(true);
      setError(null);

      const response = await axios.post('/api/cart', {
        cakeId: item._id,
        quantity: item.quantity,
        price: item.price,
        isCustom: item.isCustom || false,
        customOptions: item.customOptions,
        reservationDate: item.reservationDate
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });

      await fetchCartItems();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to add item to cart');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const removeFromCart = async (id: string) => {
    try {
      setLoading(true);
      setError(null);

      await axios.delete(`/api/cart/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });

      await fetchCartItems();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to remove item from cart');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (id: string, quantity: number) => {
    try {
      setLoading(true);
      setError(null);

      await axios.put(`/api/cart/${id}`, 
        { quantity },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }}
      );

      await fetchCartItems();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update quantity');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const clearCart = async () => {
    try {
      setLoading(true);
      setError(null);

      await axios.delete('/api/cart', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });

      setCartItems([]);
      calculateTotals([]);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to clear cart');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return (
    <CartContext.Provider value={{
      cartItems,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      totalItems,
      totalPrice,
      loading,
      error,
    }}>
      {children}
    </CartContext.Provider>
  );
};

export default CartContext;