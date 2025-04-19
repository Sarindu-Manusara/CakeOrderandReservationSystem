import React from 'react';
import { Link } from 'react-router-dom';
import { Shield } from 'lucide-react';

const AdminSection: React.FC = () => {
  return (
    <section className="py-12 bg-accent-50">
      <div className="container-custom">
        <div className="max-w-md mx-auto text-center">
          <div className="mx-auto h-12 w-12 bg-primary-100 rounded-full flex items-center justify-center mb-4">
            <Shield className="h-6 w-6 text-primary-600" />
          </div>
          <h2 className="text-2xl font-serif mb-4">Admin Access</h2>
          <p className="text-accent-600 mb-6">
            Access the admin dashboard to manage orders, users, and more.
          </p>
          <Link 
            to="/admin"
            className="inline-block bg-primary-600 text-white px-6 py-3 rounded-md hover:bg-primary-700 transition-colors"
          >
            Go to Admin Dashboard
          </Link>
        </div>
      </div>
    </section>
  );
};

export default AdminSection;