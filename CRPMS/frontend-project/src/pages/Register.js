import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { register } from '../services/api';

export default function Register() {
  const [form, setForm] = useState({ username: '', password: '', fullName: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setSuccess('');
    if (form.password.length < 8) {
      return setError('Password must be at least 8 characters.');
    }
    setLoading(true);
    try {
      await register(form);
      setSuccess('Account created! Redirecting to login...');
      setTimeout(() => navigate('/login'), 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-bgPrimary p-5">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(ellipse_60%_40%_at_50%_0%,rgba(249,115,22,0.08)_0%,transparent_70%)]" />

      <div className="relative w-full max-w-[400px]">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-accent text-2xl">🔩</div>
          <h1 className="m-0 font-rajdhani text-2xl font-bold text-textPrimary">Create Account</h1>
          <p className="mt-1 text-sm text-textSecondary">CRPMS — SmartPark</p>
        </div>
        <div className="card p-8">
          {error && <div className="alert alert-error">{error}</div>}
          {success && <div className="alert alert-success">{success}</div>}
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Full Name</label>
              <input type="text" placeholder="Chief Mechanic Name" value={form.fullName}
                onChange={e => setForm({ ...form, fullName: e.target.value })} required />
            </div>
            <div className="form-group">
              <label>Username</label>
              <input type="text" placeholder="Choose a username" value={form.username}
                onChange={e => setForm({ ...form, username: e.target.value })} required />
            </div>
            <div className="form-group">
              <label>Password <span className="font-normal normal-case tracking-normal text-textSecondary">(min. 8 characters)</span></label>
              <input type="password" placeholder="Strong password" value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })} required />
            </div>
            <button type="submit" className="btn btn-primary mt-2 w-full justify-center py-3.5" disabled={loading}>
              {loading ? 'Creating...' : '✅ Create Account'}
            </button>
          </form>
          <p className="mt-5 text-center text-sm text-textSecondary">
            Have an account? <Link to="/login" className="text-accent no-underline">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
