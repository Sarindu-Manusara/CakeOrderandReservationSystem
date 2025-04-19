import React from 'react';

const AdminOrders = () => {
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">Order Management</h1>
      
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="p-4 border-b">
          <div className="flex items-center flex-wrap gap-2">
            <input
              type="text"
              placeholder="Search orders..."
              className="border rounded px-3 py-2 w-64"
            />
            <select className="border rounded px-3 py-2">
              <option>All Statuses</option>
              <option>Pending</option>
              <option>Processing</option>
              <option>Shipped</option>
              <option>Delivered</option>
              <option>Canceled</option>
            </select>
            <div className="flex items-center">
              <span className="mr-2">Date Range:</span>
              <input type="date" className="border rounded px-3 py-2" />
              <span className="mx-2">to</span>
              <input type="date" className="border rounded px-3 py-2" />
            </div>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-4 py-3">Order ID</th>
                <th className="px-4 py-3">Customer</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Total</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b hover:bg-gray-50">
                <td className="px-4 py-3">#1234</td>
                <td className="px-4 py-3">John Doe</td>
                <td className="px-4 py-3">May 15, 2025</td>
                <td className="px-4 py-3">$85.00</td>
                <td className="px-4 py-3">
                  <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs">Processing</span>
                </td>
                <td className="px-4 py-3">
                  <button className="text-indigo-600 hover:text-indigo-900 mr-2">View</button>
                  <button className="text-gray-600 hover:text-gray-900">Update</button>
                </td>
              </tr>
              <tr className="border-b hover:bg-gray-50">
                <td className="px-4 py-3">#1233</td>
                <td className="px-4 py-3">Jane Smith</td>
                <td className="px-4 py-3">May 14, 2025</td>
                <td className="px-4 py-3">$120.00</td>
                <td className="px-4 py-3">
                  <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">Delivered</span>
                </td>
                <td className="px-4 py-3">
                  <button className="text-indigo-600 hover:text-indigo-900 mr-2">View</button>
                  <button className="text-gray-600 hover:text-gray-900">Update</button>
                </td>
              </tr>
              <tr className="border-b hover:bg-gray-50">
                <td className="px-4 py-3">#1232</td>
                <td className="px-4 py-3">Robert Johnson</td>
                <td className="px-4 py-3">May 13, 2025</td>
                <td className="px-4 py-3">$65.50</td>
                <td className="px-4 py-3">
                  <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs">Canceled</span>
                </td>
                <td className="px-4 py-3">
                  <button className="text-indigo-600 hover:text-indigo-900 mr-2">View</button>
                  <button className="text-gray-600 hover:text-gray-900">Update</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <div className="px-4 py-3 border-t">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Showing 1-3 of 24 orders</span>
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

export default AdminOrders;