import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import api from '../api/axios';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();
  
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searchOpen, setSearchOpen] = useState(false);
  const searchRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setSearchOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (!searchTerm.trim()) {
      setSearchResults([]);
      return;
    }
    
    const timer = setTimeout(() => {
      api.get(`/products?search=${encodeURIComponent(searchTerm)}&per_page=5`)
        .then(res => {
          setSearchResults(res.data.data.data || res.data.data || []);
        })
        .catch(err => console.error('Search error:', err));
    }, 300); // debounce

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      setSearchOpen(false);
      navigate(`/products?search=${encodeURIComponent(searchTerm)}`);
    }
  };

  const firstLetter = user?.name ? user.name.charAt(0).toUpperCase() : 'U';

  return (
    <nav className="bg-white shadow px-6 py-4 flex flex-wrap justify-between items-center sticky top-0 z-50 gap-4">
      <Link to="/" className="text-2xl font-bold text-gray-800 tracking-tight">
        SeeIt<span className="text-amber-700">Home</span>
      </Link>
      
      <div className="flex-grow max-w-md mx-4 hidden md:block relative" ref={searchRef}>
        <form onSubmit={handleSearchSubmit} className="relative">
          <input 
            type="text" 
            placeholder="Search products..." 
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setSearchOpen(true);
            }}
            onFocus={() => setSearchOpen(true)}
            className="w-full px-4 py-2 bg-gray-100 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-amber-700 focus:bg-white transition text-sm"
          />
          <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-amber-700">
            🔍
          </button>
        </form>

        {/* Search Autocomplete Dropdown */}
        {searchOpen && searchResults.length > 0 && (
          <div className="absolute top-full left-0 w-full mt-2 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50 overflow-hidden">
            {searchResults.map(product => (
              <Link 
                key={product.id || product._id} 
                to={`/products/${product.id || product._id}`}
                onClick={() => {
                  setSearchOpen(false);
                  setSearchTerm('');
                }}
                className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition border-b border-gray-50 last:border-0"
              >
                <div className="flex-grow min-w-0">
                  <p className="text-sm font-bold text-gray-900 truncate">{product.name}</p>
                  <p className="text-xs text-gray-500 uppercase">{product.category}</p>
                </div>
                <div className="text-amber-700 font-bold text-sm">
                  ₹{product.price}
                </div>
              </Link>
            ))}
            <button 
              onClick={handleSearchSubmit}
              className="w-full text-center px-4 py-3 text-sm text-amber-700 hover:bg-amber-50 font-bold transition"
            >
              View all results
            </button>
          </div>
        )}
      </div>

      <div className="flex gap-6 items-center">
        <Link to="/products" className="text-gray-600 hover:text-black font-medium transition">Products</Link>
        
        {user ? (
          <>
            {user.role !== 'admin' && (
              <>
                <Link to="/wishlist" className="text-gray-600 hover:text-red-500 font-medium transition">Wishlist</Link>
                <Link to="/cart" className="text-gray-600 hover:text-black font-medium transition relative">
                  Cart
                  {cartCount > 0 && (
                    <span className="absolute -top-2 -right-4 bg-amber-700 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                      {cartCount > 9 ? '9+' : cartCount}
                    </span>
                  )}
                </Link>
                <Link to="/orders" className="text-gray-600 hover:text-black font-medium transition">Orders</Link>
              </>
            )}

            {/* Profile Circle and Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button 
                onClick={() => setDropdownOpen(!dropdownOpen)} 
                className="w-10 h-10 rounded-full bg-amber-800 text-white flex items-center justify-center font-bold hover:bg-amber-900 transition focus:outline-none shadow-sm cursor-pointer"
              >
                {firstLetter}
              </button>
              
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50">
                  <div className="px-4 py-2 border-b border-gray-100">
                    <p className="text-sm font-semibold text-gray-800 truncate">{user.name}</p>
                    <p className="text-xs text-gray-500 truncate">{user.email}</p>
                  </div>
                  {user.role === 'admin' && (
                    <Link 
                      to="/admin/dashboard" 
                      onClick={() => setDropdownOpen(false)}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-amber-800 transition"
                    >
                      Admin Dashboard
                    </Link>
                  )}
                  {user.role !== 'admin' && (
                    <Link 
                      to="/orders" 
                      onClick={() => setDropdownOpen(false)}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-amber-800 transition"
                    >
                      My Orders
                    </Link>
                  )}
                  <button 
                    onClick={() => { setDropdownOpen(false); logout(); }} 
                    className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition cursor-pointer"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </>
        ) : (
          <Link to="/login" className="bg-black text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition shadow">
            Sign In
          </Link>
        )}
      </div>
    </nav>
  );
}
