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
  const [editingProductId, setEditingProductId] = useState(null);
  const [formData, setFormData] = useState({
    name: '', description: '', price: '', stock_quantity: '', category: '', 
    material: '', dimensions: '', colors: '', is_published: true, existing_image: null, existing_model: false
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

  const handleAddNew = () => {
    setEditingProductId(null);
    setFormData({name: '', description: '', price: '', stock_quantity: '', category: '', material: '', dimensions: '', colors: '', is_published: true, existing_image: null, existing_model: false});
    setImageFile(null);
    setModelFile(null);
    setShowForm(!showForm);
  };

  const handleEdit = (prod) => {
    setEditingProductId(prod.id || prod._id);
    setFormData({
      name: prod.name || '',
      description: prod.description || '',
      price: prod.price || '',
      stock_quantity: prod.stock_quantity || '',
      category: prod.category || '',
      material: prod.material || '',
      dimensions: prod.dimensions || '',
      colors: Array.isArray(prod.colors) ? prod.colors.join(', ') : (prod.colors || ''),
      is_published: prod.is_published ?? true,
      existing_image: prod.images && prod.images.length > 0 ? prod.images[0] : null,
      existing_model: !!prod.model_url
    });
    setImageFile(null);
    setModelFile(null);
    setShowForm(true);
    window.scrollTo(0, 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    for (const key in formData) {
      if (key === 'colors') {
        if (formData.colors) {
          const colorsArray = formData.colors.split(',').map(c => c.trim()).filter(Boolean);
          colorsArray.forEach(color => data.append('colors[]', color));
        }
      } else if (key !== 'existing_image' && key !== 'existing_model') {
        data.append(key, formData[key]);
      }
    }
    if (imageFile) data.append('images[]', imageFile);
    if (modelFile) data.append('model_file', modelFile);

    try {
      if (editingProductId) {
        data.append('_method', 'PUT');
        await api.post(`/admin/products/${editingProductId}`, data, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      } else {
        await api.post('/admin/products', data, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      }
      setShowForm(false);
      setEditingProductId(null);
      fetchProducts();
      setFormData({name: '', description: '', price: '', stock_quantity: '', category: '', material: '', dimensions: '', colors: '', is_published: true, existing_image: null, existing_model: false});
      setImageFile(null);
      setModelFile(null);
    } catch (err) {
      alert(editingProductId ? 'Error updating product' : 'Error creating product');
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
        <button onClick={handleAddNew} className="bg-black text-white px-5 py-2 rounded-lg font-medium hover:bg-gray-800 transition shadow">
          {showForm ? 'Cancel' : '+ Add New Product'}
        </button>
      </div>

      {showForm && (
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 mb-10">
          <h2 className="text-xl font-bold mb-6 text-gray-800">{editingProductId ? 'Edit Product' : 'Add New Product'}</h2>
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
                <input name="material" value={formData.material} onChange={handleInput} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-black outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Dimensions</label>
                <input name="dimensions" placeholder="e.g. 80x40x30 cm" value={formData.dimensions} onChange={handleInput} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-black outline-none" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Colors (Comma separated)</label>
                <input name="colors" placeholder="e.g. Black, White, Walnut" value={formData.colors} onChange={handleInput} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-black outline-none" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea required name="description" value={formData.description} onChange={handleInput} rows="3" className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-black outline-none"></textarea>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-4 border rounded-xl bg-gray-50 border-dashed border-gray-300 relative group overflow-hidden">
                <label className="block text-sm font-bold text-gray-700 mb-2">Product Image</label>
                <input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files[0])} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                <div className="flex flex-col items-center gap-4 mt-2">
                  <div className="w-full h-32 rounded bg-white overflow-hidden flex items-center justify-center border border-gray-200">
                    {imageFile ? (
                      <img src={URL.createObjectURL(imageFile)} className="w-full h-full object-contain" alt="Preview" />
                    ) : (editingProductId && formData.existing_image) ? (
                      <img src={formData.existing_image} className="w-full h-full object-contain" alt="Existing" />
                    ) : (
                      <span className="text-gray-400 text-sm text-center px-2">No Image</span>
                    )}
                  </div>
                  <div className="text-sm text-gray-500 text-center">
                    <p className="font-medium text-black">Click or drag to upload</p>
                    <p className="text-xs">JPG, PNG, WEBP (Max 2MB)</p>
                  </div>
                </div>
              </div>
              <div className="p-4 border rounded-xl bg-orange-50 border-dashed border-orange-200 relative group overflow-hidden">
                <label className="block text-sm font-bold text-amber-950 mb-2">3D Model (.glb)</label>
                <input type="file" accept=".glb" onChange={(e) => setModelFile(e.target.files[0])} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                <div className="flex items-center gap-4 mt-2">
                  <div className={`w-16 h-16 rounded ${modelFile ? 'bg-amber-100 text-amber-700 border border-amber-300' : 'bg-orange-100 text-orange-400'} flex items-center justify-center`}>
                    <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5zm0 10l-10 5 10 5 10-5-10-5z"/></svg>
                  </div>
                  <div className="text-sm">
                    {modelFile ? (
                       <p className="font-bold text-green-700 break-all line-clamp-2">{modelFile.name}</p>
                    ) : (editingProductId && formData.existing_model) ? (
                       <p className="font-bold text-amber-700">Existing Model Selected</p>
                    ) : (
                       <>
                         <p className="font-medium text-amber-950">Click or drag to upload</p>
                         <p className="text-xs text-amber-800">GLB file (Max 50MB)</p>
                       </>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <button type="submit" className="w-full bg-amber-700 text-white font-bold py-3 rounded-xl hover:bg-amber-800 transition">
              {editingProductId ? 'Update Product' : 'Save Product'}
            </button>
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
                  <button onClick={() => handleEdit(prod)} className="text-blue-500 font-medium hover:text-blue-700">Edit</button>
                  <button onClick={() => deleteProduct(prod.id || prod._id)} className="text-red-500 font-medium hover:text-red-700">Delete</button>
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
