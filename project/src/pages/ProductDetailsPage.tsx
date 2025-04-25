import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ShoppingCart, ArrowLeft, CloudSun } from 'lucide-react';
import axios from 'axios';
import CartContext from '../context/CartContext';
import { Product } from '../types';
import { formatCurrency } from '../../server/utils/FormatCurrency';

const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);
  const { addToCart } = useContext(CartContext);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get(`/api/products/${id}`);
        setProduct(data);
        setSelectedSize(data.sizes?.[0] || '');
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to fetch product details');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id]);

  const handleAddToCart = () => {
    if (!product) return;

    if (!product.isAvailable || product.stock <= 0) {
      alert('This product is currently out of stock');
      return;
    }

    if (quantity > product.stock) {
      alert(`Only ${product.stock} units available`);
      return;
    }

    addToCart({
      _id: product._id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity
    });
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12 flex justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto"></div>
          <p className="mt-4 text-lg">Loading product details...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Product Not Found</h2>
          <p className="mb-6">Sorry, the product you're looking for doesn't exist.</p>
          <Link to="/products" className="text-primary-500 hover:underline flex items-center justify-center">
            <ArrowLeft className="mr-2" size={16} />
            Back to all products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <Link to="/products" className="text-primary-500 hover:underline flex items-center mb-6">
        <ArrowLeft className="mr-2" size={16} />
        Back to all products
      </Link>
      
      <div className="grid md:grid-cols-2 gap-12">
        {/* Image */}
        <div className="rounded-lg overflow-hidden shadow-lg">
          <img 
            src={product.image} 
            alt={product.name} 
            className="w-full h-auto object-cover"
          />
        </div>
        
        {/* Details */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-3xl font-bold">{product.name}</h1>
            {product.weatherSensitive && (
              <div className="flex items-center text-primary-500" title="Weather sensitive item">
                <CloudSun size={24} />
              </div>
            )}
          </div>
          <p className="text-2xl font-semibold text-primary-500 mb-4">{formatCurrency(product.price)}</p>
          <p className="text-accent-700 mb-6">{product.description}</p>
          
          {/* Size Selection */}
          {product.sizes?.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2">Size</h3>
              <div className="flex space-x-2">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    className={`px-4 py-2 rounded-full border ${
                      selectedSize === size 
                        ? 'bg-primary-500 text-white border-primary-500' 
                        : 'border-accent-300 hover:border-primary-300'
                    }`}
                    onClick={() => setSelectedSize(size)}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}
          
          {/* Quantity */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">Quantity</h3>
            <div className="flex items-center">
              <button 
                className="px-3 py-1 border border-accent-300 rounded-l-md hover:bg-accent-50"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                aria-label="Decrease quantity"
              >
                -
              </button>
              <input 
                type="number" 
                min="1"
                max={product.stock}
                value={quantity} 
                onChange={(e) => setQuantity(Math.max(1, Math.min(parseInt(e.target.value) || 1, product.stock)))}
                className="w-16 text-center py-1 border-t border-b border-accent-300"
              />
              <button 
                className="px-3 py-1 border border-accent-300 rounded-r-md hover:bg-accent-50"
                onClick={() => setQuantity(Math.min(quantity + 1, product.stock))}
                aria-label="Increase quantity"
              >
                +
              </button>
            </div>
            <p className="text-sm text-accent-500 mt-1">
              {product.stock} units available
            </p>
          </div>
          
          {/* Add to Cart */}
          <button 
            className={`w-full py-3 px-6 rounded-md mb-6 flex items-center justify-center ${
              product.isAvailable && product.stock > 0
                ? 'bg-primary-500 hover:bg-primary-600 text-white'
                : 'bg-accent-200 text-accent-500 cursor-not-allowed'
            }`}
            onClick={handleAddToCart}
            disabled={!product.isAvailable || product.stock <= 0}
          >
            <ShoppingCart className="mr-2" size={18} />
            {product.isAvailable && product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
          </button>
          
          {/* Flavors (or Tags) */}
          {product.flavors?.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2">Available Flavors</h3>
              <div className="flex flex-wrap gap-2">
                {product.flavors.map((flavor, index) => (
                  <span 
                    key={index}
                    className="px-3 py-1 bg-primary-50 text-primary-700 rounded-full text-sm"
                  >
                    {flavor}
                  </span>
                ))}
              </div>
            </div>
          )}
          
          {/* Reviews */}
          {product.reviews?.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2">Customer Reviews</h3>
              <div className="space-y-4">
                {product.reviews.map((review, index) => (
                  <div key={index} className="border-b border-accent-200 pb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">{review.user.name}</span>
                      <span className="text-primary-500">{review.rating}/5</span>
                    </div>
                    <p className="text-accent-600">{review.comment}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
