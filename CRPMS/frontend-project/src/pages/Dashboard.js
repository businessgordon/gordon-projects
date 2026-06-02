import React, { useEffect, useState } from 'react';
import { getCars, getServices, getServiceRecords, getPayments } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({ cars: 0, services: 0, records: 0, payments: 0, revenue: 0 });

  useEffect(() => {
    Promise.all([getCars(), getServices(), getServiceRecords(), getPayments()])
      .then(([cars, services, records, payments]) => {
        const revenue = payments.data.reduce((s, p) => s + Number(p.AmountPaid), 0);
        setStats({
          cars: cars.data.length,
          services: services.data.length,
          records: records.data.length,
          payments: payments.data.length,
          revenue
        });
      })
      .catch(() => {});
  }, []);

  const today = new Date().toLocaleDateString('en-RW', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h2 className="m-0 font-rajdhani text-4xl font-bold tracking-wide text-textPrimary">
          Welcome back, {user?.FullName?.split(' ')[0]} 👋
        </h2>
        <p className="mt-1 text-textSecondary">{today} · SmartPark Garage, kayonza District</p>
      </div>

      {/* Stats Grid */}
      <div className="mb-8 grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-4">
        {[
          { icon: '🚗', label: 'Total Cars', value: stats.cars, colorClass: 'text-accent2' },
          { icon: '🔧', label: 'Services', value: stats.services, colorClass: 'text-accent' },
          { icon: '📋', label: 'Service Records', value: stats.records, colorClass: 'text-warning' },
          { icon: '💳', label: 'Payments', value: stats.payments, colorClass: 'text-success' },
          { icon: '💰', label: 'Total Revenue', value: `${stats.revenue.toLocaleString()} RWF`, colorClass: 'text-accent', wide: true },
        ].map((s, i) => (
          <div key={i} className={`stat-card ${s.wide ? 'sm:col-span-2' : ''}`}>
            <div className="stat-icon">{s.icon}</div>
            <div className={`stat-value ${s.colorClass}`}>{s.value}</div>
            <div className="stat-label">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Quick info */}
      <div className="card">
        <h3 className="mb-4 font-rajdhani text-lg font-bold text-textPrimary">🏠 About SmartPark</h3>
        <p className="text-sm leading-7 text-textSecondary">
          SmartPark is a car repair garage located in <strong className="text-textPrimary">kayonza District, Eastern Province, Rwanda</strong>.
          This Car Repair Payment Management System (CRPMS) digitizes the entire repair workflow —
          from recording incoming cars and assigning services, to tracking payments and generating bills.
          Use the sidebar to navigate between Cars, Services, Service Records, Payments, and Reports.
        </p>
      </div>
    </div>
  );
}
