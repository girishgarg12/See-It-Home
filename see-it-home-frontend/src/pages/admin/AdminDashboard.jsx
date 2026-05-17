import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';

export default function AdminDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/');
      return;
    }
    
    api.get('/admin/dashboard')
      .then(res => setStats(res.data.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [user, navigate]);

  if (loading) return <div className="p-10 text-center animate-pulse">Loading Dashboard...</div>;

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <div className="flex gap-4">
          <Link to="/admin/products" className="bg-black text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition">
            Manage Products
          </Link>
          <Link to="/admin/orders" className="bg-white text-black border border-black px-5 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition">
            Manage Orders
          </Link>
          <Link to="/admin/users" className="bg-white text-black border border-black px-5 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition">
            Manage Users
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-center items-center">
          <p className="text-gray-500 font-medium mb-2 uppercase text-sm tracking-wider">Total Revenue</p>
          <p className="text-4xl font-extrabold text-amber-700">₹{stats?.total_revenue || 0}</p>
        </div>
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-center items-center">
          <p className="text-gray-500 font-medium mb-2 uppercase text-sm tracking-wider">Total Orders</p>
          <p className="text-4xl font-extrabold text-gray-900">{stats?.total_orders || 0}</p>
        </div>
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-center items-center">
          <p className="text-gray-500 font-medium mb-2 uppercase text-sm tracking-wider">Total Customers</p>
          <p className="text-4xl font-extrabold text-gray-900">{stats?.total_users || 0}</p>
        </div>
      </div>

      <div>
        <h2 className="text-xl font-bold mb-6 text-gray-800">Low Stock Alerts</h2>
        {stats?.low_stock_products?.length === 0 ? (
          <div className="bg-green-50 text-green-700 p-6 rounded-xl border border-green-100 font-medium">
            All products have sufficient stock.
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="p-4 font-bold text-gray-600">Product Name</th>
                  <th className="p-4 font-bold text-gray-600">Stock Remaining</th>
                </tr>
              </thead>
              <tbody>
                {stats?.low_stock_products?.map((prod, idx) => (
                  <tr key={idx} className="border-b border-gray-50 hover:bg-red-50/30 transition">
                    <td className="p-4 font-medium text-gray-900">{prod.name}</td>
                    <td className="p-4 text-red-600 font-bold">{prod.stock_quantity} left</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
