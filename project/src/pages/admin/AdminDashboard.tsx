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

      {/* Quick Stats */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h4 className="text-sm font-medium text-gray-500 mb-2">Total Orders</h4>
          <div className="text-2xl font-bold">0</div>
          <div className="text-xs text-gray-500 mt-1">Last 30 days</div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h4 className="text-sm font-medium text-gray-500 mb-2">Revenue</h4>
          <div className="text-2xl font-bold">$0.00</div>
          <div className="text-xs text-gray-500 mt-1">Last 30 days</div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h4 className="text-sm font-medium text-gray-500 mb-2">Active Users</h4>
          <div className="text-2xl font-bold">0</div>
          <div className="text-xs text-gray-500 mt-1">Total registered users</div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h4 className="text-sm font-medium text-gray-500 mb-2">Custom Orders</h4>
          <div className="text-2xl font-bold">0</div>
          <div className="text-xs text-gray-500 mt-1">Pending custom orders</div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;