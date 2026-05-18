import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';

export default function ManageOrders() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;

    if (!user || user.role !== 'admin') {
      navigate('/');
      return;
    }
    
    api.get('/admin/orders')
      .then(res => {
        const ordersData = res.data?.data || [];
        setOrders(Array.isArray(ordersData) ? ordersData : []);
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [user, authLoading, navigate]);

  const updateStatus = async (id, status) => {
    try {
      await api.put(`/admin/orders/${id}/status`, { status });
      setOrders(prevOrders => prevOrders.map(o => {
        const oId = o.id || o._id;
        return oId === id ? { ...o, status } : o;
      }));
    } catch (err) {
      alert('Error updating status');
    }
  };

  if (authLoading || loading) return <div className="p-10 text-center animate-pulse">Loading Orders...</div>;

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Manage Orders</h1>
      
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100 text-sm tracking-wide text-gray-500 uppercase">
              <th className="p-5 font-bold">Order ID</th>
              <th className="p-5 font-bold">Date</th>
              <th className="p-5 font-bold">Customer</th>
              <th className="p-5 font-bold">Total</th>
              <th className="p-5 font-bold">Status</th>
              <th className="p-5 font-bold text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => {
              const orderId = order.id || order._id || '';
              return (
                <tr key={orderId} className="border-b border-gray-50 hover:bg-gray-50/50 transition">
                  <td className="p-5 font-mono text-sm text-gray-600">
                    {orderId ? orderId.substring(orderId.length - 8) : 'N/A'}
                  </td>
                  <td className="p-5 text-gray-900 font-medium">{new Date(order.created_at).toLocaleDateString()}</td>
                  <td className="p-5 text-gray-600">{order.user_id}</td>
                  <td className="p-5 font-bold text-gray-900">₹{order.total}</td>
                  <td className="p-5">
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
                      order.status === 'Delivered' ? 'bg-green-100 text-green-700' :
                      order.status === 'Cancelled' ? 'bg-red-100 text-red-700' :
                      'bg-orange-100 text-amber-800'
                    }`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="p-5 text-right">
                    <select 
                      value={order.status}
                      onChange={(e) => updateStatus(orderId, e.target.value)}
                      className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm font-medium focus:ring-2 focus:ring-amber-700 outline-none"
                    >
                    <option value="Pending">Pending</option>
                    <option value="Processing">Processing</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </td>
              </tr>
              );
            })}
            {orders.length === 0 && (
              <tr>
                <td colSpan="6" className="p-10 text-center text-gray-500">No orders found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
