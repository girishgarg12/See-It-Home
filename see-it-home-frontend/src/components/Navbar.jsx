import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { cartCount } = useCart();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const firstLetter = user?.name ? user.name.charAt(0).toUpperCase() : 'U';

  return (
    <nav className="bg-white shadow px-6 py-4 flex justify-between items-center sticky top-0 z-50">
      <Link to="/" className="text-2xl font-bold text-gray-800 tracking-tight">
        SeeIt<span className="text-amber-700">Home</span>
      </Link>
      
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
