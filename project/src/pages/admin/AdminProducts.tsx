import React from 'react';

const AdminProducts = () => {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Product Management</h1>
        <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded">
          Add New Product
        </button>
      </div>
      
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="p-4 border-b">
          <div className="flex items-center">
            <input
              type="text"
              placeholder="Search products..."
              className="border rounded px-3 py-2 w-64"
            />
            <select className="border rounded px-3 py-2 ml-4">
              <option>All Categories</option>
              <option>Birthday Cakes</option>
              <option>Wedding Cakes</option>
              <option>Custom Cakes</option>
            </select>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-4 py-3">Image</th>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Price</th>
                <th className="px-4 py-3">Stock</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b hover:bg-gray-50">
                <td className="px-4 py-3">
                  <div className="w-12 h-12 bg-gray-200 rounded"></div>
                </td>
                <td className="px-4 py-3">Chocolate Dream Cake</td>
                <td className="px-4 py-3">Birthday Cakes</td>
                <td className="px-4 py-3">$45.00</td>
                <td className="px-4 py-3">15</td>
                <td className="px-4 py-3">
                  <button className="text-indigo-600 hover:text-indigo-900 mr-2">Edit</button>
                  <button className="text-red-600 hover:text-red-900">Delete</button>
                </td>
              </tr>
              <tr className="border-b hover:bg-gray-50">
                <td className="px-4 py-3">
                  <div className="w-12 h-12 bg-gray-200 rounded"></div>
                </td>
                <td className="px-4 py-3">Vanilla Bliss</td>
                <td className="px-4 py-3">Wedding Cakes</td>
                <td className="px-4 py-3">$120.00</td>
                <td className="px-4 py-3">8</td>
                <td className="px-4 py-3">
                  <button className="text-indigo-600 hover:text-indigo-900 mr-2">Edit</button>
                  <button className="text-red-600 hover:text-red-900">Delete</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <div className="px-4 py-3 border-t">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Showing 1-2 of 18 products</span>
            <div className="flex">
              <button className="px-3 py-1 border rounded mr-1 bg-gray-100">Previous</button>
              <button className="px-3 py-1 border rounded bg-indigo-600 text-white">Next</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProducts;