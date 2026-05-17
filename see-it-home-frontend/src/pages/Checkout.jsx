import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

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

export default function Checkout() {
  const { user } = useAuth();
  const { fetchCart } = useCart();
  const navigate = useNavigate();
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState(1); // 1=address, 2=payment, 3=processing, 4=success
  const [address, setAddress] = useState({ street: '', city: '', state: '', zip: '', country: '' });
  const [card, setCard] = useState({ number: '', name: '', expiry: '', cvv: '' });
  const [error, setError] = useState('');
  const [orderId, setOrderId] = useState('');

  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    api.get('/cart')
      .then(res => {
        if (!res.data.data.items || res.data.data.items.length === 0) {
          navigate('/cart');
        } else {
          setCart(res.data.data);
        }
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [user, navigate]);

  const handleAddress = (e) => setAddress({ ...address, [e.target.name]: e.target.value });
  const handleCard = (e) => {
    let { name, value } = e.target;
    if (name === 'number') {
      value = value.replace(/\D/g, '').slice(0, 16);
      value = value.replace(/(.{4})/g, '$1 ').trim();
    }
    if (name === 'expiry') {
      value = value.replace(/\D/g, '').slice(0, 4);
      if (value.length > 2) value = value.slice(0, 2) + '/' + value.slice(2);
    }
    if (name === 'cvv') {
      value = value.replace(/\D/g, '').slice(0, 3);
    }
    setCard({ ...card, [name]: value });
  };

  const processPayment = async (e) => {
    e.preventDefault();
    setError('');

    // Validate card (demo)
    const rawNumber = card.number.replace(/\s/g, '');
    if (rawNumber.length < 16) { setError('Please enter a valid 16-digit card number.'); return; }
    if (!card.name.trim()) { setError('Please enter cardholder name.'); return; }
    if (card.expiry.length < 5) { setError('Please enter a valid expiry date (MM/YY).'); return; }
    if (card.cvv.length < 3) { setError('Please enter a valid 3-digit CVV.'); return; }

    // Step 3 — simulated processing
    setStep(3);

    try {
      // Simulate a 2-second payment gateway delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Place the order
      const res = await api.post('/orders', { shipping_address: address });
      setOrderId(res.data.data.order_id);

      // Refresh cart count in navbar
      if (fetchCart) fetchCart();

      // Step 4 — success
      setStep(4);
    } catch (err) {
      setError(err.response?.data?.message || 'Payment failed. Please try again.');
      setStep(2);
    }
  };

  if (loading) return <div className="p-10 text-center animate-pulse">Loading Checkout...</div>;

  const items = cart?.items || [];
  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = 150;
  const total = subtotal + shipping;

  // Step 3: Processing animation
  if (step === 3) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-6">
        <div className="relative">
          <div className="w-20 h-20 rounded-full border-4 border-amber-200 border-t-amber-700 animate-spin"></div>
        </div>
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Processing Payment...</h2>
          <p className="text-gray-500">Please wait while we verify your payment.</p>
        </div>
      </div>
    );
  }

  // Step 4: Success
  if (step === 4) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-6 px-6">
        <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center">
          <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <div className="text-center max-w-md">
          <h2 className="text-3xl font-bold text-gray-900 mb-3">Payment Successful!</h2>
          <p className="text-gray-600 mb-2">Your order has been placed successfully.</p>
          <p className="text-sm text-gray-500 mb-8">Order ID: <span className="font-mono font-bold text-gray-800">{orderId?.substring(orderId.length - 8)}</span></p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button onClick={() => navigate('/orders')} className="px-8 py-3 bg-amber-700 text-white font-bold rounded-xl hover:bg-amber-800 transition shadow-lg">
              View My Orders
            </button>
            <button onClick={() => navigate('/products')} className="px-8 py-3 bg-white text-gray-800 font-bold rounded-xl border border-gray-200 hover:bg-gray-50 transition">
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-2 gap-12">
      <div>
        <h1 className="text-3xl font-bold mb-2 text-gray-900">Checkout</h1>
        {/* Step indicator */}
        <div className="flex items-center gap-3 mb-8">
          <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${step >= 1 ? 'bg-amber-700 text-white' : 'bg-gray-200 text-gray-500'}`}>1</span>
          <div className={`flex-1 h-1 rounded ${step >= 2 ? 'bg-amber-700' : 'bg-gray-200'}`}></div>
          <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${step >= 2 ? 'bg-amber-700 text-white' : 'bg-gray-200 text-gray-500'}`}>2</span>
        </div>

        {/* Step 1: Address */}
        {step === 1 && (
          <form onSubmit={(e) => { e.preventDefault(); setStep(2); }} className="space-y-6">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
              <h2 className="text-xl font-bold mb-6 text-gray-800">Shipping Address</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Street Address</label>
                  <input required name="street" value={address.street} onChange={handleAddress} className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-amber-700 outline-none" placeholder="123 Main Street" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                    <input required name="city" value={address.city} onChange={handleAddress} className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-amber-700 outline-none" placeholder="Mumbai" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                    <input required name="state" value={address.state} onChange={handleAddress} className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-amber-700 outline-none" placeholder="Maharashtra" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Postal Code</label>
                    <input required name="zip" value={address.zip} onChange={handleAddress} className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-amber-700 outline-none" placeholder="400001" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                    <input required name="country" value={address.country} onChange={handleAddress} className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-amber-700 outline-none" placeholder="India" />
                  </div>
                </div>
              </div>
            </div>
            <button type="submit" className="w-full bg-amber-700 text-white font-bold py-4 rounded-xl shadow-lg hover:bg-amber-800 transition">
              Continue to Payment →
            </button>
          </form>
        )}

        {/* Step 2: Payment */}
        {step === 2 && (
          <form onSubmit={processPayment} className="space-y-6">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-800">Payment Details</h2>
                <span className="text-xs font-bold bg-green-100 text-green-700 px-3 py-1 rounded-full">🔒 Demo Mode</span>
              </div>

              {/* Demo Card Preview */}
              <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-amber-900 rounded-2xl p-6 mb-6 text-white shadow-xl">
                <div className="flex justify-between items-start mb-8">
                  <p className="text-xs font-medium opacity-70 uppercase tracking-widest">Credit Card</p>
                  <svg className="w-10 h-7" viewBox="0 0 40 28" fill="none"><rect x="0" y="0" width="16" height="28" rx="3" fill="#EB001B" opacity="0.8"/><rect x="24" y="0" width="16" height="28" rx="3" fill="#F79E1B" opacity="0.8"/><rect x="12" y="4" width="16" height="20" rx="3" fill="#FF5F00" opacity="0.6"/></svg>
                </div>
                <p className="text-xl font-mono tracking-[0.25em] mb-6">{card.number || '•••• •••• •••• ••••'}</p>
                <div className="flex justify-between">
                  <div>
                    <p className="text-[10px] opacity-50 uppercase tracking-wider">Card Holder</p>
                    <p className="text-sm font-medium">{card.name || 'YOUR NAME'}</p>
                  </div>
                  <div>
                    <p className="text-[10px] opacity-50 uppercase tracking-wider">Expires</p>
                    <p className="text-sm font-medium">{card.expiry || 'MM/YY'}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Card Number</label>
                  <input required name="number" value={card.number} onChange={handleCard} className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-amber-700 outline-none font-mono tracking-wider" placeholder="1234 5678 9012 3456" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Cardholder Name</label>
                  <input required name="name" value={card.name} onChange={handleCard} className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-amber-700 outline-none" placeholder="John Doe" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date</label>
                    <input required name="expiry" value={card.expiry} onChange={handleCard} className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-amber-700 outline-none" placeholder="MM/YY" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">CVV</label>
                    <input required name="cvv" type="password" value={card.cvv} onChange={handleCard} className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-amber-700 outline-none" placeholder="•••" />
                  </div>
                </div>
              </div>
            </div>

            {error && <p className="text-red-500 font-medium bg-red-50 p-4 rounded-lg">{error}</p>}

            <div className="flex gap-4">
              <button type="button" onClick={() => setStep(1)} className="flex-1 bg-white text-gray-800 font-bold py-4 rounded-xl border border-gray-200 hover:bg-gray-50 transition">
                ← Back
              </button>
              <button type="submit" className="flex-1 bg-black text-white font-bold py-4 rounded-xl shadow-lg hover:bg-gray-800 transition">
                Pay ₹{total.toLocaleString()}
              </button>
            </div>

            <p className="text-center text-xs text-gray-400 mt-2">This is a demo payment. No real charges will be made.</p>
          </form>
        )}
      </div>

      {/* Order Summary Sidebar */}
      <div>
        <div className="bg-gray-50 p-8 rounded-2xl sticky top-24 border border-gray-100">
          <h2 className="text-xl font-bold mb-6 text-gray-900">Order Summary</h2>
          <div className="space-y-4 mb-6">
            {items.map((item, idx) => (
              <div key={idx} className="flex gap-4">
                <div className="w-16 h-16 bg-white rounded border flex-shrink-0 overflow-hidden">
                  {item.image && <img src={mapStorageUrl(item.image)} className="w-full h-full object-cover" />}
                </div>
                <div className="flex-grow">
                  <h4 className="font-medium text-sm text-gray-900 line-clamp-1">{item.name}</h4>
                  <p className="text-xs text-gray-500 mt-1">Qty: {item.quantity}</p>
                </div>
                <div className="font-medium text-sm">₹{(item.price * item.quantity).toLocaleString()}</div>
              </div>
            ))}
          </div>

          <div className="space-y-3 pt-6 border-t border-gray-200 text-sm text-gray-600">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="font-medium text-gray-900">₹{subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping</span>
              <span className="font-medium text-gray-900">₹{shipping}</span>
            </div>
          </div>
          
          <div className="pt-4 mt-4 border-t border-gray-200 flex justify-between items-center">
            <span className="text-lg font-bold text-gray-900">Total</span>
            <span className="text-2xl font-bold text-amber-700">₹{total.toLocaleString()}</span>
          </div>

          {/* Shipping address preview (step 2+) */}
          {step >= 2 && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <p className="text-xs text-gray-500 uppercase tracking-wider font-bold mb-2">Shipping To</p>
              <p className="text-sm text-gray-800 font-medium">{address.street}</p>
              <p className="text-sm text-gray-600">{address.city}, {address.state} {address.zip}</p>
              <p className="text-sm text-gray-600">{address.country}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
