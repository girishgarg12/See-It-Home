import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

const mapStorageUrl = (path) => {
  if (!path) return '';
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  
  let cleanPath = path;
  if (cleanPath.startsWith('/storage/')) {
    cleanPath = cleanPath.substring(9);
  } else if (cleanPath.startsWith('storage/')) {
    cleanPath = cleanPath.substring(8);
  } else if (cleanPath.startsWith('/')) {
    cleanPath = cleanPath.substring(1);
  }
  
  return `/storage/${cleanPath}`;
};

export default function OrderHistory() {
  const { user, loading: authLoading } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;

    if (user) {
      setLoading(true);
      api.get('/orders')
        .then(res => {
          const ordersData = res.data?.data?.data || res.data?.data || [];
          setOrders(Array.isArray(ordersData) ? ordersData : []);
        })
        .catch(err => console.error(err))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [user, authLoading]);

  if (authLoading || loading) return <div className="p-10 text-center animate-pulse">Loading Orders...</div>;

  if (!user) {
    return <div className="p-10 text-center">Please login to view orders.</div>;
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold mb-8 text-gray-900">Order History</h1>
      
      {orders.length === 0 ? (
        <div className="bg-white p-10 rounded-2xl shadow-sm border border-gray-100 text-center">
          <p className="text-gray-500 mb-4 text-lg">You haven't placed any orders yet.</p>
          <Link to="/products" className="text-amber-700 font-medium hover:underline">Start Shopping</Link>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map(order => (
            <div key={order.id || order._id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="bg-gray-50 p-6 border-b border-gray-100 flex flex-wrap justify-between items-center gap-4">
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider font-bold mb-1">Order Placed</p>
                  <p className="font-medium text-gray-900">{new Date(order.created_at).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider font-bold mb-1">Total Amount</p>
                  <p className="font-medium text-gray-900">₹{order.total}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider font-bold mb-1">Order Status</p>
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
                    order.status === 'Delivered' ? 'bg-green-100 text-green-700' :
                    order.status === 'Cancelled' ? 'bg-red-100 text-red-700' :
                    'bg-orange-100 text-amber-800'
                  }`}>
                    {order.status}
                  </span>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider font-bold mb-1">Payment Status</p>
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
                    order.payment_status === 'paid' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                  }`}>
                    {order.payment_status === 'paid' ? 'Paid' : 'Pending'}
                  </span>
                </div>
                <div className="text-right flex-grow md:flex-grow-0">
                  <p className="text-xs text-gray-500 uppercase tracking-wider font-bold mb-1">Order #</p>
                  <p className="font-mono text-sm text-gray-900">
                    {(() => {
                      const idStr = order.id || order._id || '';
                      return idStr ? idStr.substring(idStr.length - 8) : 'N/A';
                    })()}
                  </p>
                </div>
              </div>
              
              <div className="p-6">
                <h4 className="font-bold text-gray-800 mb-4 border-b pb-2">Items</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {order.items.map((item, idx) => (
                    <Link to={`/products/${item.product_id}`} key={idx} className="flex gap-4 group">
                      <div className="w-20 h-20 rounded-lg bg-gray-100 flex-shrink-0 overflow-hidden border border-gray-200">
                        {item.image && <img src={mapStorageUrl(item.image)} className="w-full h-full object-cover group-hover:scale-105 transition" />}
                      </div>
                      <div>
                        <p className="font-medium text-sm text-gray-900 group-hover:text-amber-700 transition">{item.name}</p>
                        <p className="text-xs text-gray-500 mt-1">Color: {item.color || 'Default'}</p>
                        <p className="text-sm font-medium mt-1">₹{item.price} × {item.quantity}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
