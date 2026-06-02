import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { userAPI } from '../api/userAPI';
import Alert from '../components/Alert';

const LoginPage = ({ onLoginSuccess }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await userAPI.login(formData.username, formData.password);
      setAlert({ type: 'success', message: 'Login successful!' });
      onLoginSuccess(response.data.user);
      setTimeout(() => navigate('/dashboard'), 1500);
    } catch (error) {
      setAlert({ 
        type: 'error', 
        message: error.response?.data?.message || 'Login failed' 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-emerald-600 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="text-5xl mb-4">📦</div>
            <h1 className="text-3xl font-bold text-gray-800">SIMS</h1>
            <p className="text-gray-600 mt-2">Stock Inventory Management System</p>
            <p className="text-sm text-gray-500 mt-1">SmartPark - Rubavu District, Rwanda</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Username
              </label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Enter your username"
                className="input-field"
                required
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                className="input-field"
                required
                disabled={loading}
              />
              <p className="text-xs text-gray-500 mt-1">Default: admin / password123</p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary mt-6"
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>

          {/* Register Link */}
          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Don't have an account?{' '}
              <Link to="/register" className="text-blue-600 hover:text-blue-700 font-semibold">
                Register here
              </Link>
            </p>
          </div>
        </div>

        {/* Alert */}
        {alert && (
          <Alert
            type={alert.type}
            message={alert.message}
            onClose={() => setAlert(null)}
            duration={alert.type === 'error' ? 5000 : 1500}
          />
        )}
      </div>
    </div>
  );
};

export default LoginPage;
