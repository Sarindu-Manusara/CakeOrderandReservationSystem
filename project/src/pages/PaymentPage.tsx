import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { CreditCard, Calendar, Truck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { formatCurrency } from '../../server/utils/FormatCurrency';

interface OrderDetails {
  _id: string;
  isReservation: boolean;
  totalPrice: number;
  shippingAddress?: {
    address: string;
    city: string;
    postalCode: string;
    country: string;
  };
  orderItems: Array<{
    name: string;
    quantity: number;
    price: number;
    isCustom: boolean;
    reservationDate?: string;
  }>;
}

const PaymentPage: React.FC = () => {
  const [order, setOrder] = useState<OrderDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [processing, setProcessing] = useState(false);

  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    fetchOrderDetails();
  }, [id]);

  const fetchOrderDetails = async () => {
    try {
      const { data } = await axios.get(`/api/orders/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setOrder(data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch order details');
    } finally {
      setLoading(false);
    }
  };

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || '';
    const parts = [];

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    if (parts.length) {
      return parts.join(' ');
    } else {
      return value;
    }
  };

  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return `${v.slice(0, 2)}/${v.slice(2, 4)}`;
    }
    return v;
  };

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!order) return;

    setProcessing(true);
    setError('');

    try {
      // First process the payment
      const paymentResponse = await axios.post(
        '/api/payments',
        {
          orderId: order._id,
          paymentMethod: 'credit_card',
          cardNumber: cardNumber.replace(/\s/g, ''),
          expiryDate,
          cvv
        },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        }
      );

      if (paymentResponse.data.status === 'completed') {
        // Update order status
        await axios.put(
          `/api/orders/${order._id}/pay`,
          {
            id: paymentResponse.data.transactionId,
            status: 'COMPLETED',
            update_time: new Date().toISOString(),
            email_address: user?.email
          },
          {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
          }
        );

        navigate('/profile');
      } else {
        setError('Payment failed. Please try again.');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Payment failed');
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12 flex justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-blue-600">Order Not Found</h2>
          <p className="mt-2">The order you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-blue-600">Payment Details</h1>

        {error && (
          <div className="mb-6 p-4 bg-blue-50 text-red-600 rounded-lg">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-xl font-semibold mb-4 text-blue-600">Order Summary</h2>
              <div className="space-y-3">
                {order.orderItems.map((item, index) => (
                  <div key={index} className="flex justify-between">
                    <span>{item.name} x {item.quantity}</span>
                    <span>{formatCurrency(item.price * item.quantity)}</span>
                  </div>
                ))}
                <div className="border-t pt-3 mt-3">
                  <div className="flex justify-between font-semibold text-lg text-yellow-600">
                    <span>Total</span>
                    <span>{formatCurrency(order.totalPrice)}</span>
                  </div>
                </div>
              </div>
            </div>

            {order.isReservation ? (
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center text-primary-600 mb-2">
                  <Calendar size={20} className="mr-2" />
                  <h3 className="font-semibold text-blue-600">Reservation Details</h3>
                </div>
                {order.orderItems.map((item, index) => (
                  item.reservationDate && (
                    <p key={index} className="text-gray-600">
                      Reserved for: {new Date(item.reservationDate).toLocaleDateString()}
                    </p>
                  )
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center text-primary-600 mb-2">
                  <Truck size={20} className="mr-2" />
                  <h3 className="font-semibold text-blue-600">Delivery Details</h3>
                </div>
                <div className="text-gray-600">
                  <p>{order.shippingAddress?.address}</p>
                  <p>{order.shippingAddress?.city}, {order.shippingAddress?.postalCode}</p>
                  <p>{order.shippingAddress?.country}</p>
                </div>
              </div>
            )}
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center mb-6">
              <CreditCard size={24} className="mr-2 text-primary-600" />
              <h2 className="text-xl font-semibold text-blue-600">Payment Method</h2>
            </div>

            <form onSubmit={handlePayment} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Card Number
                </label>
                <input
                  type="text"
                  required
                  maxLength={19}
                  value={cardNumber}
                  onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                  placeholder="1234 5678 9012 3456"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Expiry Date
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={5}
                    value={expiryDate}
                    onChange={(e) => setExpiryDate(formatExpiryDate(e.target.value))}
                    placeholder="MM/YY"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    CVV
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={3}
                    value={cvv}
                    onChange={(e) => setCvv(e.target.value.replace(/\D/g, ''))}
                    placeholder="123"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={processing}
                className="w-full mt-6 bg-primary-500 text-white py-3 px-4 rounded-md hover:bg-primary-600 transition-colors disabled:opacity-50"
              >
                {processing ? 'Processing...' : `Pay ${formatCurrency(order.totalPrice)}`}
              </button>
            </form>

            <div className="mt-6 text-sm text-gray-500">
              <p>This is a demo payment form. Use any valid-looking card details.</p>
              <p>Example: 4242 4242 4242 4242, 12/25, 123</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;