import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({ name: '', email: '', password: '', password_confirmation: '', phone: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      await api.post('/auth/register', formData);
      await login(formData.email, formData.password);
      navigate('/');
    } catch (err) {
      if (err.response?.data?.errors) {
        const firstError = Object.values(err.response.data.errors)[0][0];
        setError(firstError);
      } else {
        setError(err.response?.data?.message || 'Registration failed.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleInput = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  return (
    <div className="max-w-md mx-auto my-20 bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
      <h2 className="text-3xl font-bold text-center mb-8 text-gray-900">Create Account</h2>
      
      {error && <div className="bg-red-50 text-red-500 p-4 rounded-lg mb-6 text-sm font-medium">{error}</div>}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
          <input required name="name" onChange={handleInput} className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-amber-700 outline-none" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input type="email" required name="email" onChange={handleInput} className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-amber-700 outline-none" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number (Optional)</label>
          <input name="phone" onChange={handleInput} className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-amber-700 outline-none" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
          <input type="password" required name="password" onChange={handleInput} className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-amber-700 outline-none" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
          <input type="password" required name="password_confirmation" onChange={handleInput} className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-amber-700 outline-none" />
        </div>
        <button type="submit" disabled={loading} className="w-full bg-amber-700 text-white font-bold py-3 rounded-xl hover:bg-amber-800 transition mt-6 disabled:opacity-50 shadow-md">
          {loading ? 'Creating...' : 'Register'}
        </button>
      </form>
      
      <p className="text-center mt-8 text-gray-600 text-sm">
        Already have an account? <Link to="/login" className="text-black font-bold hover:underline">Sign In</Link>
      </p>
    </div>
  );
}
