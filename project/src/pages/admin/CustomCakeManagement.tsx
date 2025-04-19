import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { format } from 'date-fns';
import { RefreshCw, Eye, Trash2 } from 'lucide-react';

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

  useEffect(() => {
    fetchCustomCakes();
  }, []);

  const fetchCustomCakes = async () => {
    const token = localStorage.getItem('token');
  
    if (!token) {
      setError('No token found. Please log in.');
      setLoading(false);
      return;
    }
  
    try {
      console.log('Sending token:', token);
  
      const { data } = await axios.get('/api/custom-cakes/all', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setCustomCakes(data);
    } catch (err: any) {
      console.error(err);
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
        <button
          onClick={fetchCustomCakes}
          className="flex items-center px-4 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600"
        >
          <RefreshCw size={18} className="mr-2" />
          Refresh
        </button>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 text-red-600 rounded-lg">
          {error}
        </div>
      )}

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
            {customCakes.map((cake) => (
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
                  ${cake.price.toFixed(2)}
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