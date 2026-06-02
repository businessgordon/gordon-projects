import { NavLink, useNavigate } from 'react-router-dom';
import api from '../services/api';

export default function Layout({ children, setUser }) {
  const navigate = useNavigate();

  const logout = async () => {
    await api.post('/api/auth/logout');
    setUser(null);
    navigate('/login');
  };

  const navLinkClass = ({ isActive }) =>
    isActive
      ? 'inline-flex items-center rounded-full bg-slate-800 text-white px-4 py-2 text-sm font-medium shadow-sm'
      : 'inline-flex items-center rounded-full text-slate-700 hover:text-slate-900 px-4 py-2 text-sm font-medium transition';

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <header className="bg-slate-950 text-white shadow-2xl">
        <div className="container mx-auto px-4 py-8 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-sky-300/80">SmartPark PSSMS</p>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight">Parking Service System Dashboard</h1>
            <p className="mt-3 max-w-2xl text-slate-300 leading-7">
              Manage parking records, vehicles, slots, payments and reports from one modern dashboard.
            </p>
          </div>
          <button
            onClick={logout}
            className="primary-button bg-rose-500 hover:bg-rose-600 shadow-rose-500/20"
          >
            Logout
          </button>
        </div>
      </header>
      <div className="bg-slate-900 text-slate-100 border-b border-slate-800 shadow-sm">
        <div className="container mx-auto px-4 py-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap gap-2">
            <NavLink to="/car" className={navLinkClass}>Cars</NavLink>
            <NavLink to="/parkingslot" className={navLinkClass}>Slots</NavLink>
            <NavLink to="/parkingrecord" className={navLinkClass}>Records</NavLink>
            <NavLink to="/payment" className={navLinkClass}>Payment</NavLink>
            <NavLink to="/reports" className={navLinkClass}>Reports</NavLink>
          </div>
          <div className="text-sm text-slate-400">Fast, secure parking management for administrators.</div>
        </div>
      </div>
      <main className="container mx-auto px-4 py-6">{children}</main>
    </div>
  );
}
