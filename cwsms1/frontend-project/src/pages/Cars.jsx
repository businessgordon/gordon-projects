import { useEffect, useState } from 'react';
import api from '../services/api';

export default function Cars() {
  const [cars, setCars] = useState([]);
  const [search, setSearch] = useState('');
  const [form, setForm] = useState({ plate_number: '', car_type: '', car_size: '', driver_name: '', phone_number: '' });
  const [message, setMessage] = useState(null);
  const [editingPlate, setEditingPlate] = useState(null);

  const loadCars = async () => {
    const response = await api.get('/cars', { params: { search, page: 1, limit: 100 } });
    setCars(response.data.rows || []);
  };

  useEffect(() => {
    loadCars();
  }, [search]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingPlate) {
      await api.put(`/cars/${editingPlate}`, form);
      setMessage('Car updated successfully');
      setEditingPlate(null);
    } else {
      await api.post('/cars', form);
      setMessage('Car created successfully');
    }
    setForm({ plate_number: '', car_type: '', car_size: '', driver_name: '', phone_number: '' });
    loadCars();
  };

  const startEdit = (car) => {
    setEditingPlate(car.plate_number);
    setForm({ plate_number: car.plate_number, car_type: car.car_type || '', car_size: car.car_size || '', driver_name: car.driver_name || '', phone_number: car.phone_number || '' });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const removeCar = async (plate) => {
    await api.delete(`/cars/${plate}`);
    loadCars();
  };

  const cancelEdit = () => {
    setEditingPlate(null);
    setForm({ plate_number: '', car_type: '', car_size: '', driver_name: '', phone_number: '' });
  };

  return (
    <div className="space-y-6">
      <div className="surface-card p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-semibold">Cars</h2>
            <p className="text-slate-600">Create, view, and manage car records.</p>
          </div>
          <input
            className="rounded-3xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none focus:border-primary"
            placeholder="Search cars"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>
      {message && <div className="rounded-3xl border border-emerald-500/20 bg-emerald-500/10 p-4 text-emerald-200">{message}</div>}
      <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
        <div className="surface-card p-6">
          <h3 className="mb-4 text-xl font-semibold">Add New Car</h3>
          <form className="space-y-4" onSubmit={handleSubmit}>
            {['plate_number','driver_name','phone_number'].map((field) => (
              <label key={field} className="block">
                <span className="text-slate-300">{field.replace('_', ' ').toUpperCase()}</span>
                <input
                  className="mt-2 w-full surface-input"
                  name={field}
                  value={form[field]}
                  onChange={handleChange}
                  required
                />
              </label>
            ))}
            <label className="block">
              <span className="text-slate-600">Car Type</span>
              <input
                className="mt-2 w-full surface-input"
                name="car_type"
                value={form.car_type}
                onChange={handleChange}
              />
            </label>
            <label className="block">
              <span className="text-slate-600">Car Size</span>
              <input
                className="mt-2 w-full surface-input"
                name="car_size"
                value={form.car_size}
                onChange={handleChange}
              />
            </label>
            <div className="flex gap-3">
              <button className="flex-1 rounded-3xl bg-accent px-4 py-3 text-slate-900 hover:opacity-95">{editingPlate ? 'Update' : 'Save'}</button>
              {editingPlate && (
                <button type="button" onClick={cancelEdit} className="rounded-3xl px-4 py-3 border border-slate-700">Cancel</button>
              )}
            </div>
          </form>
        </div>
        <div className="surface-card p-6">
          <h3 className="mb-4 text-xl font-semibold">Car List</h3>
          <div className="space-y-3">
            {cars.map((car) => (
              <div key={car.plate_number} className="surface-panel p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="font-semibold">{car.plate_number}</p>
                    <p className="text-sm text-slate-400">{car.driver_name} • {car.phone_number}</p>
                    <p className="text-sm text-slate-400">{car.car_type} • {car.car_size}</p>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => startEdit(car)} className="rounded-3xl bg-primary px-4 py-2 text-white">Edit</button>
                    <button onClick={() => removeCar(car.plate_number)} className="rounded-3xl bg-rose-600 px-4 py-2 text-white">Delete</button>
                  </div>
                </div>
              </div>
            ))}
            {!cars.length && <p className="text-slate-500">No cars found.</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
