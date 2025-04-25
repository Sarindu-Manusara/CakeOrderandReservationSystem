import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const OrderDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState<any>(null);
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const token = localStorage.getItem('token');
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const { data } = await axios.get(`/api/orders/${id}`, config);
        setOrder(data);
        setStatus(data.status || '');
      } catch (error: any) {
        setMessage(error.response?.data?.message || 'Error fetching order');
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id]);

  const handleUpdate = async () => {
    try {
      if (order.isDelivered) {
        setMessage('Cannot update a delivered order');
        return;
      }

      const token = localStorage.getItem('token');
      const config = {
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      };

      const { data } = await axios.put(
        `/api/orders/${id}/cancel`,
        { status },
        config
      );  

      setMessage('Order updated successfully!');
      setOrder(data);
    } catch (error: any) {
      setMessage(error.response?.data?.message || 'Update failed');
    }
  };

  if (loading) return <p>Loading order details...</p>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-semibold mb-4">Order Details</h1>

      {message && <div className="mb-4 text-blue-600">{message}</div>}

      <div className="bg-white shadow p-4 rounded-md mb-6">
        <p><strong>Order ID:</strong> {order._id}</p>
        <p><strong>Date:</strong> {new Date(order.createdAt).toLocaleDateString()}</p>
        <p><strong>Total:</strong> ₹{order.totalPrice}</p>

        <label className="block mt-4 mb-1">Update Status</label>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="Cancelled">Cancelled</option>
        </select>

        <button
          onClick={handleUpdate}
          className="mt-4 bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
        >
          Update Order
        </button>
      </div>

      <button
        onClick={() => navigate('/profile')}
        className="text-indigo-600 underline"
      >
        Back to Profile
      </button>
    </div>
  );
};

export default OrderDetailPage;
