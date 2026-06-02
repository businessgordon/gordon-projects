import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';

const menu = [
  { key: 'dashboard', label: 'Dashboard' },
  { key: 'cars', label: 'Cars' },
  { key: 'packages', label: 'Packages' },
  { key: 'services', label: 'Service Packages' },
  { key: 'payments', label: 'Payments' },
  { key: 'invoices', label: 'Invoices' },
  { key: 'reports', label: 'Reports' },
  { key: 'settings', label: 'Settings' },
];

export default function Sidebar({ active, onSelect }) {
  const { logout, user } = useAuth();
  const [open, setOpen] = useState(true);

  return (
    <aside className={`fixed inset-y-0 left-0 z-30 flex h-full w-72 flex-col bg-white/95 text-slate-900 p-4 shadow-glass backdrop-blur-xl transition-transform ${open ? 'translate-x-0' : '-translate-x-72'} sm:translate-x-0`}>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <p className="text-lg font-semibold text-slate-900">CWSMS</p>
          <p className="text-sm text-slate-500">{user?.role || 'Admin'}</p>
        </div>
        <button className="text-slate-700 sm:hidden" onClick={() => setOpen(!open)}>
          ☰
        </button>
      </div>
      <nav className="space-y-2 flex-1">
        {menu.map((item) => (
          <button
            key={item.key}
            onClick={() => onSelect(item.key)}
            className={`w-full rounded-3xl px-4 py-3 text-left transition ${active === item.key ? 'bg-primary text-white shadow-[0_10px_30px_rgba(14,165,233,0.15)]' : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'}`}>
            {item.label}
          </button>
        ))}
      </nav>
      <div className="mt-4 space-y-2">
        <button className="w-full rounded-3xl bg-primary px-4 py-3 text-white hover:opacity-95" onClick={logout}>
          Logout
        </button>
      </div>
    </aside>
  );
}
