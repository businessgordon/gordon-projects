import { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function Register() {
  const { register, user } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const [error, setError] = useState(null);

  if (user) return <Navigate to="/" replace />;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(form);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to register');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-10">
      <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white/95 p-8 shadow-glass">
        <h1 className="mb-6 text-3xl font-semibold text-slate-900">Create account</h1>
        <p className="mb-6 text-slate-600">Register as an admin user for CWSMS.</p>
        {error && <div className="mb-4 rounded-2xl bg-rose-500/10 px-4 py-3 text-rose-600">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block">
            <span className="text-slate-600">Username</span>
            <input
              className="mt-2 w-full surface-input"
              type="text"
              name="username"
              value={form.username}
              onChange={handleChange}
              required
            />
          </label>
          <label className="block">
            <span className="text-slate-600">Email</span>
            <input
              className="mt-2 w-full surface-input"
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
            />
          </label>
          <label className="block">
            <span className="text-slate-600">Password</span>
            <input
              className="mt-2 w-full surface-input"
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              required
            />
          </label>
          <button className="w-full surface-button surface-button-accent">Register</button>
        </form>
        <p className="mt-6 text-center text-slate-500">
          Already registered? <a className="text-accent hover:underline" href="/login">Login</a>
        </p>
      </div>
    </div>
  );
}
