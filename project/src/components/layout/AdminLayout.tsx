import React, { useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Shield, Package, ShoppingBag, CreditCard, Users, Cake, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  useEffect(() => {
    // Verify admin status on mount
    if (!user?.isAdmin) {
      navigate('/admin-login');
    }
  }, [navigate, user]);

  const handleLogout = () => {
    logout();
    navigate('/admin-login');
  };

  const menuItems = [
    { path: '/admin', icon: Shield, label: 'Dashboard' },
    { path: '/admin/orders', icon: ShoppingBag, label: 'Orders' },
    { path: '/admin/products', icon: Package, label: 'Products' },
    { path: '/admin/payments', icon: CreditCard, label: 'Payments' },
    { path: '/admin/users', icon: Users, label: 'Users' },
    { path: '/admin/custom-cakes', icon: Cake, label: 'Custom Cakes' },
  ];

  if (!user?.isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-md">
        <div className="p-4">
          <div className="flex items-center space-x-2">
            <Shield className="text-primary-600" size={24} />
            <span className="text-lg font-semibold">Admin Panel</span>
          </div>
        </div>
        <nav className="mt-4">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center px-4 py-3 text-gray-600 hover:bg-primary-50 hover:text-primary-600 ${
                location.pathname === item.path ? 'bg-primary-50 text-primary-600' : ''
              }`}
            >
              <item.icon size={20} className="mr-3" />
              {item.label}
            </Link>
          ))}
          <button
            onClick={handleLogout}
            className="w-full flex items-center px-4 py-3 text-gray-600 hover:bg-red-50 hover:text-red-600"
          >
            <LogOut size={20} className="mr-3" />
            Logout
          </button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1">
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;