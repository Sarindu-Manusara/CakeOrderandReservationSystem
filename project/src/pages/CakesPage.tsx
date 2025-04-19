import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, Filter } from 'lucide-react';
import CakeCard from '../components/ui/CakeCard';
import { Cake } from '../types';

const categories = [
  { id: 'all', name: 'All Cakes' },
  { id: 'chocolate', name: 'Chocolate' },
  { id: 'vanilla', name: 'Vanilla' },
  { id: 'fruit', name: 'Fruit' },
  { id: 'red-velvet', name: 'Red Velvet' },
  { id: 'specialty', name: 'Specialty' }
];

const CakesPage: React.FC = () => {
  const [cakes, setCakes] = useState<Cake[]>([]);
  const [filteredCakes, setFilteredCakes] = useState<Cake[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const fetchCakes = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get('/api/cakes');
        setCakes(data);
        setFilteredCakes(data);
      } catch (error) {
        console.error('Error fetching cakes:', error);
        setError('Failed to load cakes. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchCakes();
  }, []);

  useEffect(() => {
    // Filter cakes based on search term and category
    let result = cakes;
    
    if (searchTerm.trim()) {
      result = result.filter(cake => 
        cake.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cake.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (selectedCategory !== 'all') {
      result = result.filter(cake => cake.category === selectedCategory);
    }
    
    setFilteredCakes(result);
  }, [searchTerm, selectedCategory, cakes]);

  return (
    <div className="pt-24 pb-16">
      <div className="container-custom">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-serif mb-4">Our Cake Collection</h1>
          <p className="text-accent-600 max-w-2xl mx-auto">
            Browse our selection of handcrafted cakes for every occasion.
            From classic flavors to unique creations, we have the perfect cake for you.
          </p>
        </div>

        {/* Search and Filter Bar */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-grow">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search cakes..."
                className="input pl-10"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-accent-400" size={18} />
            </div>
            
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className="md:hidden btn btn-outline flex items-center justify-center gap-2"
            >
              <Filter size={18} />
              Filters
            </button>
          </div>

          {/* Category Filter - Desktop (Always visible) */}
          <div className="hidden md:flex mt-6 gap-2 flex-wrap">
            {categories.map(category => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === category.id
                    ? 'bg-secondary-800 text-white'
                    : 'bg-white text-accent-600 hover:bg-primary-100'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>

          {/* Category Filter - Mobile (Toggle) */}
          {showFilters && (
            <div className="md:hidden mt-4 flex flex-wrap gap-2">
              {categories.map(category => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    selectedCategory === category.id
                      ? 'bg-secondary-800 text-white'
                      : 'bg-white text-accent-600 hover:bg-primary-100'
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Error State */}
        {error && (
          <div className="text-center py-12">
            <p className="text-red-600 mb-4">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="btn btn-primary"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
          </div>
        ) : filteredCakes.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="text-xl font-medium mb-2">No cakes found</h3>
            <p className="text-accent-600">
              {searchTerm || selectedCategory !== 'all' 
                ? 'Try adjusting your search or filter criteria.'
                : 'Check back soon for our delicious cake selection!'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCakes.map(cake => (
              <CakeCard key={cake._id} cake={cake} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CakesPage;