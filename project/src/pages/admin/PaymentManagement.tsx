import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { format } from 'date-fns';
import { RefreshCw, Eye, RotateCcw, Download } from 'lucide-react';
import SearchBar from '../../components/admin/SearchBar';
import FilterDropdown from '../../components/admin/FilterDropdown';
import ReportButton from '../../components/admin/ReportButton';
import { formatReportData } from '../../../server/utils/reportGenerator';
import {formatCurrency} from '../../../server/utils/FormatCurrency';

interface Payment {
  _id: string;
  order: {
    _id: string;
    totalPrice: number;
  };
  user: {
    name: string;
    email: string;
  };
  amount: number;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  transactionId: string;
  cardLast4: string;
  createdAt: string;
  refundReason?: string;
  paymentMethod: string;
}

const PaymentManagement: React.FC = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [showRefundModal, setShowRefundModal] = useState(false);
  const [refundReason, setRefundReason] = useState('');

  // Search and Filter States
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [amountFilter, setAmountFilter] = useState('all');
  const [methodFilter, setMethodFilter] = useState('all');

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      const { data } = await axios.get('/api/payments', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setPayments(data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch payments');
    } finally {
      setLoading(false);
    }
  };

  const handleRefund = async (payment: Payment) => {
    if (!refundReason.trim()) {
      setError('Refund reason is required');
      return;
    }

    try {
      await axios.post(
        `/api/payments/${payment._id}/refund`,
        { reason: refundReason },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }}
      );
      setShowRefundModal(false);
      setRefundReason('');
      setSelectedPayment(null);
      fetchPayments();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to process refund');
    }
  };

  const filterPayments = (payments: Payment[]) => {
    return payments.filter(payment => {
      // Search filter
      const matchesSearch = 
        payment.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        payment.user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        payment.transactionId.toLowerCase().includes(searchTerm.toLowerCase());

      // Status filter
      const matchesStatus = 
        statusFilter === 'all' || payment.status === statusFilter;

      // Date filter
      const paymentDate = new Date(payment.createdAt);
      const now = new Date();
      const matchesDate =
        dateFilter === 'all' ||
        (dateFilter === 'today' && paymentDate.toDateString() === now.toDateString()) ||
        (dateFilter === 'week' && paymentDate >= new Date(now.setDate(now.getDate() - 7))) ||
        (dateFilter === 'month' && paymentDate >= new Date(now.setMonth(now.getMonth() - 1)));

      // Amount filter
      const amount = payment.amount;
      const matchesAmount =
        amountFilter === 'all' ||
        (amountFilter === 'under50' && amount < 50) ||
        (amountFilter === '50to100' && amount >= 50 && amount <= 100) ||
        (amountFilter === 'over100' && amount > 100);

      // Payment method filter
      const matchesMethod =
        methodFilter === 'all' || payment.paymentMethod === methodFilter;

      return matchesSearch && matchesStatus && matchesDate && matchesAmount && matchesMethod;
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      case 'refunded':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredPayments = filterPayments(payments);

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
        <h1 className="text-2xl font-semibold">Payment Management</h1>
        <div className="flex space-x-4">
          <ReportButton
            data={filteredPayments}
            filename="payments-report"
            formatData={formatReportData.payments}
          />
          <button
            onClick={fetchPayments}
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

      <div className="mb-6 grid grid-cols-1 md:grid-cols-5 gap-4">
        <SearchBar
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder="Search payments..."
        />
        
        <FilterDropdown
          value={statusFilter}
          onChange={setStatusFilter}
          options={[
            { value: 'all', label: 'All Statuses' },
            { value: 'completed', label: 'Completed' },
            { value: 'pending', label: 'Pending' },
            { value: 'failed', label: 'Failed' },
            { value: 'refunded', label: 'Refunded' }
          ]}
          label="Status"
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

        <FilterDropdown
          value={amountFilter}
          onChange={setAmountFilter}
          options={[
            { value: 'all', label: 'All Amounts' },
            { value: 'under50', label: 'Under $50' },
            { value: '50to100', label: '$50 - $100' },
            { value: 'over100', label: 'Over $100' }
          ]}
          label="Amount Range"
        />

        <FilterDropdown
          value={methodFilter}
          onChange={setMethodFilter}
          options={[
            { value: 'all', label: 'All Methods' },
            { value: 'credit_card', label: 'Credit Card' },
            { value: 'debit_card', label: 'Debit Card' }
          ]}
          label="Payment Method"
        />
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Transaction ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Customer
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Amount
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Method
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
            {filteredPayments.map((payment) => (
              <tr key={payment._id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {payment.transactionId}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{payment.user.name}</div>
                  <div className="text-sm text-gray-500">{payment.user.email}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {formatCurrency(payment.amount)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {payment.paymentMethod === 'credit_card' ? 'Credit Card' : 'Debit Card'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(payment.status)}`}>
                    {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {format(new Date(payment.createdAt), 'MMM dd, yyyy')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    className="text-indigo-600 hover:text-indigo-900 mr-4"
                    onClick={() => {/* View details */}}
                  >
                    <Eye size={18} />
                  </button>
                  {payment.status === 'completed' && (
                    <button
                      className="text-red-600 hover:text-red-900"
                      onClick={() => {
                        setSelectedPayment(payment);
                        setShowRefundModal(true);
                      }}
                    >
                      <RotateCcw size={18} />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Refund Modal */}
      {showRefundModal && selectedPayment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h2 className="text-xl font-semibold mb-4">Process Refund</h2>
            <p className="mb-4">
              Are you sure you want to refund payment {selectedPayment.transactionId}?
              Amount: ${selectedPayment.amount.toFixed(2)}
            </p>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Refund Reason
              </label>
              <textarea
                value={refundReason}
                onChange={(e) => setRefundReason(e.target.value)}
                className="w-full px-3 py-2 border rounded-md"
                rows={3}
                required
              />
            </div>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => {
                  setShowRefundModal(false);
                  setSelectedPayment(null);
                  setRefundReason('');
                }}
                className="px-4 py-2 border rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => handleRefund(selectedPayment)}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Process Refund
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentManagement;