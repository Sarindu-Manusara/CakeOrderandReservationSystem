import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { Order } from '../types';
import { useNavigate } from 'react-router-dom';

const ProfilePage = () => {
  const { user, logout, setUser } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [ordersError, setOrdersError] = useState('');
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem('token');
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };
        const { data } = await axios.get('/api/orders/myorders', config);
        setOrders(data);
      } catch (error: any) {
        setOrdersError(error.response?.data?.message || 'Failed to load orders');
      } finally {
        setOrdersLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const cancelOrder = async (orderId: string) => {
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
  
      await axios.put(`/api/orders/${orderId}/cancel`, {}, config);
  
      // Update local order state manually
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === orderId ? { ...order, isCancelled: true } : order
        )
      );
    } catch (error) {
      console.error('Failed to cancel order', error);
    }
  };
  

  const handleDeleteProfile = async (userId: string) => {
    if (!window.confirm('Are you sure you want to delete your profile? This action cannot be undone.')) return;

    try {
      await axios.delete(`/api/users/${userId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });

      await logout();
      navigate('/');
    } catch (err: any) {
      console.error('Delete error:', err);
      alert(err.response?.data?.message || 'Failed to delete profile');
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const token = localStorage.getItem('token');

      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      };

      const { data } = await axios.put(
        '/api/users/profile',
        { name, phone, password },
        config
      );

      setUser(data);
      localStorage.setItem('user', JSON.stringify(data));
      setMessage('Profile updated successfully!');
    } catch (error: any) {
      setMessage(error.response?.data?.message || 'Profile update failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-blue-600">My Profile</h1>

      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4 text-blue-600">Account Information</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <p className="text-gray-600 mb-1">Name</p>
            <p className="font-medium">{user?.name || 'N/A'}</p>
          </div>
          <div>
            <p className="text-gray-600 mb-1">Email</p>
            <p className="font-medium">{user?.email || 'N/A'}</p>
          </div>
        </div>

        <div className="flex gap-4 mt-4">
          <button
            onClick={logout}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors"
          >
            Logout
          </button>
          {user && (
            <button
              onClick={() => handleDeleteProfile(user._id)}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
            >
              Delete Profile
            </button>
          )}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4 text-blue-600">Order History</h2>
        <div className="mt-4">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="text-left p-2 border text-yellow-600">Order ID</th>
                <th className="text-left p-2 border text-yellow-600">Date</th>
                <th className="text-left p-2 border text-yellow-600">Total</th>
                <th className="text-left p-2 border text-yellow-600">Status</th>
                <th className="text-left p-2 border text-yellow-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {ordersLoading ? (
                <tr>
                  <td colSpan={5} className="p-4 text-center">Loading orders...</td>
                </tr>
              ) : ordersError ? (
                <tr>
                  <td colSpan={5} className="p-4 text-red-600 text-center">{ordersError}</td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-4 text-center text-gray-500 text-yellow-600">No orders found</td>
                </tr>
              ) : (
                orders.map((order) => {
                  let status = 'Processing';
                  if (order.isCancelled) status = 'Cancelled';
                  else if (order.isDelivered) status = 'Delivered';
                  else if (order.isPaid) status = 'Paid';

                  return (
                    <tr key={order._id}>
                      <td className="p-2 border">{order._id}</td>
                      <td className="p-2 border">{new Date(order.createdAt).toLocaleDateString()}</td>
                      <td className="p-2 border">Rs.{order.totalPrice.toFixed(2)}</td>
                      <td className="p-2 border">{status}</td>
                      <td className="p-2 border">
                        <button
                          onClick={() => cancelOrder(order._id)}
                          disabled={order.isCancelled || order.isDelivered || order.isPaid}
                          className={`px-3 py-1 rounded text-white ${
                            order.isCancelled || order.isDelivered || order.isPaid
                              ? 'bg-gray-400 cursor-not-allowed'
                              : 'bg-blue-600 hover:bg-blue-500'
                          }`}
                        >
                          {order.isCancelled ? 'Cancelled' : 'Cancel'}
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mt-8">
        <h2 className="text-xl font-semibold mb-4 text-blue-600">Personal Information</h2>

        {message && (
          <div className="mb-4 p-3 bg-blue-100 text-blue-800 rounded-md">
            {message}
          </div>
        )}

        <form onSubmit={handleUpdate} className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-700 mb-1">Full Name</label>
            <input
              type="text"
              className="w-full p-2 border rounded"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-1">Email</label>
            <input
              type="email"
              className="w-full p-2 border rounded"
              value={user?.email || ''}
              disabled
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-1">Phone</label>
            <input
              type="tel"
              className="w-full p-2 border rounded"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-1">New Password</label>
            <input
              type="password"
              className="w-full p-2 border rounded"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Leave blank to keep current"
            />
          </div>

          <div className="md:col-span-2 mt-4">
            <button
              type="submit"
              disabled={loading}
              className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition-colors disabled:opacity-50"
            >
              {loading ? 'Updating...' : 'Update Profile'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfilePage;
