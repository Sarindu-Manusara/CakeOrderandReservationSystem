import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { format } from 'date-fns';
import { RefreshCw, Eye, Trash2 } from 'lucide-react';
import SearchBar from '../../components/admin/SearchBar';
import FilterDropdown from '../../components/admin/FilterDropdown';
import ReportButton from '../../components/admin/ReportButton';
import { formatCurrency } from '../../../server/utils/FormatCurrency';
import { formatReportData } from '../../../server/utils/reportGenerator';

interface CustomCake {
  _id: string;
  user: {
    name: string;
    email: string;
  };
  size: string;
  flavor: string;
  frosting: string;
  decorations: string[];
  message?: string;
  specialRequests?: string;
  price: number;
  reservationDate?: string;
  createdAt: string;
}

const CustomCakeManagement: React.FC = () => {
  const [customCakes, setCustomCakes] = useState<CustomCake[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedCake, setSelectedCake] = useState<CustomCake | null>(null);

  // Search and Filter States
  const [searchTerm, setSearchTerm] = useState('');
  const [sizeFilter, setSizeFilter] = useState('all');
  const [flavorFilter, setFlavorFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [priceFilter, setPriceFilter] = useState('all');

  useEffect(() => {
    fetchCustomCakes();
  }, []);

  const fetchCustomCakes = async () => {
    try {
      const { data } = await axios.get('/api/custom-cakes/all', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setCustomCakes(data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch custom cakes');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this custom cake?')) return;

    try {
      await axios.delete(`/api/custom-cakes/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      fetchCustomCakes();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to delete custom cake');
    }
  };

  const filterCustomCakes = (cakes: CustomCake[]) => {
    return cakes.filter(cake => {
      const matchesSearch = 
        cake.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cake.user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cake.flavor.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesSize = 
        sizeFilter === 'all' || cake.size === sizeFilter;

      const matchesFlavor =
        flavorFilter === 'all' || cake.flavor === flavorFilter;

      const cakeDate = new Date(cake.createdAt);
      const now = new Date();
      const matchesDate =
        dateFilter === 'all' ||
        (dateFilter === 'today' && cakeDate.toDateString() === now.toDateString()) ||
        (dateFilter === 'week' && cakeDate >= new Date(now.setDate(now.getDate() - 7))) ||
        (dateFilter === 'month' && cakeDate >= new Date(now.setMonth(now.getMonth() - 1)));

      const price = cake.price;
      const matchesPrice =
        priceFilter === 'all' ||
        (priceFilter === 'under5000' && price < 5000) ||
        (priceFilter === '5000to10000' && price >= 5000 && price <= 10000) ||
        (priceFilter === 'over10000' && price > 10000);

      return matchesSearch && matchesSize && matchesFlavor && matchesDate && matchesPrice;
    });
  };

  const filteredCakes = filterCustomCakes(customCakes);
  const sizes = Array.from(new Set(customCakes.map(cake => cake.size)));
  const flavors = Array.from(new Set(customCakes.map(cake => cake.flavor)));

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
        <h1 className="text-2xl font-semibold">Custom Cake Management</h1>
        <div className="flex space-x-4">
          <ReportButton
            data={filteredCakes}
            filename="custom-cakes-report"
            formatData={formatReportData.customCakes}
          />
          <button
            onClick={fetchCustomCakes}
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
          placeholder="Search custom cakes..."
        />
        
        <FilterDropdown
          value={sizeFilter}
          onChange={setSizeFilter}
          options={[
            { value: 'all', label: 'All Sizes' },
            ...sizes.map(size => ({ value: size, label: size }))
          ]}
          label="Size"
        />

        <FilterDropdown
          value={flavorFilter}
          onChange={setFlavorFilter}
          options={[
            { value: 'all', label: 'All Flavors' },
            ...flavors.map(flavor => ({ value: flavor, label: flavor }))
          ]}
          label="Flavor"
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
          value={priceFilter}
          onChange={setPriceFilter}
          options={[
            { value: 'all', label: 'All Prices' },
            { value: 'under5000', label: 'Under Rs. 5,000' },
            { value: '5000to10000', label: 'Rs. 5,000 - Rs. 10,000' },
            { value: 'over10000', label: 'Over Rs. 10,000' }
          ]}
          label="Price Range"
        />
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Customer
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Cake Details
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Price
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Reservation
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Created
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredCakes.map((cake) => (
              <tr key={cake._id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{cake.user.name}</div>
                  <div className="text-sm text-gray-500">{cake.user.email}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900">
                    {cake.size} {cake.flavor} Cake
                  </div>
                  <div className="text-sm text-gray-500">
                    {cake.frosting} frosting
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {formatCurrency(cake.price)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {cake.reservationDate ? (
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                      {format(new Date(cake.reservationDate), 'MMM dd, yyyy')}
                    </span>
                  ) : (
                    <span className="text-sm text-gray-500">No reservation</span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {format(new Date(cake.createdAt), 'MMM dd, yyyy')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    className="text-indigo-600 hover:text-indigo-900 mr-4"
                    onClick={() => {
                      setSelectedCake(cake);
                      setShowDetailsModal(true);
                    }}
                  >
                    <Eye size={18} />
                  </button>
                  <button
                    className="text-red-600 hover:text-red-900"
                    onClick={() => handleDelete(cake._id)}
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Details Modal */}
      {showDetailsModal && selectedCake && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h2 className="text-xl font-semibold mb-4">Custom Cake Details</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium text-gray-700">Basic Information</h3>
                <p>Size: {selectedCake.size}</p>
                <p>Flavor: {selectedCake.flavor}</p>
                <p>Frosting: {selectedCake.frosting}</p>
              </div>
              
              <div>
                <h3 className="font-medium text-gray-700">Decorations</h3>
                <ul className="list-disc list-inside">
                  {selectedCake.decorations.map((decoration, index) => (
                    <li key={index}>{decoration}</li>
                  ))}
                </ul>
              </div>

              {selectedCake.message && (
                <div>
                  <h3 className="font-medium text-gray-700">Message</h3>
                  <p>{selectedCake.message}</p>
                </div>
              )}

              {selectedCake.specialRequests && (
                <div>
                  <h3 className="font-medium text-gray-700">Special Requests</h3>
                  <p>{selectedCake.specialRequests}</p>
                </div>
              )}

              {selectedCake.reservationDate && (
                <div>
                  <h3 className="font-medium text-gray-700">Reservation Date</h3>
                  <p>{format(new Date(selectedCake.reservationDate), 'MMMM dd, yyyy')}</p>
                </div>
              )}
            </div>
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => {
                  setShowDetailsModal(false);
                  setSelectedCake(null);
                }}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomCakeManagement;