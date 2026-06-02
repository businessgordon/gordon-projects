import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { login } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { setUser } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await login(form);
      setUser(res.data.user);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-bgPrimary p-5">
      {/* Background decoration */}
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(ellipse_60%_40%_at_50%_0%,rgba(249,115,22,0.08)_0%,transparent_70%)]" />

      <div className="relative w-full max-w-[400px]">
        {/* Logo */}
        <div className="mb-10 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-accent text-[32px]">🔩</div>
          <h1 className="m-0 font-rajdhani text-4xl font-bold tracking-[0.05em] text-textPrimary">SmartPark</h1>
          <p className="mt-1 text-sm text-textSecondary">Car Repair Payment Management System</p>
        </div>

        <div className="card p-8">
          <h2 className="mb-6 font-rajdhani text-xl font-semibold text-textPrimary">Sign In</h2>

          {error && <div className="alert alert-error">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Username</label>
              <input
                type="text"
                placeholder="Enter your username"
                value={form.username}
                onChange={e => setForm({ ...form, username: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                placeholder="Enter your password"
                value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary mt-2 w-full justify-center py-3.5" disabled={loading}>
              {loading ? 'Signing in...' : '🔑 Sign In'}
            </button>
          </form>
          <p className="mt-5 text-center text-sm text-textSecondary">
            No account? <Link to="/register" className="text-accent no-underline">Register here</Link>
          </p>
        </div>
        <p className="mt-4 text-center text-xs text-textSecondary">
          SmartPark — Rubavu District, Western Province, Rwanda
        </p>
      </div>
    </div>
  );
}
