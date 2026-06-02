import { NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Layout = () => {
  const { user, logout } = useAuth();

  const navItems = [
    { path: '/', label: 'Dashboard', icon: '📊' },
    { path: '/cars', label: 'Cars', icon: '🚗' },
    { path: '/services', label: 'Services', icon: '🔧' },
    { path: '/service-records', label: 'Service Records', icon: '📋' },
    { path: '/payments', label: 'Payments', icon: '💰' },
    { path: '/reports', label: 'Reports', icon: '📈' },
  ];

  return (
    <div className="flex min-h-screen bg-bgPrimary">
      {/* Sidebar */}
      <div className="fixed flex h-screen w-60 flex-col overflow-y-auto border-r border-border bg-bgSecondary">
        {/* Logo */}
        <div className="border-b border-border p-5">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-accent text-2xl">
            🔧
          </div>
          <h1 className="m-0 text-center font-rajdhani text-lg font-bold text-textPrimary">
            CRPMS
          </h1>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-4">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `mx-2 mb-1 flex items-center gap-3 rounded-btn border-l-4 px-5 py-3 font-rajdhani text-sm font-semibold transition-all ${
                  isActive
                    ? 'border-l-accent bg-accent/10 text-accent'
                    : 'border-l-transparent text-textSecondary hover:bg-bgCard/60 hover:text-textPrimary'
                }`
              }
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* User Card */}
        <div className="mt-auto border-t border-border p-4">
          <div className="mb-2 flex items-center gap-3 rounded-btn bg-bgInput p-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent text-sm">
              👤  
            </div>
            <div className="flex-1">
              <div className="font-rajdhani text-sm font-semibold text-textPrimary">
                {user?.username || 'User'}
              </div>
              <div className="text-xs text-textSecondary">
                {user?.role || 'mechanic manager'}
              </div>
            </div>
          </div>

          <button
            onClick={logout}
            className="flex w-full items-center justify-center gap-2 rounded-btn border border-red-500/30 bg-red-500/10 px-3 py-2.5 font-rajdhani text-sm font-semibold text-danger transition-colors hover:bg-red-500/20"
          >
            <span>🚪</span>
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="ml-60 min-h-screen flex-1 p-8">
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;