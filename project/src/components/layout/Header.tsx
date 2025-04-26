import React, { useState, useContext, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingBag, User, Menu, X } from 'lucide-react';
import { AuthContext, useAuth } from '../../context/AuthContext';
import CartContext from '../../context/CartContext';
import logo from '../../../resources/images/logo.png';

const Header: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isAuthenticated, user, logout } = useAuth();
  const { totalItems } = useContext(CartContext);
  const location = useLocation();

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);

  return (
    <header className="fixed w-full bg-white py-2 shadow-md z-50 transition-all duration-300">
      <div className="container-custom flex justify-between items-center">
        <Link to="/" className="flex items-center">
          <img src={logo} alt="Logo" className="w-12 h-auto" />
          <span className="font-serif text-xl md:text-2xl font-bold text-secondary-800 ml-2 text-blue-700">
            Perera & Sons
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <Link to="/" className="font-medium text-accent-800 hover:text-blue-700 text-blue-500">
            Home
          </Link>
          <Link to="/products" className="font-medium text-accent-800 hover:text-blue-700 text-blue-500">
            Products
          </Link>
          <Link to="/custom-cake" className="font-medium text-accent-800 hover:text-blue-700 text-blue-500">
            Custom Cake Order
          </Link>
          {isAuthenticated && user?.isAdmin && (
            <Link to="/admin" className="font-medium text-accent-800 hover:text-blue-700 text-blue-500">
              Admin
            </Link>
          )}
        </nav>

        {/* Desktop Auth/Cart */}
        <div className="hidden md:flex items-center space-x-6">
          <Link to="/cart" className="relative">
            <ShoppingBag className="text-accent-800 text-blue-500" size={24} />
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-secondary-800 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                {totalItems}
              </span>
            )}
          </Link>
          
          {isAuthenticated ? (
            <div className="relative group">
              <button className="flex items-center">
                <User className="text-blue-800 mr-1" size={24} />
                <span className="font-medium text-blue-800">
                  Hi {user?.name.split(' ')[0]}
                </span>
              </button>
              <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-md shadow-lg py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
                <Link to="/profile" className="block px-4 py-2 text-sm text-accent-700 hover:bg-primary-50 text-blue-500">
                  My Profile
                </Link>
                <button 
                  onClick={logout}
                  className="block w-full text-left px-4 py-2 text-sm text-accent-700 hover:bg-primary-50 text-blue-500"
                >
                  Logout
                </button>
              </div>
            </div>
          ) : (
            <Link to="/login" className="font-medium text-accent-800 hover:text-blue-700 text-blue-500">
              Login
            </Link>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="flex items-center space-x-4 md:hidden">
          <Link to="/cart" className="relative">
            <ShoppingBag className="text-accent-800" size={24} />
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-secondary-800 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                {totalItems}
              </span>
            )}
          </Link>
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="text-accent-800"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`md:hidden absolute top-full left-0 right-0 bg-white shadow-md transition-all duration-300 ${
        mobileMenuOpen ? 'max-h-screen opacity-100 visible' : 'max-h-0 opacity-0 invisible'
      } overflow-hidden`}>
        <div className="container-custom py-4 flex flex-col space-y-4">
          <Link to="/" className="py-2 font-medium text-accent-800 text-blue-500">
            Home
          </Link>
          <Link to="/products" className="py-2 font-medium text-accent-800 text-blue-500">
            Products
          </Link>
          <Link to="/custom-cake" className="py-2 font-medium text-accent-800 text-blue-500">
            Custom Cake Order
          </Link>
          {isAuthenticated ? (
            <>
              <Link to="/profile" className="py-2 font-medium text-accent-800 text-blue-500">
                My Profile
              </Link>
              {user?.isAdmin && (
                <Link to="/admin" className="py-2 font-medium text-accent-800 text-blue-500">
                  Admin Dashboard
                </Link>
              )}
              <button 
                onClick={logout}
                className="py-2 font-medium text-accent-800 text-left text-blue-500"
              >
                Logout
              </button>
            </>
          ) : (
            <Link to="/login" className="py-2 font-medium text-accent-800 text-blue-500">
              Login
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
