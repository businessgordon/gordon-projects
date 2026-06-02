import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = ({ user, onLogout }) => {
  const location = useLocation();

  const menuItems = [
    { path: '/dashboard', label: 'Dashboard', icon: '📊' },
    { path: '/spareparts', label: 'Spare Parts', icon: '🔧' },
    { path: '/stockin', label: 'Stock In', icon: '📦' },
    { path: '/stockout', label: 'Stock Out', icon: '🚚' },
    { path: '/reports', label: 'Reports', icon: '📈' }
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <div className="fixed left-0 top-0 h-screen w-64 bg-gradient-to-b from-slate-800 to-slate-900 text-white shadow-2xl overflow-y-auto">
      {/* Logo/Header */}
      <div className="p-6 border-b border-slate-700">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <span className="text-emerald-400">📦</span>
          <span>SIMS</span>
        </h1>
        <p className="text-sm text-slate-400 mt-1">SmartPark</p>
      </div>

      {/* User Info */}
      <div className="p-4 bg-slate-700 m-4 rounded-lg">
        <p className="text-xs text-slate-300 uppercase tracking-wide">Logged in as</p>
        <p className="font-semibold text-white truncate">{user?.username || 'User'}</p>
      </div>

      {/* Menu Items */}
      <nav className="p-4">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition duration-200 ${
              isActive(item.path)
                ? 'bg-emerald-500 text-white'
                : 'text-slate-300 hover:bg-slate-700'
            }`}
          >
            <span className="text-xl">{item.icon}</span>
            <span className="font-medium">{item.label}</span>
          </Link>
        ))}
      </nav>

      {/* Logout Button */}
      <div className="absolute bottom-4 left-4 right-4">
        <button
          onClick={onLogout}
          className="w-full px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition duration-200 font-semibold"
        >
          🚪 Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
