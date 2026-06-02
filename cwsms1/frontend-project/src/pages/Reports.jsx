import { useEffect, useState } from 'react';
import api from '../services/api';

export default function Reports() {
  const [report, setReport] = useState([]);
  const [period, setPeriod] = useState('daily');

  useEffect(() => {
    api.get('/reports/daily').then((response) => setReport(response.data)).catch(() => {});
  }, []);

  const loadPeriod = async (value) => {
    setPeriod(value);
    const response = await api.get('/reports/summary', { params: { period: value } });
    setReport(response.data);
  };

  return (
    <div className="space-y-6">
      <div className="surface-card p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-semibold">Reports</h2>
            <p className="text-slate-600">Generate daily, weekly, and monthly revenue summaries.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            {['daily', 'weekly', 'monthly'].map((value) => (
              <button
                key={value}
                className={`rounded-3xl px-4 py-2 ${period === value ? 'bg-primary text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
                onClick={() => loadPeriod(value)}>
                {value.charAt(0).toUpperCase() + value.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className="surface-card p-6">
        <h3 className="mb-4 text-xl font-semibold">Revenue Report</h3>
        <div className="space-y-3">
          {report.map((row, index) => (
            <div key={index} className="surface-panel p-4">
              <p className="font-semibold">{row.label}</p>
              <p className="text-slate-600">Transactions: {row.transactions} • Revenue: RWF {Number(row.revenue || 0).toLocaleString()}</p>
            </div>
          ))}
          {!report.length && <p className="text-slate-500">No report data available.</p>}
        </div>
      </div>
    </div>
  );
}
