import React from 'react';
import { useAuth } from '../context/AuthContext';

const ProfilePage = () => {
  const { user, logout } = useAuth();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">My Profile</h1>
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Account Information</h2>
        
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <p className="text-gray-600 mb-1">Name</p>
            <p className="font-medium">{user?.name || 'N/A'}</p>
          </div>
          
          <div>
            <p className="text-gray-600 mb-1">Email</p>
            <p className="font-medium">{user?.email || 'N/A'}</p>
          </div>
        </div>
        
        <button 
          onClick={logout}
          className="mt-6 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors"
        >
          Logout
        </button>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Order History</h2>
        <p className="text-gray-500">Your order history will appear here.</p>
        
        <div className="mt-4">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="text-left p-2 border">Order ID</th>
                <th className="text-left p-2 border">Date</th>
                <th className="text-left p-2 border">Total</th>
                <th className="text-left p-2 border">Status</th>
                <th className="text-left p-2 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {/* Order history will be mapped here */}
            </tbody>
          </table>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6 mt-8">
        <h2 className="text-xl font-semibold mb-4">Personal Information</h2>
        
        <form className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-700 mb-1">Full Name</label>
            <input 
              type="text" 
              className="w-full p-2 border rounded"
              defaultValue={user?.name || ''}
            />
          </div>
          
          <div>
            <label className="block text-gray-700 mb-1">Email</label>
            <input 
              type="email" 
              className="w-full p-2 border rounded"
              defaultValue={user?.email || ''}
              disabled
            />
          </div>
          
          <div>
            <label className="block text-gray-700 mb-1">Phone</label>
            <input 
              type="tel" 
              className="w-full p-2 border rounded"
              defaultValue={user?.phone || ''}
            />
          </div>
          
          <div className="md:col-span-2 mt-4">
            <button 
              type="submit"
              className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition-colors"
            >
              Update Profile
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfilePage;