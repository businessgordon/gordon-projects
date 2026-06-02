import { useEffect, useState } from 'react';
import api from '../services/api';

export default function Payments() {
  const [payments, setPayments] = useState([]);
  const [services, setServices] = useState([]);
  const [search, setSearch] = useState('');
  const [form, setForm] = useState({ record_number: '', amount_paid: '', payment_date: '', payment_method: 'cash', payment_status: 'Paid' });
  const [message, setMessage] = useState(null);

  const loadData = async () => {
    const [paymentsData, servicesData] = await Promise.all([
      api.get('/payments', { params: { search, page: 1, limit: 100 } }),
      api.get('/services', { params: { page: 1, limit: 100 } }),
    ]);
    setPayments(paymentsData.data.rows || []);
    setServices(servicesData.data.rows || []);
  };

  useEffect(() => {
    loadData();
  }, [search]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const handleSubmit = async (e) => {
    e.preventDefault();
    await api.post('/payments', { ...form, amount_paid: Number(form.amount_paid) });
    setMessage('Payment recorded');
    setForm({ record_number: '', amount_paid: '', payment_date: '', payment_method: 'cash', payment_status: 'Paid' });
    loadData();
  };

  return (
    <div className="space-y-6">
      <div className="surface-card p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-semibold">Payments</h2>
            <p className="text-slate-600">Track payments and outstanding balances.</p>
          </div>
          <input
            className="rounded-3xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none focus:border-primary"
            placeholder="Search payments"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>
      {message && <div className="rounded-3xl border border-emerald-500/20 bg-emerald-500/10 p-4 text-emerald-200">{message}</div>}
      <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
        <div className="surface-card p-6">
          <h3 className="mb-4 text-xl font-semibold">Record Payment</h3>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <label className="block">
              <span className="text-slate-600">Service Record</span>
              <select
                className="mt-2 w-full surface-input"
                name="record_number"
                value={form.record_number}
                onChange={handleChange}
                required>
                <option value="">Select Record</option>
                {services.map((item) => (
                  <option key={item.record_number} value={item.record_number}>
                    {item.record_number} • {item.plate_number}
                  </option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="text-slate-600">Amount Paid</span>
              <input
                className="mt-2 w-full surface-input"
                type="number"
                name="amount_paid"
                value={form.amount_paid}
                onChange={handleChange}
                required
              />
            </label>
            <label className="block">
              <span className="text-slate-600">Payment Date</span>
              <input
                className="mt-2 w-full surface-input"
                type="datetime-local"
                name="payment_date"
                value={form.payment_date}
                onChange={handleChange}
                required
              />
            </label>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="text-slate-600">Method</span>
                <select
                  className="mt-2 w-full surface-input"
                  name="payment_method"
                  value={form.payment_method}
                  onChange={handleChange}
                  required>
                  <option value="cash">Cash</option>
                  <option value="mobile money">Mobile Money</option>
                  <option value="card">Card</option>
                </select>
              </label>
              <label className="block">
                <span className="text-slate-600">Status</span>
                <select
                  className="mt-2 w-full surface-input"
                  name="payment_status"
                  value={form.payment_status}
                  onChange={handleChange}
                  required>
                  <option value="Paid">Paid</option>
                  <option value="Partial">Partial</option>
                  <option value="Pending">Pending</option>
                </select>
              </label>
            </div>
            <button className="w-full rounded-3xl bg-accent px-4 py-3 text-slate-900 hover:opacity-95">Submit Payment</button>
          </form>
        </div>
        <div className="surface-card p-6">
          <h3 className="mb-4 text-xl font-semibold">Payment History</h3>
          <div className="space-y-3">
            {payments.map((pay) => (
              <div key={pay.payment_number} className="surface-panel p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold">Record #{pay.record_number}</p>
                    <p className="text-slate-400">{pay.payment_method} • {pay.payment_status}</p>
                  </div>
                  <p className="text-slate-500">RWF {Number(pay.amount_paid || 0).toLocaleString()}</p>
                </div>
                <p className="mt-2 text-sm text-slate-500">{new Date(pay.payment_date).toLocaleString()}</p>
              </div>
            ))}
            {!payments.length && <p className="text-slate-500">No payments recorded.</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
