import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../api/axios';
import ProductCard from '../components/ProductCard';

export default function ProductListing() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = searchParams.get('category') || 'All';
  
  const [products, setProducts] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [activeCategory, setActiveCategory] = useState(initialCategory);

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (activeCategory !== 'All') {
      params.append('category', activeCategory);
    }
    
    // Also include search parameter if present
    const searchQuery = searchParams.get('search');
    if (searchQuery) {
      params.append('search', searchQuery);
    }

    api.get(`/products?${params.toString()}`)
      .then(res => {
        setProducts(res.data.data.data || res.data.data || []);
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [activeCategory, searchParams]);

  const handleCategoryClick = (cat) => {
    setActiveCategory(cat);
    // Optionally update URL
    if (cat === 'All') {
      searchParams.delete('category');
    } else {
      searchParams.set('category', cat);
    }
    setSearchParams(searchParams);
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-4">
        <div>
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight mb-2">Our Collection</h1>
          <p className="text-gray-500">Discover premium furniture crafted for modern living.</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          {[...new Set(['All', 'Sofas', 'Chairs', 'Tables', 'Beds', activeCategory !== 'All' ? activeCategory : null].filter(Boolean))].map(cat => (
            <button 
              key={cat} 
              onClick={() => handleCategoryClick(cat)}
              className={`px-4 py-2 rounded-full border text-sm font-medium transition capitalize ${
                activeCategory === cat 
                  ? 'border-black bg-black text-white' 
                  : 'border-gray-200 hover:border-black hover:bg-black hover:text-white'
              }`}
            >
              {cat.replace('-', ' ')}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-gray-100">
          <p className="text-xl text-gray-500">No products found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {products.map(product => (
            <ProductCard key={product.id || product._id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
