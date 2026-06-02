import { useEffect, useState } from 'react';
import api from '../services/api';

export default function Services() {
  const [services, setServices] = useState([]);
  const [cars, setCars] = useState([]);
  const [packages, setPackages] = useState([]);
  const [search, setSearch] = useState('');
  const [form, setForm] = useState({ plate_number: '', package_number: '', service_date: '', status: 'Pending' });
  const [message, setMessage] = useState(null);
  const [editingId, setEditingId] = useState(null);

  const loadData = async () => {
    const [servicesData, carsData, packagesData] = await Promise.all([
      api.get('/services', { params: { search, page: 1, limit: 100 } }),
      api.get('/cars', { params: { page: 1, limit: 100 } }),
      api.get('/packages'),
    ]);
    setServices(servicesData.data.rows || []);
    setCars(carsData.data.rows || []);
    setPackages(packagesData.data || []);
  };

  useEffect(() => {
    loadData();
  }, [search]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingId) {
      await api.put(`/services/${editingId}`, form);
      setMessage('Service record updated');
      setEditingId(null);
    } else {
      await api.post('/services', form);
      setMessage('Service record created');
    }
    setForm({ plate_number: '', package_number: '', service_date: '', status: 'Pending' });
    loadData();
  };

  const startEdit = (item) => {
    setEditingId(item.record_number);
    setForm({ plate_number: item.plate_number, package_number: item.package_number, service_date: item.service_date?.slice(0,16) || '', status: item.status || 'Pending' });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const removeService = async (id) => {
    await api.delete(`/services/${id}`);
    loadData();
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm({ plate_number: '', package_number: '', service_date: '', status: 'Pending' });
  };

  const formatCurrency = (v) => `RWF ${Number(v || 0).toLocaleString()}`;

  return (
    <div className="space-y-6">
      <div className="surface-card p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-semibold">Service Packages</h2>
            <p className="text-slate-600">Record service requests and monitor status.</p>
          </div>
          <input
            className="rounded-3xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none focus:border-primary"
            placeholder="Search services"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>
      {message && <div className="rounded-3xl border border-emerald-500/20 bg-emerald-500/10 p-4 text-emerald-200">{message}</div>}
      <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
        <div className="surface-card p-6">
          <h3 className="mb-4 text-xl font-semibold">Create Service Record</h3>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <label className="block">
              <span className="text-slate-600">Car</span>
              <select
                className="mt-2 w-full surface-input"
                name="plate_number"
                value={form.plate_number}
                onChange={handleChange}
                required>
                <option value="">Select Car</option>
                {cars.map((car) => (
                  <option key={car.plate_number} value={car.plate_number}>{car.plate_number} - {car.driver_name}</option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="text-slate-600">Package</span>
              <select
                className="mt-2 w-full surface-input"
                name="package_number"
                value={form.package_number}
                onChange={handleChange}
                required>
                <option value="">Select Package</option>
                {packages.map((pkg) => (
                  <option key={pkg.package_number} value={pkg.package_number}>{pkg.package_name} - {formatCurrency(pkg.package_price)}</option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="text-slate-600">Service Date</span>
              <input
                className="mt-2 w-full surface-input"
                type="datetime-local"
                name="service_date"
                value={form.service_date}
                onChange={handleChange}
                required
              />
            </label>
            <div className="flex gap-3">
              <button className="flex-1 rounded-3xl bg-accent px-4 py-3 text-slate-900 hover:opacity-95">{editingId ? 'Update Record' : 'Create Record'}</button>
              {editingId && (
                <button type="button" onClick={cancelEdit} className="rounded-3xl px-4 py-3 border border-slate-700">Cancel</button>
              )}
            </div>
          </form>
        </div>
        <div className="surface-card p-6">
          <h3 className="mb-4 text-xl font-semibold">Service Record List</h3>
          <div className="space-y-3">
            {services.map((item) => (
              <div key={item.record_number} className="surface-panel p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="font-semibold">{item.plate_number}</p>
                    <p className="text-slate-400">{item.package_name} • {item.status}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <p className="text-sm text-slate-500">{new Date(item.service_date).toLocaleString()}</p>
                    <button onClick={() => startEdit(item)} className="rounded-3xl bg-primary px-3 py-1 text-white">Edit</button>
                    <button onClick={() => removeService(item.record_number)} className="rounded-3xl bg-rose-600 px-3 py-1 text-white">Delete</button>
                  </div>
                </div>
              </div>
            ))}
            {!services.length && <p className="text-slate-500">No service records yet.</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
