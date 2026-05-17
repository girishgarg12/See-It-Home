import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';

export default function ManageUsers() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = () => {
    setLoading(true);
    api.get('/admin/users')
      .then(res => setUsers(res.data.data || []))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/');
      return;
    }
    fetchUsers();
  }, [user, navigate]);

  const toggleRole = async (userId, currentRole) => {
    const newRole = currentRole === 'admin' ? 'customer' : 'admin';
    if (!confirm(`Change this user's role to "${newRole}"?`)) return;
    try {
      await api.patch(`/admin/users/${userId}`, { role: newRole });
      fetchUsers();
    } catch (err) {
      alert(err.response?.data?.message || 'Error updating user');
    }
  };

  const deleteUser = async (userId) => {
    if (!confirm('Are you sure you want to delete this user?')) return;
    try {
      await api.delete(`/admin/users/${userId}`);
      fetchUsers();
    } catch (err) {
      alert(err.response?.data?.message || 'Error deleting user');
    }
  };

  if (loading && users.length === 0) return <div className="p-10 text-center animate-pulse">Loading Users...</div>;

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Manage Users</h1>
        <span className="text-sm text-gray-500 font-medium">{users.length} users total</span>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100 text-sm tracking-wide text-gray-500 uppercase">
              <th className="p-5 font-bold">Name</th>
              <th className="p-5 font-bold">Email</th>
              <th className="p-5 font-bold">Role</th>
              <th className="p-5 font-bold">Joined</th>
              <th className="p-5 font-bold text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u._id} className="border-b border-gray-50 hover:bg-gray-50/50 transition">
                <td className="p-5 font-bold text-gray-900">{u.name}</td>
                <td className="p-5 text-gray-600">{u.email}</td>
                <td className="p-5">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                    u.role === 'admin' 
                      ? 'bg-purple-100 text-purple-700' 
                      : 'bg-orange-100 text-amber-800'
                  }`}>
                    {u.role}
                  </span>
                </td>
                <td className="p-5 text-gray-500 text-sm">
                  {u.created_at ? new Date(u.created_at).toLocaleDateString() : '—'}
                </td>
                <td className="p-5 text-right space-x-3">
                  <button 
                    onClick={() => toggleRole(u._id, u.role)} 
                    className="text-amber-700 font-medium hover:text-amber-900 text-sm"
                  >
                    {u.role === 'admin' ? 'Make Customer' : 'Make Admin'}
                  </button>
                  {u._id !== user._id && (
                    <button 
                      onClick={() => deleteUser(u._id)} 
                      className="text-red-500 font-medium hover:text-red-700 text-sm"
                    >
                      Delete
                    </button>
                  )}
                </td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr>
                <td colSpan="5" className="p-10 text-center text-gray-500">No users found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
