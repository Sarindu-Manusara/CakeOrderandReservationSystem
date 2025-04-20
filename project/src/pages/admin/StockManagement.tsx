import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Edit2, Trash2, RefreshCw, CloudSun, Thermometer, Droplets, Clock } from 'lucide-react';
import { Cake } from '../../types';
import SearchBar from '../../components/admin/SearchBar';
import FilterDropdown from '../../components/admin/FilterDropdown';
import ReportButton from '../../components/admin/ReportButton';
import { formatReportData } from '../../../server/utils/reportGenerator';
import { formatCurrency } from '../../../server/utils/FormatCurrency';

interface WeatherInfo {
  temperature: number;
  condition: string;
  humidity: number;
}

interface StockUpdate {
  timestamp: string;
  changes: Array<{
    cakeId: string;
    cakeName: string;
    oldStock: number;
    newStock: number;
    reason: string;
  }>;
}

const StockManagement: React.FC = () => {
  const [cakes, setCakes] = useState<Cake[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingCake, setEditingCake] = useState<Cake | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [availabilityFilter, setAvailabilityFilter] = useState('all');
  const [priceFilter, setPriceFilter] = useState('all');
  const [weatherInfo, setWeatherInfo] = useState<WeatherInfo | null>(null);
  const [stockUpdates, setStockUpdates] = useState<StockUpdate[]>([]);
  const [showUpdateHistory, setShowUpdateHistory] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    image: '',
    flavors: [] as string[],
    sizes: [] as string[],
    isAvailable: true,
    featured: false,
    weatherSensitive: false,
    minimumStock: 5,
    maximumStock: 50,
    stock: 10
  });

  useEffect(() => {
    fetchCakes();
    fetchWeatherInfo();
    const interval = setInterval(() => {
      fetchWeatherInfo();
      fetchCakes();
    }, 180000); // Check every 3 minutes

    return () => clearInterval(interval);
  }, []);

  const fetchWeatherInfo = async () => {
    try {
      const { data } = await axios.get('/api/weather/current');
      setWeatherInfo(data);
    } catch (err) {
      console.error('Failed to fetch weather info:', err);
    }
  };

  const fetchCakes = async () => {
    try {
      const { data } = await axios.get('/api/cakes', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setCakes(data);

      // Compare with previous stock levels and record changes
      const previousCakes = cakes;
      const changes = data.filter((newCake: Cake) => {
        const oldCake = previousCakes.find(c => c._id === newCake._id);
        return oldCake && oldCake.stock !== newCake.stock;
      }).map((changedCake: Cake) => {
        const oldCake = previousCakes.find(c => c._id === changedCake._id);
        return {
          cakeId: changedCake._id,
          cakeName: changedCake.name,
          oldStock: oldCake?.stock || 0,
          newStock: changedCake.stock,
          reason: getStockChangeReason(changedCake, weatherInfo)
        };
      });

      if (changes.length > 0) {
        setStockUpdates(prev => [{
          timestamp: new Date().toISOString(),
          changes
        }, ...prev].slice(0, 10)); // Keep last 10 updates
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch cakes');
    } finally {
      setLoading(false);
    }
  };

  const getStockChangeReason = (cake: Cake, weather: WeatherInfo | null): string => {
    if (!weather || !cake.weatherSensitive) return 'Manual update';
    
    const { temperature } = weather;
    if (temperature > 28) {
      return cake.category.toLowerCase().includes('ice cream') 
        ? 'Increased due to hot weather'
        : 'Decreased due to hot weather';
    }
    if (temperature < 22) {
      return cake.category.toLowerCase().includes('ice cream')
        ? 'Decreased due to cold weather'
        : 'Increased due to cold weather';
    }
    return 'Weather-based adjustment';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const cakeData = {
        ...formData,
        price: parseFloat(formData.price),
        weatherSensitive: Boolean(formData.weatherSensitive),
        minimumStock: parseInt(formData.minimumStock.toString()),
        maximumStock: parseInt(formData.maximumStock.toString()),
        stock: parseInt(formData.stock.toString())
      };

      if (editingCake) {
        await axios.put(
          `/api/cakes/${editingCake._id}`,
          cakeData,
          { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }}
        );
      } else {
        await axios.post(
          '/api/cakes',
          cakeData,
          { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }}
        );
      }
      fetchCakes();
      setShowForm(false);
      setEditingCake(null);
      setFormData({
        name: '',
        description: '',
        price: '',
        category: '',
        image: '',
        flavors: [],
        sizes: [],
        isAvailable: true,
        featured: false,
        weatherSensitive: false,
        minimumStock: 5,
        maximumStock: 50,
        stock: 10
      });
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to save cake');
    }
  };

  const handleEdit = (cake: Cake) => {
    setEditingCake(cake);
    setFormData({
      name: cake.name,
      description: cake.description,
      price: cake.price.toString(),
      category: cake.category,
      image: cake.image,
      flavors: cake.flavors,
      sizes: cake.sizes,
      isAvailable: cake.isAvailable,
      featured: cake.featured || false,
      weatherSensitive: cake.weatherSensitive || false,
      minimumStock: cake.minimumStock || 5,
      maximumStock: cake.maximumStock || 50,
      stock: cake.stock || 10
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this cake?')) return;

    try {
      await axios.delete(`/api/cakes/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      fetchCakes();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to delete cake');
    }
  };

  const filterCakes = (cakes: Cake[]) => {
    return cakes.filter(cake => {
      const matchesSearch = 
        cake.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cake.description.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCategory = 
        categoryFilter === 'all' || cake.category === categoryFilter;

      const matchesAvailability =
        availabilityFilter === 'all' ||
        (availabilityFilter === 'available' && cake.isAvailable) ||
        (availabilityFilter === 'unavailable' && !cake.isAvailable);

      const price = cake.price;
      const matchesPrice =
        priceFilter === 'all' ||
        (priceFilter === 'under25' && price < 25) ||
        (priceFilter === '25to50' && price >= 25 && price <= 50) ||
        (priceFilter === 'over50' && price > 50);

      return matchesSearch && matchesCategory && matchesAvailability && matchesPrice;
    });
  };

  const getWeatherImpactClass = (cake: Cake) => {
    if (!cake.weatherSensitive || !weatherInfo) return '';
    
    const { temperature } = weatherInfo;
    if (temperature > 30) {
      return cake.category.toLowerCase().includes('ice cream') ? 
        'bg-red-50 border-l-4 border-red-500' : '';
    }
    if (temperature < 22) {
      return cake.category.toLowerCase().includes('ice cream') ? 
        'bg-blue-50 border-l-4 border-blue-500' : '';
    }
    return '';
  };

  const handleManualStockAdjustment = async () => {
    try {
      const { data } = await axios.post('/api/weather/adjust-stock', {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      alert(data.message);
      fetchCakes(); // Refresh cake data after adjustment
    } catch (err) {
      console.error('Manual adjustment failed:', err);
      alert('Stock adjustment failed.');
    }
  };

  const filteredCakes = filterCakes(cakes);
  const categories = Array.from(new Set(cakes.map(cake => cake.category)));

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
        <h1 className="text-2xl font-semibold">Stock Management</h1>
        <div className="flex space-x-4">
          {weatherInfo && (
            <div className="bg-white rounded-lg shadow-sm p-3 flex items-center space-x-4">
              <div className="flex items-center">
                <Thermometer className="text-primary-500 mr-2" size={18} />
                <span>{weatherInfo.temperature}°C</span>
              </div>
              <div className="flex items-center">
                <Droplets className="text-primary-500 mr-2" size={18} />
                <span>{weatherInfo.humidity}%</span>
              </div>
              <button
                onClick={() => setShowUpdateHistory(!showUpdateHistory)}
                className="flex items-center text-primary-600 hover:text-primary-700"
              >
                <Clock size={18} className="mr-1" />
                History
              </button>
            </div>
          )}
          <ReportButton
            data={filteredCakes}
            filename="products-report"
            formatData={formatReportData.products}
          />
          <button
            onClick={() => {
              fetchCakes();
              fetchWeatherInfo();
            }}
            className="flex items-center px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
          >
            <RefreshCw size={18} className="mr-2" />
            Refresh
          </button>
          <button
            className="ml-2 px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded shadow"
            onClick={handleManualStockAdjustment}
          >
            <RefreshCw className="inline-block mr-1" size={16} />
            Manual Stock Adjustment
          </button>

          <button
            onClick={() => setShowForm(true)}
            className="flex items-center px-4 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600"
          >
            <Plus size={18} className="mr-2" />
            Add New Cake
          </button>
        </div>
      </div>

      {/* Stock Update History Modal */}
      {showUpdateHistory && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Stock Update History</h2>
              <button
                onClick={() => setShowUpdateHistory(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ×
              </button>
            </div>
            {stockUpdates.length === 0 ? (
              <p className="text-gray-500">No recent stock updates</p>
            ) : (
              <div className="space-y-4">
                {stockUpdates.map((update, index) => (
                  <div key={index} className="border-b pb-4">
                    <div className="text-sm text-gray-500 mb-2">
                      {new Date(update.timestamp).toLocaleString()}
                    </div>
                    {update.changes.map((change, changeIndex) => (
                      <div key={changeIndex} className="flex items-center justify-between text-sm">
                        <span>{change.cakeName}</span>
                        <div className="flex items-center">
                          <span className="text-gray-500">{change.oldStock}</span>
                          <span className="mx-2">→</span>
                          <span className={change.newStock > change.oldStock ? 'text-green-600' : 'text-red-600'}>
                            {change.newStock}
                          </span>
                          <span className="ml-2 text-xs text-gray-500">({change.reason})</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {error && (
        <div className="mb-4 p-4 bg-red-50 text-red-600 rounded-lg">
          {error}
        </div>
      )}

      <div className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
        <SearchBar
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder="Search cakes..."
        />
        
        <FilterDropdown
          value={categoryFilter}
          onChange={setCategoryFilter}
          options={[
            { value: 'all', label: 'All Categories' },
            ...categories.map(cat => ({ value: cat, label: cat }))
          ]}
          label="Category"
        />

        <FilterDropdown
          value={availabilityFilter}
          onChange={setAvailabilityFilter}
          options={[
            { value: 'all', label: 'All Status' },
            { value: 'available', label: 'Available' },
            { value: 'unavailable', label: 'Out of Stock' }
          ]}
          label="Availability"
        />

        <FilterDropdown
          value={priceFilter}
          onChange={setPriceFilter}
          options={[
            { value: 'all', label: 'All Prices' },
            { value: 'under25', label: 'Under $25' },
            { value: '25to50', label: '$25 - $50' },
            { value: 'over50', label: 'Over $50' }
          ]}
          label="Price Range"
        />
      </div>

      {showForm && (
        <div className="mb-6 bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">
            {editingCake ? 'Edit Cake' : 'Add New Cake'}
          </h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <input
                type="text"
                required
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Price
              </label>
              <input
                type="number"
                required
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Image URL
              </label>
              <input
                type="url"
                required
                value={formData.image}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                required
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-3 py-2 border rounded-md"
                rows={3}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Flavors (comma-separated)
              </label>
              <input
                type="text"
                value={formData.flavors.join(', ')}
                onChange={(e) => setFormData({ ...formData, flavors: e.target.value.split(',').map(f => f.trim()) })}
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Sizes (comma-separated)
              </label>
              <input
                type="text"
                value={formData.sizes.join(', ')}
                onChange={(e) => setFormData({ ...formData, sizes: e.target.value.split(',').map(s => s.trim()) })}
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>
            <div className="flex items-center space-x-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.isAvailable}
                  onChange={(e) => setFormData({ ...formData, isAvailable: e.target.checked })}
                  className="mr-2"
                />
                Available
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.featured}
                  onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                  className="mr-2"
                />
                Featured
              </label>
            </div>

            <div className="md:col-span-2">
              <h3 className="font-medium text-gray-700 mb-2">Stock Management</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={formData.weatherSensitive}
                      onChange={(e) => setFormData({ ...formData, weatherSensitive: e.target.checked })}
                      className="rounded text-primary-600"
                    />
                    <span>Weather Sensitive</span>
                  </label>
                  <p className="text-sm text-gray-500 mt-1">
                    Stock will be automatically adjusted based on weather conditions
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Minimum Stock
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.minimumStock}
                    onChange={(e) => setFormData({ ...formData, minimumStock: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 border rounded-md"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Maximum Stock
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.maximumStock}
                    onChange={(e) => setFormData({ ...formData, maximumStock: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 border rounded-md"
                  />
                </div>
              </div>
            </div>

            <div className="md:col-span-2 flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setEditingCake(null);
                }}
                className="px-4 py-2 border rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600"
              >
                {editingCake ? 'Update Cake' : 'Add Cake'}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Image
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Category
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Price
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Stock
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Weather Sensitive
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredCakes.map((cake) => (
              <tr key={cake._id} className={getWeatherImpactClass(cake)}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <img
                    src={cake.image}
                    alt={cake.name}
                    className="h-12 w-12 rounded-full object-cover"
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{cake.name}</div>
                  <div className="text-sm text-gray-500">{cake.description.substring(0, 50)}...</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {cake.category}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  ${cake.price.toFixed(2)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    cake.isAvailable
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {cake.isAvailable ? 'Available' : 'Out of Stock'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <span className={`font-medium ${
                      cake.stock <= cake.minimumStock ? 'text-red-600' :
                      cake.stock >= cake.maximumStock ? 'text-green-600' :
                      'text-gray-900'
                    }`}>
                      {cake.stock}
                    </span>
                    {cake.weatherSensitive && weatherInfo && (
                      <CloudSun 
                        size={16} 
                        className={`ml-2 ${
                          weatherInfo.temperature > 30 ? 'text-red-500' :
                          weatherInfo.temperature < 22 ? 'text-blue-500' :
                          'text-primary-500'
                        }`} 
                      />
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    cake.weatherSensitive
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {cake.weatherSensitive ? 'Yes' : 'No'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => handleEdit(cake)}
                    className="text-indigo-600 hover:text-indigo-900 mr-4"
                  >
                    <Edit2 size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(cake._id)}
                    className="text-red-600 hover:text-red-900"
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

export default StockManagement;