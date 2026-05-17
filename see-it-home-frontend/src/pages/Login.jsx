import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto my-20 bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
      <h2 className="text-3xl font-bold text-center mb-8 text-gray-900">Welcome Back</h2>
      
      {error && <div className="bg-red-50 text-red-500 p-4 rounded-lg mb-6 text-sm font-medium">{error}</div>}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
          <input 
            type="email" required
            value={email} onChange={e => setEmail(e.target.value)}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-amber-700 outline-none transition"
            placeholder="you@example.com"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
          <input 
            type="password" required
            value={password} onChange={e => setPassword(e.target.value)}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-amber-700 outline-none transition"
            placeholder="••••••••"
          />
        </div>
        <button 
          type="submit" disabled={loading}
          className="w-full bg-black text-white font-bold py-3 rounded-xl hover:bg-gray-800 transition disabled:opacity-50"
        >
          {loading ? 'Signing in...' : 'Sign In'}
        </button>
      </form>
      
      <p className="text-center mt-8 text-gray-600 text-sm">
        Don't have an account? <Link to="/register" className="text-amber-700 font-bold hover:underline">Create one</Link>
      </p>
    </div>
  );
}
