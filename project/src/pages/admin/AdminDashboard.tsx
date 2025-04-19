import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Users, CreditCard, Cake, Package } from 'lucide-react';

const AdminDashboard: React.FC = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-8">Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Order Management */}
        <Link 
          to="/admin/orders" 
          className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
        >
          <div className="flex items-center mb-4">
            <div className="bg-primary-100 p-3 rounded-lg">
              <ShoppingBag className="text-primary-600" size={24} />
            </div>
            <div className="ml-4">
              <h3 className="font-semibold text-lg">Order Management</h3>
              <p className="text-sm text-gray-600">Manage orders and reservations</p>
            </div>
          </div>
        </Link>

        {/* Stock Management */}
        <Link 
          to="/admin/products" 
          className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
        >
          <div className="flex items-center mb-4">
            <div className="bg-secondary-100 p-3 rounded-lg">
              <Package className="text-secondary-600" size={24} />
            </div>
            <div className="ml-4">
              <h3 className="font-semibold text-lg">Stock Management</h3>
              <p className="text-sm text-gray-600">Manage pre-defined cakes</p>
            </div>
          </div>
        </Link>

        {/* Payment Management */}
        <Link 
          to="/admin/payments" 
          className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
        >
          <div className="flex items-center mb-4">
            <div className="bg-green-100 p-3 rounded-lg">
              <CreditCard className="text-green-600" size={24} />
            </div>
            <div className="ml-4">
              <h3 className="font-semibold text-lg">Payment Management</h3>
              <p className="text-sm text-gray-600">Track payments and refunds</p>
            </div>
          </div>
        </Link>

        {/* User Management */}
        <Link 
          to="/admin/users" 
          className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
        >
          <div className="flex items-center mb-4">
            <div className="bg-purple-100 p-3 rounded-lg">
              <Users className="text-purple-600" size={24} />
            </div>
            <div className="ml-4">
              <h3 className="font-semibold text-lg">User Management</h3>
              <p className="text-sm text-gray-600">Manage user accounts</p>
            </div>
          </div>
        </Link>

        {/* Custom Cake Management */}
        <Link 
          to="/admin/custom-cakes" 
          className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
        >
          <div className="flex items-center mb-4">
            <div className="bg-pink-100 p-3 rounded-lg">
              <Cake className="text-pink-600" size={24} />
            </div>
            <div className="ml-4">
              <h3 className="font-semibold text-lg">Custom Cake Management</h3>
              <p className="text-sm text-gray-600">Manage custom cake orders</p>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default AdminDashboard;