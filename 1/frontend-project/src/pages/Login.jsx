import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../api/userApi';
import { toast } from 'react-toastify';

function Login({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!username || !password) {
      return toast.error('Please enter both username and password');
    }
    setLoading(true);
    try {
      await loginUser({ username, password });
      localStorage.setItem('epms_user', username);
      onLogin(username);
      toast.success('Login successful');
      navigate('/');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto mt-16 grid max-w-6xl gap-8 rounded-[32px] bg-white/95 p-0 shadow-2xl shadow-slate-950/20 lg:grid-cols-[1.1fr_0.9fr]">
      <section className="rounded-[32px] bg-gradient-to-br from-slate-950 via-slate-900 to-cyan-800 p-8 text-white lg:p-10">
        <p className="soft-pill bg-white/10 text-cyan-100">SmartPark</p>
        <h1 className="mt-4 text-4xl font-semibold">Employee Payroll Management System</h1>
        <p className="mt-4 max-w-md text-slate-200">A modern payroll workspace for efficient employee records, salary checks, and monthly reporting in one place.</p>
        <div className="mt-8 rounded-3xl border border-white/10 bg-white/8 p-5 text-sm text-slate-100">✨ Faster payroll reviews<br/>📊 Clean monthly reports<br/>🔐 Secure login and session management</div>
      </section>
      <section className="p-8 lg:p-10">
        <h2 className="text-2xl font-semibold text-slate-900">Welcome back</h2>
        <p className="mt-2 text-slate-500">Sign in to access payroll tools and dashboards.</p>
        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
        <div>
          <label className="block text-sm font-medium text-slate-700">Username</label>
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="mt-2 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-900 placeholder:text-slate-400 focus:border-sky-400"
            placeholder="Enter username"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-2 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-900 placeholder:text-slate-400 focus:border-sky-400"
            placeholder="Enter password"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-2xl bg-gradient-to-r from-slate-900 via-slate-800 to-cyan-700 px-4 py-3 text-white transition hover:scale-[1.01] hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? 'Signing in...' : 'Login'}
        </button>
      </form>
      </section>
    </div>
  );
}

export default Login;
