import { NavLink } from 'react-router-dom';

const links = [
  { to: '/employees', label: 'Employee' },
  { to: '/departments', label: 'Department' },
  { to: '/salaries', label: 'Salary' },
  { to: '/reports', label: 'Reports' },
];

function NavBar({ onLogout }) {
  return (
    <header className="sticky top-0 z-20 border-b border-white/10 bg-slate-950/85 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-4 sm:px-6">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-600 text-lg font-bold text-white shadow-lg shadow-cyan-500/20">SP</div>
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-cyan-200">SmartPark</p>
            <h2 className="text-xl font-semibold text-white">EPMS</h2>
          </div>
        </div>
        <nav className="flex flex-wrap items-center gap-2 text-sm font-semibold text-slate-200">
          {links.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `rounded-full px-4 py-2 transition ${isActive ? 'bg-cyan-400 text-slate-950 shadow-lg shadow-cyan-400/20' : 'hover:bg-white/8 hover:text-white'}`
              }
            >
              {item.label}
            </NavLink>
          ))}
          <button
            type="button"
            onClick={onLogout}
            className="rounded-full bg-rose-500/90 px-4 py-2 text-white transition hover:bg-rose-400"
          >
            Logout
          </button>
        </nav>
      </div>
    </header>
  );
}

export default NavBar;
