import { useEffect, useState } from 'react';
import api from '../services/api';

export default function Packages() {
  const [packages, setPackages] = useState([]);
  const [search, setSearch] = useState('');
  const [form, setForm] = useState({ package_name: '', package_description: '', package_price: '' });
  const [message, setMessage] = useState(null);
  const [editingId, setEditingId] = useState(null);

  const loadPackages = async () => {
    const response = await api.get('/packages', { params: { search } });
    setPackages(response.data);
  };

  useEffect(() => {
    loadPackages();
  }, [search]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingId) {
      await api.put(`/packages/${editingId}`, { ...form, package_price: Number(form.package_price) });
      setMessage('Package updated');
      setEditingId(null);
    } else {
      await api.post('/packages', { ...form, package_price: Number(form.package_price) });
      setMessage('Package added');
    }
    setForm({ package_name: '', package_description: '', package_price: '' });
    loadPackages();
  };

  const removePackage = async (id) => {
    await api.delete(`/packages/${id}`);
    loadPackages();
  };

  const startEdit = (pkg) => {
    setEditingId(pkg.package_number);
    setForm({ package_name: pkg.package_name, package_description: pkg.package_description, package_price: String(pkg.package_price) });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm({ package_name: '', package_description: '', package_price: '' });
  };

  const formatCurrency = (v) => `RWF ${Number(v || 0).toLocaleString()}`;

  return (
    <div className="space-y-6">
      <div className="surface-card p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-semibold">Packages</h2>
            <p className="text-slate-600">Manage wash packages and pricing.</p>
          </div>
          <input
            className="rounded-3xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none focus:border-primary"
            placeholder="Search packages"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>
      {message && <div className="rounded-3xl border border-emerald-500/20 bg-emerald-500/10 p-4 text-emerald-200">{message}</div>}
      <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
        <div className="surface-card p-6">
          <h3 className="mb-4 text-xl font-semibold">Add Package</h3>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <label className="block">
              <span className="text-slate-300">Name</span>
              <input
                className="mt-2 w-full surface-input"
                name="package_name"
                value={form.package_name}
                onChange={handleChange}
                required
              />
            </label>
            <label className="block">
              <span className="text-slate-300">Description</span>
              <textarea
                className="mt-2 w-full surface-input"
                name="package_description"
                value={form.package_description}
                onChange={handleChange}
              />
            </label>
            <label className="block">
              <span className="text-slate-300">Price</span>
              <input
                className="mt-2 w-full surface-input"
                name="package_price"
                type="number"
                value={form.package_price}
                onChange={handleChange}
                required
              />
            </label>
            <div className="flex gap-3">
              <button className="flex-1 rounded-3xl bg-accent px-4 py-3 text-slate-900 hover:opacity-95">{editingId ? 'Update Package' : 'Save Package'}</button>
              {editingId && (
                <button type="button" onClick={cancelEdit} className="rounded-3xl px-4 py-3 border border-slate-700">Cancel</button>
              )}
            </div>
          </form>
        </div>
        <div className="surface-card p-6">
          <h3 className="mb-4 text-xl font-semibold">Package Catalog</h3>
          <div className="space-y-3">
            {packages.map((pkg) => (
              <div key={pkg.package_number} className="surface-panel p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="font-semibold">{pkg.package_name}</p>
                    <p className="text-slate-400">{formatCurrency(pkg.package_price)}</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      className="rounded-3xl bg-primary px-4 py-2 text-white hover:opacity-90"
                      onClick={() => startEdit(pkg)}>
                      Edit
                    </button>
                    <button
                      className="rounded-3xl bg-rose-600 px-4 py-2 text-white hover:bg-rose-500"
                      onClick={() => removePackage(pkg.package_number)}>
                      Delete
                    </button>
                  </div>
                </div>
                <p className="mt-2 text-slate-400">{pkg.package_description}</p>
              </div>
            ))}
            {!packages.length && <p className="text-slate-500">No packages yet.</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
