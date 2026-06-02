import { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function Login() {
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  if (user) return <Navigate to="/" replace />;

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to login');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-10">
      <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white/95 p-8 shadow-glass">
        <h1 className="mb-6 text-3xl font-semibold text-slate-900">Welcome back</h1>
        <p className="mb-6 text-slate-600">Log in to access the CWSMS dashboard.</p>
        {error && <div className="mb-4 rounded-2xl bg-rose-500/10 px-4 py-3 text-rose-600">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block">
            <span className="text-slate-600">Email</span>
            <input
              className="mt-2 w-full surface-input"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>
          <label className="block">
            <span className="text-slate-600">Password</span>
            <input
              className="mt-2 w-full surface-input"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </label>
          <button className="w-full surface-button surface-button-accent">Login</button>
        </form>
        <p className="mt-6 text-center text-slate-500">
          New user? <a className="text-accent hover:underline" href="/register">Register</a>
        </p>
      </div>
    </div>
  );
}
