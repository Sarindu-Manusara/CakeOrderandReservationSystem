import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ShoppingCart, ArrowLeft } from 'lucide-react';

// This would be replaced with actual API calls in a production app
const mockCake = {
  id: '1',
  name: 'Chocolate Truffle Cake',
  description: 'A rich chocolate cake with smooth truffle frosting, perfect for any celebration.',
  price: 49.99,
  image: 'https://images.pexels.com/photos/264892/pexels-photo-264892.jpeg',
  flavors: ['Chocolate', 'Truffle'],
  sizes: ['6"', '8"', '10"'],
  ingredients: [
    'Premium Cocoa Powder',
    'Belgian Chocolate',
    'Fresh Cream',
    'Organic Sugar',
    'Free-range Eggs',
    'Vanilla Extract'
  ],
  allergens: ['Milk', 'Eggs', 'Wheat']
};

const CakeDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [cake, setCake] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedSize, setSelectedSize] = useState<string>('8"');
  const [quantity, setQuantity] = useState<number>(1);

  useEffect(() => {
    // In a real application, you would fetch the cake details from an API
    // For now, we'll simulate a data fetch with setTimeout
    const fetchCake = async () => {
      setLoading(true);
      try {
        // Simulate API call
        setTimeout(() => {
          setCake(mockCake);
          setLoading(false);
        }, 500);
      } catch (error) {
        console.error('Error fetching cake details:', error);
        setLoading(false);
      }
    };

    fetchCake();
  }, [id]);

  const handleAddToCart = () => {
    // In a real app, this would dispatch to a cart context or redux store
    alert(`Added ${quantity} of ${cake.name} (${selectedSize}) to cart`);
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12 flex justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto"></div>
          <p className="mt-4 text-lg">Loading cake details...</p>
        </div>
      </div>
    );
  }

  if (!cake) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Cake Not Found</h2>
          <p className="mb-6">Sorry, the cake you're looking for doesn't exist.</p>
          <Link to="/cakes" className="text-pink-500 hover:underline flex items-center justify-center">
            <ArrowLeft className="mr-2" size={16} />
            Back to all cakes
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <Link to="/cakes" className="text-pink-500 hover:underline flex items-center mb-6">
        <ArrowLeft className="mr-2" size={16} />
        Back to all cakes
      </Link>
      
      <div className="grid md:grid-cols-2 gap-12">
        {/* Cake Image */}
        <div className="rounded-lg overflow-hidden shadow-lg">
          <img 
            src={cake.image} 
            alt={cake.name} 
            className="w-full h-auto object-cover"
          />
        </div>
        
        {/* Cake Details */}
        <div>
          <h1 className="text-3xl font-bold mb-2">{cake.name}</h1>
          <p className="text-2xl font-semibold text-pink-500 mb-4">${cake.price.toFixed(2)}</p>
          <p className="text-gray-700 mb-6">{cake.description}</p>
          
          {/* Size Selection */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">Size</h3>
            <div className="flex space-x-2">
              {cake.sizes.map((size: string) => (
                <button
                  key={size}
                  className={`px-4 py-2 rounded-full border ${
                    selectedSize === size 
                      ? 'bg-pink-500 text-white border-pink-500' 
                      : 'border-gray-300 hover:border-pink-300'
                  }`}
                  onClick={() => setSelectedSize(size)}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
          
          {/* Quantity */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">Quantity</h3>
            <div className="flex items-center">
              <button 
                className="px-3 py-1 border border-gray-300 rounded-l-md hover:bg-gray-100"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                aria-label="Decrease quantity"
              >
                -
              </button>
              <input 
                type="number" 
                min="1" 
                value={quantity} 
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-16 text-center py-1 border-t border-b border-gray-300"
              />
              <button 
                className="px-3 py-1 border border-gray-300 rounded-r-md hover:bg-gray-100"
                onClick={() => setQuantity(quantity + 1)}
                aria-label="Increase quantity"
              >
                +
              </button>
            </div>
          </div>
          
          {/* Add to Cart Button */}
          <button 
            className="w-full bg-pink-500 hover:bg-pink-600 text-white font-semibold py-3 px-6 rounded-md mb-6 flex items-center justify-center"
            onClick={handleAddToCart}
          >
            <ShoppingCart className="mr-2" size={18} />
            Add to Cart
          </button>
          
          {/* Ingredients */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">Ingredients</h3>
            <ul className="list-disc list-inside text-gray-700">
              {cake.ingredients.map((ingredient: string, index: number) => (
                <li key={index}>{ingredient}</li>
              ))}
            </ul>
          </div>
          
          {/* Allergens */}
          <div>
            <h3 className="text-lg font-semibold mb-2">Allergens</h3>
            <div className="flex flex-wrap gap-2">
              {cake.allergens.map((allergen: string, index: number) => (
                <span key={index} className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm">
                  {allergen}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CakeDetailPage;