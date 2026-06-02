import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

export default function Login({ setUser }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await api.post('/api/auth/login', { username, password });
      setUser(response.data);
      navigate('/car');
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 p-6">
      <div className="grid w-full max-w-5xl grid-cols-1 overflow-hidden rounded-[32px] bg-white shadow-2xl lg:grid-cols-[1.4fr_1fr]">
        <div className="relative p-10 bg-slate-950 text-white">
          <span className="inline-flex rounded-full bg-sky-400/20 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-sky-200">
            Welcome back
          </span>
          <h2 className="mt-8 text-4xl font-semibold leading-tight">Parking Service System</h2>
          <p className="mt-4 max-w-lg text-slate-300 leading-7">
            Secure administrator login for SmartPark. Access vehicle management, parking slots, records, payments and reports with one elegant dashboard.
          </p>
          <div className="mt-10 rounded-[28px] border border-white/10 bg-white/5 p-6 text-sm text-slate-300 ring-1 ring-white/10">
            <p className="font-medium text-slate-100">Dashboard access made easy</p>
            <p className="mt-3 leading-6">
              Enter your username and password to continue. Your session is secured and ready for operational parking management.
            </p>
          </div>
        </div>
        <div className="p-10 bg-slate-50">
          <h3 className="text-2xl font-semibold text-slate-900">Sign in to continue</h3>
          <p className="mt-2 text-slate-600">Manage parking records and payments with a modern dashboard experience.</p>
          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <div className="space-y-3">
              <label className="text-sm font-medium text-slate-700">Username</label>
              <input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="form-field"
                required
              />
            </div>
            <div className="space-y-3">
              <label className="text-sm font-medium text-slate-700">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="form-field"
                required
              />
            </div>
            {error && <div className="rounded-2xl bg-rose-50 p-3 text-sm text-rose-700">{error}</div>}
            <button type="submit" className="primary-button w-full justify-center">
              Login
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
