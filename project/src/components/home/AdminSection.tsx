import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Users, CreditCard, Cake } from 'lucide-react';

const AdminSection: React.FC = () => {
  return (
    <section className="py-12 bg-accent-50">
      <div className="container-custom">
        <h2 className="text-2xl font-serif mb-8 text-center">Admin Dashboard</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Link 
            to="/admin/orders" 
            className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center mb-4">
              <ShoppingBag className="text-primary-500" size={24} />
              <h3 className="ml-3 font-semibold">Order Manager</h3>
            </div>
            <p className="text-sm text-accent-600">
              Manage orders and reservations
            </p>
          </Link>

          <Link 
            to="/admin/users" 
            className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center mb-4">
              <Users className="text-primary-500" size={24} />
              <h3 className="ml-3 font-semibold">User Manager</h3>
            </div>
            <p className="text-sm text-accent-600">
              Manage user accounts and permissions
            </p>
          </Link>

          <Link 
            to="/admin/payments" 
            className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center mb-4">
              <CreditCard className="text-primary-500" size={24} />
              <h3 className="ml-3 font-semibold">Payment Manager</h3>
            </div>
            <p className="text-sm text-accent-600">
              Track payments and handle refunds
            </p>
          </Link>

          <Link 
            to="/admin/products" 
            className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center mb-4">
              <Cake className="text-primary-500" size={24} />
              <h3 className="ml-3 font-semibold">Cake Manager</h3>
            </div>
            <p className="text-sm text-accent-600">
              Manage pre-defined and custom cakes
            </p>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default AdminSection;