import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';

export default function ManageProducts() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Form State
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '', description: '', price: '', stock_quantity: '', category: '', 
    material: '', is_published: true
  });
  const [imageFile, setImageFile] = useState(null);
  const [modelFile, setModelFile] = useState(null);

  const fetchProducts = () => {
    setLoading(true);
    api.get('/admin/products')
      .then(res => setProducts(res.data.data.data || res.data.data || []))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/');
      return;
    }
    fetchProducts();
  }, [user, navigate]);

  const handleInput = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    for (const key in formData) data.append(key, formData[key]);
    if (imageFile) data.append('images[]', imageFile);
    if (modelFile) data.append('model_file', modelFile);

    try {
      await api.post('/admin/products', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setShowForm(false);
      fetchProducts();
      setFormData({name: '', description: '', price: '', stock_quantity: '', category: '', material: '', is_published: true});
      setImageFile(null);
      setModelFile(null);
    } catch (err) {
      alert('Error creating product');
    }
  };

  const deleteProduct = async (id) => {
    if(confirm('Are you sure you want to delete this product?')) {
      try {
        await api.delete(`/admin/products/${id}`);
        fetchProducts();
      } catch (err) {
        alert('Error deleting product');
      }
    }
  }

  const toggleFeatured = async (id) => {
    try {
      const res = await api.patch(`/admin/products/${id}/toggle-featured`);
      fetchProducts();
    } catch (err) {
      console.error('Toggle featured error:', err.response?.data || err.message);
      alert('Error toggling featured status: ' + (err.response?.data?.message || err.message));
    }
  };

  if (loading && products.length === 0) return <div className="p-10 text-center animate-pulse">Loading Products...</div>;

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Manage Products</h1>
        <button onClick={() => setShowForm(!showForm)} className="bg-black text-white px-5 py-2 rounded-lg font-medium hover:bg-gray-800 transition shadow">
          {showForm ? 'Cancel' : '+ Add New Product'}
        </button>
      </div>

      {showForm && (
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 mb-10">
          <h2 className="text-xl font-bold mb-6 text-gray-800">Add New Product</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input required name="name" value={formData.name} onChange={handleInput} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-black outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <input required name="category" value={formData.category} onChange={handleInput} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-black outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Price (₹)</label>
                <input type="number" required name="price" value={formData.price} onChange={handleInput} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-black outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Stock Quantity</label>
                <input type="number" required name="stock_quantity" value={formData.stock_quantity} onChange={handleInput} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-black outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Material</label>
                <input required name="material" value={formData.material} onChange={handleInput} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-black outline-none" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea required name="description" value={formData.description} onChange={handleInput} rows="3" className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-black outline-none"></textarea>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-4 border rounded-xl bg-gray-50 border-dashed border-gray-300">
                <label className="block text-sm font-bold text-gray-700 mb-2">Product Image</label>
                <input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files[0])} className="text-sm" />
              </div>
              <div className="p-4 border rounded-xl bg-orange-50 border-dashed border-orange-200">
                <label className="block text-sm font-bold text-amber-950 mb-2">3D Model (.glb)</label>
                <input type="file" accept=".glb" onChange={(e) => setModelFile(e.target.files[0])} className="text-sm text-amber-900" />
              </div>
            </div>
            <button type="submit" className="w-full bg-amber-700 text-white font-bold py-3 rounded-xl hover:bg-amber-800 transition">Save Product</button>
          </form>
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100 text-sm tracking-wide text-gray-500 uppercase">
              <th className="p-5 font-bold">Image</th>
              <th className="p-5 font-bold">Name</th>
              <th className="p-5 font-bold">Category</th>
              <th className="p-5 font-bold">Price</th>
              <th className="p-5 font-bold">Stock</th>
              <th className="p-5 font-bold text-center">Home Page</th>
              <th className="p-5 font-bold text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map(prod => (
              <tr key={prod._id} className="border-b border-gray-50 hover:bg-gray-50/50 transition">
                <td className="p-5">
                  <div className="w-12 h-12 rounded bg-gray-100 overflow-hidden">
                    {prod.images && prod.images[0] && <img src={prod.images[0]} className="w-full h-full object-cover" />}
                  </div>
                </td>
                <td className="p-5 font-bold text-gray-900">
                  {prod.name}
                  {prod.model_url && <span className="ml-2 bg-orange-100 text-amber-800 text-xs px-2 py-0.5 rounded-full font-bold">3D</span>}
                </td>
                <td className="p-5 text-gray-600">{prod.category}</td>
                <td className="p-5 font-bold text-gray-900">₹{prod.price}</td>
                <td className="p-5">
                  <span className={`px-2 py-1 rounded text-xs font-bold ${prod.stock_quantity < 10 ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                    {prod.stock_quantity}
                  </span>
                </td>
                <td className="p-5 text-center">
                  <button
                    onClick={() => toggleFeatured(prod.id || prod._id)}
                    className={`px-3 py-1.5 rounded-full text-xs font-bold transition ${
                      prod.is_featured
                        ? 'bg-amber-100 text-amber-800 hover:bg-amber-200'
                        : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                    }`}
                  >
                    {prod.is_featured ? '★ Featured' : '☆ Feature'}
                  </button>
                </td>
                <td className="p-5 text-right space-x-3">
                  <button onClick={() => deleteProduct(prod._id)} className="text-red-500 font-medium hover:text-red-700">Delete</button>
                </td>
              </tr>
            ))}
            {products.length === 0 && (
              <tr>
                <td colSpan="7" className="p-10 text-center text-gray-500">No products found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
