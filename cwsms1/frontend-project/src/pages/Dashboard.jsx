import { useEffect, useState } from 'react';
import Sidebar from '../components/layout/Sidebar';
import Cars from './Cars';
import Packages from './Packages';
import Services from './Services';
import Payments from './Payments';
import Invoices from './Invoices';
import Reports from './Reports';
import Settings from './Settings';
import api from '../services/api';

const pageMap = {
  dashboard: 'dashboard',
  cars: <Cars />,
  packages: <Packages />,
  services: <Services />,
  payments: <Payments />,
  invoices: <Invoices />,
  reports: <Reports />,
  settings: <Settings />,
};

export default function Dashboard() {
  const [selected, setSelected] = useState('dashboard');
  const [stats, setStats] = useState(null);

  useEffect(() => {
    api.get('/reports/stats').then((response) => setStats(response.data)).catch(() => {});
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Sidebar active={selected} onSelect={setSelected} />
      <main className="ml-0 sm:ml-72 p-6 transition-all duration-300">
        {selected === 'dashboard' ? (
          <section className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              <div className="surface-card p-6">
                <p className="text-sm text-slate-500">Total Cars</p>
                <p className="mt-4 text-4xl font-semibold">{stats?.totalCars ?? '—'}</p>
              </div>
              <div className="surface-card p-6">
                <p className="text-sm text-slate-500">Today's Washes</p>
                <p className="mt-4 text-4xl font-semibold">{stats?.todayWashes ?? '—'}</p>
              </div>
              <div className="surface-card p-6">
                <p className="text-sm text-slate-500">Total Revenue</p>
                <p className="mt-4 text-4xl font-semibold">RWF {Number(stats?.totalRevenue || 0).toLocaleString()}</p>
              </div>
            </div>
            <div className="grid gap-6 lg:grid-cols-2">
              <div className="surface-card p-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold">Service Statistics</h2>
                  <span className="rounded-full bg-primary/10 px-3 py-1 text-sm text-primary">Live</span>
                </div>
                <div className="mt-8 grid gap-4 sm:grid-cols-2">
                  <div className="surface-panel p-4">
                    <p className="text-sm text-slate-500">Pending Payments</p>
                    <p className="mt-2 text-3xl font-semibold">{stats?.pendingPayments ?? '—'}</p>
                  </div>
                  <div className="surface-panel p-4">
                    <p className="text-sm text-slate-500">Completed Washes</p>
                    <p className="mt-2 text-3xl font-semibold">{stats?.completedWashes ?? '—'}</p>
                  </div>
                </div>
              </div>
              <div className="surface-card p-6">
                <h2 className="text-xl font-semibold">Top Packages Sold</h2>
                <div className="mt-6 space-y-3">
                  {stats?.topPackages?.map((item) => (
                    <div key={item.package_name} className="flex items-center justify-between surface-panel p-4">
                      <span>{item.package_name}</span>
                      <span className="text-slate-600">{item.sold}</span>
                    </div>
                  ))}
                  {!stats?.topPackages?.length && <p className="text-slate-500">No data yet.</p>}
                </div>
              </div>
            </div>
          </section>
        ) : (
          pageMap[selected]
        )}
      </main>
    </div>
  );
}
