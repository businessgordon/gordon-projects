import { useEffect, useState } from 'react';
import api from '../services/api';

export default function Reports() {
  const [daily, setDaily] = useState([]);

  useEffect(() => {
    api.get('/api/reports/daily').then((response) => setDaily(response.data));
  }, []);

  const totalAmount = daily.reduce((sum, row) => sum + Number(row.amount_paid || 0), 0);
  const totalRecords = daily.length;
  const totalHours = daily.reduce((sum, row) => sum + Number(row.duration || 0), 0);

  return (
    <div className="space-y-8">
      <div className="grid gap-4 md:grid-cols-3">
        <div className="dashboard-card">
          <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Records</p>
          <p className="mt-4 text-4xl font-semibold text-slate-900">{totalRecords}</p>
          <p className="mt-2 text-sm text-slate-500">Parking transactions processed today.</p>
        </div>
        <div className="dashboard-card">
          <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Revenue</p>
          <p className="mt-4 text-4xl font-semibold text-slate-900">{totalAmount.toLocaleString()}</p>
          <p className="mt-2 text-sm text-slate-500">Total amount collected.</p>
        </div>
        <div className="dashboard-card">
          <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Hours</p>
          <p className="mt-4 text-4xl font-semibold text-slate-900">{totalHours}</p>
          <p className="mt-2 text-sm text-slate-500">Total parking duration today.</p>
        </div>
      </div>

      <div className="table-panel">
        <div className="border-b border-slate-200 px-6 py-5">
          <h2 className="text-2xl font-semibold">Daily Parking Payment Report</h2>
          <p className="mt-2 text-sm text-slate-500">Review completed payments and daily revenue details.</p>
        </div>
        <div className="overflow-x-auto p-6">
          <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
            <thead className="bg-slate-50 text-slate-700">
              <tr>
                <th className="px-4 py-3">Plate</th>
                <th className="px-4 py-3">Entry</th>
                <th className="px-4 py-3">Exit</th>
                <th className="px-4 py-3">Duration</th>
                <th className="px-4 py-3">Amount</th>
                <th className="px-4 py-3">Payment Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white">
              {daily.map((row, index) => (
                <tr key={index} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-4">{row.plate_number}</td>
                  <td className="px-4 py-4">{new Date(row.entry_time).toLocaleString()}</td>
                  <td className="px-4 py-4">{new Date(row.exit_time).toLocaleString()}</td>
                  <td className="px-4 py-4">{row.duration}</td>
                  <td className="px-4 py-4">{row.amount_paid}</td>
                  <td className="px-4 py-4">{new Date(row.payment_date).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
