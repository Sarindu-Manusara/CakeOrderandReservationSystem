import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShoppingCart, Trash2, ChevronUp, ChevronDown, Calendar } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { formatCurrency } from '../../server/utils/FormatCurrency';

type CartItem = {
  _id: string;
  quantity: number;
  isCustom: true;
  customCake: {
    _id: string;
    size: string;
    flavor: string;
    price: number;
  };
  product?: undefined;
  customOptions?: {
    size: string;
    flavor: string;
    frosting: string;
    decorations: string[];
    message: string;
  };
  reservationDate?: string;
} | {
  _id: string;
  quantity: number;
  isCustom: false;
  product: {
    _id: string;
    name: string;
    price: number;
    image: string;
  };
  customCake?: undefined;
  customOptions?: undefined;
  reservationDate?: string;
};


interface DeliveryDetails {
  address: string;
  city: string;
  postalCode: string;
  country: string;
  phone: string;
}

const CartPage: React.FC = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [orderType, setOrderType] = useState<'delivery' | 'reservation' | null>(null);
  const [deliveryDetails, setDeliveryDetails] = useState<DeliveryDetails>({
    address: '',
    city: '',
    postalCode: '',
    country: '',
    phone: ''
  });
  
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    fetchCartItems();
  }, []);

  const fetchCartItems = async () => {
    try {
      const { data } = await axios.get('/api/cart', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setCartItems(data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch cart items');
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (itemId: string, newQuantity: number) => {
    try {
      await axios.put(`/api/cart/${itemId}`, 
        { quantity: newQuantity },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }}
      );
      fetchCartItems();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update quantity');
    }
  };

  const removeItem = async (itemId: string) => {
    try {
      await axios.delete(`/api/cart/${itemId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      fetchCartItems();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to remove item');
    }
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => {
      const price = item.isCustom ? item.customCake?.price : item.product?.price;
      return total + (price || 0) * item.quantity;
    }, 0);
  };

  const formatOrderItems = (items: CartItem[]) => {
    return items.map(item => ({
      name: item.isCustom ? `Custom ${item.customCake?.flavor} Cake` : item.product?.name,
      qty: item.quantity,
      image: item.isCustom ? 'https://images.pexels.com/photos/6208089/pexels-photo-6208089.jpeg' : item.product?.image,
      price: item.isCustom ? item.customCake?.price : item.product?.price,
      product: item.product?._id,
      customCake: item.customCake?._id,
      isCustom: item.isCustom,
      customOptions: item.customOptions,
      reservationDate: item.reservationDate
    }));
  };
  
  const handleDeliverySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const orderData = {
        orderItems: formatOrderItems(cartItems),
        shippingAddress: deliveryDetails,
        paymentMethod: 'stripe',
        itemsPrice: calculateTotal(),
        shippingPrice: 5.00,
        taxPrice: calculateTotal() * 0.1,
        totalPrice: calculateTotal() + 5.00 + (calculateTotal() * 0.1),
        isReservation: false
      };

      const { data } = await axios.post('/api/orders', orderData, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });

      navigate(`/payment/${data._id}`);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create order');
    }
  };

  const handleReservationSubmit = async () => {
    try {
      const orderData = {
        orderItems: formatOrderItems(cartItems),
        paymentMethod: 'stripe',
        itemsPrice: calculateTotal(),
        taxPrice: calculateTotal() * 0.1,
        totalPrice: calculateTotal() + (calculateTotal() * 0.1),
        isReservation: true
      };

      const { data } = await axios.post('/api/orders', orderData, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });

      navigate(`/payment/${data._id}`);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create reservation');
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12 flex justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (!cartItems.length) {
    return (
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-6">Your Cart</h1>
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <ShoppingCart size={64} className="mx-auto mb-4 text-gray-400" />
          <h2 className="text-2xl font-semibold mb-2">Your cart is empty</h2>
          <p className="text-gray-600 mb-6">Looks like you haven't added any cakes to your cart yet.</p>
          <Link 
            to="/products" 
            className="bg-primary-500 text-white px-6 py-3 rounded-md font-medium hover:bg-primary-600 transition-colors"
          >
            Browse Cakes
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-6">Your Cart</h1>
      
      {error && (
        <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-lg">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            {cartItems.map((item) => (
              <div key={item._id} className="p-6 border-b">
                <div className="flex items-center">
                  <img 
                    src={item.isCustom ? 'https://images.pexels.com/photos/6208089/pexels-photo-6208089.jpeg' : item.product?.image}
                    alt={item.isCustom ? 'Custom Cake' : item.product?.name}
                    className="w-24 h-24 object-cover rounded-lg"
                  />
                  <div className="ml-6 flex-1">
                    <h3 className="text-lg font-semibold">
                      {item.isCustom ? `Custom ${item.customCake?.flavor} Cake` : item.product?.name}
                    </h3>
                    {item.isCustom && item.customOptions && (
                      <div className="text-sm text-gray-600 mt-1">
                        <p>Size: {item.customOptions.size}</p>
                        <p>Flavor: {item.customOptions.flavor}</p>
                        <p>Frosting: {item.customOptions.frosting}</p>
                      </div>
                    )}
                    {item.reservationDate && (
                      <div className="flex items-center mt-2 text-primary-600">
                        <Calendar size={16} className="mr-2" />
                        <span>Reserved for: {new Date(item.reservationDate).toLocaleDateString()}</span>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center">
                      <button 
                        onClick={() => updateQuantity(item._id, Math.max(1, item.quantity - 1))}
                        className="p-1 rounded-md hover:bg-gray-100"
                      >
                        <ChevronDown size={20} />
                      </button>
                      <span className="mx-2 w-8 text-center">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item._id, item.quantity + 1)}
                        className="p-1 rounded-md hover:bg-gray-100"
                      >
                        <ChevronUp size={20} />
                      </button>
                    </div>
                    <span className="font-semibold">
                      {formatCurrency((item.isCustom ? item.customCake?.price : item.product?.price) || 0)}
                    </span>
                    <button 
                      onClick={() => removeItem(item._id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
            
            <div className="space-y-3">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>{formatCurrency(calculateTotal())}</span>
              </div>
              {orderType === 'delivery' && (
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>{formatCurrency(500)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Tax (10%)</span>
                <span>{formatCurrency(calculateTotal() * 0.1)}</span>
              </div>
              <div className="border-t pt-3 mt-3">
                <div className="flex justify-between font-semibold text-lg">
                  <span>Total</span>
                  <span>
                    {formatCurrency(calculateTotal() + (orderType === 'delivery' ? 500 : 0) + (calculateTotal() * 0.1))}
                  </span>
                </div>
              </div>
            </div>

            {!orderType ? (
              <div className="mt-6 space-y-4">
                <button
                  onClick={() => setOrderType('delivery')}
                  className="w-full bg-primary-500 text-white py-2 px-4 rounded-md hover:bg-primary-600 transition-colors"
                >
                  Order for Delivery
                </button>
                <button
                  onClick={() => setOrderType('reservation')}
                  className="w-full border-2 border-primary-500 text-primary-500 py-2 px-4 rounded-md hover:bg-primary-50 transition-colors"
                >
                  Make Reservation
                </button>
              </div>
            ) : orderType === 'delivery' ? (
              <form onSubmit={handleDeliverySubmit} className="mt-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Address</label>
                    <input
                      type="text"
                      required
                      value={deliveryDetails.address}
                      onChange={(e) => setDeliveryDetails({...deliveryDetails, address: e.target.value})}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">City</label>
                    <input
                      type="text"
                      required
                      value={deliveryDetails.city}
                      onChange={(e) => setDeliveryDetails({...deliveryDetails, city: e.target.value})}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Postal Code</label>
                    <input
                      type="text"
                      required
                      value={deliveryDetails.postalCode}
                      onChange={(e) => setDeliveryDetails({...deliveryDetails, postalCode: e.target.value})}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Country</label>
                    <input
                      type="text"
                      required
                      value={deliveryDetails.country}
                      onChange={(e) => setDeliveryDetails({...deliveryDetails, country: e.target.value})}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Phone</label>
                    <input
                      type="tel"
                      required
                      value={deliveryDetails.phone}
                      onChange={(e) => setDeliveryDetails({...deliveryDetails, phone: e.target.value})}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  className="w-full mt-6 bg-primary-500 text-white py-2 px-4 rounded-md hover:bg-primary-600 transition-colors"
                >
                  Continue to Payment
                </button>
              </form>
            ) : (
              <button
                onClick={handleReservationSubmit}
                className="w-full mt-6 bg-primary-500 text-white py-2 px-4 rounded-md hover:bg-primary-600 transition-colors"
              >
                Continue to Payment
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;