import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import CartItem from '../components/CartItem';

export default function Cart() {
  const { user } = useAuth();
  const { cart, loading, cartTotal, fetchCart } = useCart();

  if (loading) return <div className="p-10 text-center animate-pulse">Loading Cart...</div>;

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto py-20 px-6 text-center">
        <h2 className="text-3xl font-bold mb-4">Your Shopping Cart</h2>
        <p className="text-gray-500 mb-8">Please log in to view your cart.</p>
        <Link to="/login" className="px-8 py-3 bg-black text-white font-medium rounded-lg shadow hover:bg-gray-800 transition">
          Sign In
        </Link>
      </div>
    );
  }

  const items = cart?.items || [];

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>
      
      {items.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
          <div className="text-6xl mb-4">🛒</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Your cart is empty</h2>
          <p className="text-gray-500 mb-6">Looks like you haven't added anything yet.</p>
          <Link to="/products" className="px-6 py-3 bg-amber-700 text-white font-medium rounded-lg hover:bg-amber-800 transition">
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-4">
            {items.map((item, index) => (
              <CartItem 
                key={index} 
                item={item} 
                index={index} 
                onUpdate={fetchCart} 
                onRemove={fetchCart} 
              />
            ))}
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 h-fit sticky top-24">
            <h3 className="text-xl font-bold mb-6">Order Summary</h3>
            <div className="space-y-4 text-gray-600 mb-6">
              <div className="flex justify-between">
                <span>Subtotal ({items.length} items)</span>
                <span className="font-medium text-gray-900">₹{cartTotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span className="font-medium text-gray-900">₹150</span>
              </div>
            </div>
            <div className="border-t pt-4 mb-8 flex justify-between items-center">
              <span className="font-bold text-lg">Total</span>
              <span className="font-bold text-2xl text-amber-700">₹{(cartTotal + 150).toLocaleString()}</span>
            </div>
            <Link to="/checkout" className="w-full block text-center bg-black text-white py-4 rounded-xl font-bold hover:bg-gray-800 transition shadow-lg">
              Proceed to Checkout
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
