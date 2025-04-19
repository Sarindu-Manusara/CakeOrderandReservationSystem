import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { format } from 'date-fns';
import { Eye, Trash2, RefreshCw } from 'lucide-react';
import SearchBar from '../../components/admin/SearchBar';
import FilterDropdown from '../../components/admin/FilterDropdown';
import ReportButton from '../../components/admin/ReportButton';
import { formatReportData } from '../../../server/utils/reportGenerator';

interface Order {
  _id: string;
  user: {
    name: string;
    email: string;
  };
  orderItems: Array<{
    name: string;
    qty: number;
    price: number;
    isCustom: boolean;
  }>;
  totalPrice: number;
  isPaid: boolean;
  isDelivered: boolean;
  createdAt: string;
  isReservation: boolean;
}

const OrderManagement: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const { data } = await axios.get('/api/orders', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setOrders(data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (orderId: string, status: string) => {
    try {
      await axios.put(
        `/api/orders/${orderId}/status`,
        { status },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }}
      );
      fetchOrders();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update order status');
    }
  };

  const handleDelete = async (orderId: string) => {
    if (!window.confirm('Are you sure you want to delete this order?')) return;

    try {
      await axios.delete(`/api/orders/${orderId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      fetchOrders();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to delete order');
    }
  };

  const filterOrders = (orders: Order[]) => {
    return orders.filter(order => {
      const matchesSearch = 
        order.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order._id.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus = 
        statusFilter === 'all' ||
        (statusFilter === 'pending' && !order.isPaid) ||
        (statusFilter === 'paid' && order.isPaid && !order.isDelivered) ||
        (statusFilter === 'delivered' && order.isDelivered);

      const matchesType =
        typeFilter === 'all' ||
        (typeFilter === 'delivery' && !order.isReservation) ||
        (typeFilter === 'reservation' && order.isReservation);

      const orderDate = new Date(order.createdAt);
      const now = new Date();
      const matchesDate =
        dateFilter === 'all' ||
        (dateFilter === 'today' && orderDate.toDateString() === now.toDateString()) ||
        (dateFilter === 'week' && orderDate >= new Date(now.setDate(now.getDate() - 7))) ||
        (dateFilter === 'month' && orderDate >= new Date(now.setMonth(now.getMonth() - 1)));

      return matchesSearch && matchesStatus && matchesType && matchesDate;
    });
  };

  const filteredOrders = filterOrders(orders);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Order Management</h1>
        <div className="flex space-x-4">
          <ReportButton
            data={filteredOrders}
            filename="orders-report"
            formatData={formatReportData.orders}
          />
          <button
            onClick={fetchOrders}
            className="flex items-center px-4 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600"
          >
            <RefreshCw size={18} className="mr-2" />
            Refresh
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 text-red-600 rounded-lg">
          {error}
        </div>
      )}

      <div className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
        <SearchBar
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder="Search orders..."
        />
        
        <FilterDropdown
          value={statusFilter}
          onChange={setStatusFilter}
          options={[
            { value: 'all', label: 'All Statuses' },
            { value: 'pending', label: 'Pending' },
            { value: 'paid', label: 'Paid' },
            { value: 'delivered', label: 'Delivered' }
          ]}
          label="Status"
        />

        <FilterDropdown
          value={typeFilter}
          onChange={setTypeFilter}
          options={[
            { value: 'all', label: 'All Types' },
            { value: 'delivery', label: 'Delivery' },
            { value: 'reservation', label: 'Reservation' }
          ]}
          label="Type"
        />

        <FilterDropdown
          value={dateFilter}
          onChange={setDateFilter}
          options={[
            { value: 'all', label: 'All Time' },
            { value: 'today', label: 'Today' },
            { value: 'week', label: 'This Week' },
            { value: 'month', label: 'This Month' }
          ]}
          label="Date Range"
        />
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Order ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Customer
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredOrders.map((order) => (
              <tr key={order._id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {order._id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{order.user.name}</div>
                  <div className="text-sm text-gray-500">{order.user.email}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    order.isReservation
                      ? 'bg-purple-100 text-purple-800'
                      : 'bg-blue-100 text-blue-800'
                  }`}>
                    {order.isReservation ? 'Reservation' : 'Delivery'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  ${order.totalPrice.toFixed(2)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <select
                    value={order.isDelivered ? 'delivered' : order.isPaid ? 'paid' : 'pending'}
                    onChange={(e) => handleStatusUpdate(order._id, e.target.value)}
                    className="text-sm rounded-md border-gray-300"
                  >
                    <option value="pending">Pending</option>
                    <option value="paid">Paid</option>
                    <option value="delivered">Delivered</option>
                  </select>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {format(new Date(order.createdAt), 'MMM dd, yyyy')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    className="text-indigo-600 hover:text-indigo-900 mr-4"
                    onClick={() => {/* View details */}}
                  >
                    <Eye size={18} />
                  </button>
                  <button
                    className="text-red-600 hover:text-red-900"
                    onClick={() => handleDelete(order._id)}
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrderManagement;