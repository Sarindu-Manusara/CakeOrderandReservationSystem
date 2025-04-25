import React from 'react';
import { Link } from 'react-router-dom';
import { useContext } from 'react';
import { ShoppingCart, CloudSun } from 'lucide-react';
import CartContext from '../../context/CartContext';
import { Product } from '../../types';
import { formatCurrency } from '../../../server/utils/FormatCurrency';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useContext(CartContext);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
  
    if (!product.isAvailable || product.stock <= 0) {
      alert('This product is currently out of stock');
      return;
    }
  
    addToCart({
      _id: '', // temporary, server will generate real one
      product: {
        _id: product._id,
        name: product.name,
        price: product.price,
        image: product.image
      },
      quantity: 1,
      isCustom: false
    });
  };
  

  return (
    <div className="card group h-full flex flex-col">
      <div className="relative overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-64 object-cover transform group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-black bg-opacity-20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          {product.isAvailable && product.stock > 0 && (
            <button
              onClick={handleAddToCart}
              className="bg-white text-secondary-800 p-3 rounded-full transform translate-y-4 group-hover:translate-y-0 transition-transform"
              aria-label="Add to cart"
            >
              <ShoppingCart size={20} />
            </button>
          )}
        </div>
      </div>

      <Link to={`/${product.productType || 'products'}/${product._id}`} className="flex-1 p-6 flex flex-col">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-xl font-serif group-hover:text-secondary-700 transition-colors">
            {product.name}
          </h3>
          {product.weatherSensitive && (
            <span title="Weather sensitive item">
              <CloudSun size={16} className="text-primary-500" />
            </span>
          )}
        </div>

        <div className="text-sm text-accent-600 mb-4 flex-grow">
          {product.description.length > 100
            ? product.description.substring(0, 100) + '...'
            : product.description}
        </div>

        <div className="flex justify-between items-center">
          <span className="text-lg font-semibold text-secondary-800">
            {formatCurrency(product.price)}
          </span>

          {product.isAvailable && product.stock > 0 ? (
            <span className="text-xs font-medium px-2 py-1 bg-green-100 text-green-800 rounded">
              In Stock ({product.stock})
            </span>
          ) : (
            <span className="text-xs font-medium px-2 py-1 bg-red-100 text-red-800 rounded">
              Out of Stock
            </span>
          )}
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;
