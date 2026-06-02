import React, { useEffect, useState } from 'react';
import { getCars, createCar, updateCar, deleteCar } from '../services/api';

const emptyForm = { plateNumber: '', type: '', model: '', manufacturingYear: '', driverPhone: '', mechanicName: '' };

export default function Cars() {
  const [cars, setCars] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editPlate, setEditPlate] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchCars = () => getCars().then(r => setCars(r.data)).catch(() => {});
  useEffect(() => { fetchCars(); }, []);

  const openAdd = () => { setForm(emptyForm); setEditPlate(null); setError(''); setShowModal(true); };
  const openEdit = (car) => {
    setForm({ plateNumber: car.PlateNumber, type: car.Type, model: car.Model,
      manufacturingYear: car.ManufacturingYear, driverPhone: car.DriverPhone, mechanicName: car.MechanicName });
    setEditPlate(car.PlateNumber);
    setError('');
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setSuccess(''); setLoading(true);
    try {
      if (editPlate) {
        await updateCar(editPlate, form);
        setSuccess('Car updated successfully.');
      } else {
        await createCar(form);
        setSuccess('Car registered successfully.');
      }
      setShowModal(false);
      fetchCars();
    } catch (err) {
      setError(err.response?.data?.message || 'Operation failed.');
    } finally { setLoading(false); }
  };

  const handleDelete = async (plate) => {
    if (!window.confirm(`Delete car ${plate}? This will remove all associated records.`)) return;
    try {
      await deleteCar(plate);
      setSuccess('Car deleted.'); fetchCars();
    } catch { setError('Cannot delete car.'); }
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h2>🚗 Cars</h2>
          <p>Register and manage vehicles brought to the garage</p>
        </div>
        <button className="btn btn-primary" onClick={openAdd}>+ Register Car</button>
      </div>

      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <div className="card overflow-hidden p-0">
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Plate Number</th><th>Type</th><th>Model</th>
                <th>Year</th><th>Driver Phone</th><th>Mechanic</th><th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {cars.length === 0 ? (
                <tr><td colSpan={7} className="p-10 text-center text-textSecondary">No cars registered yet.</td></tr>
              ) : cars.map(car => (
                <tr key={car.PlateNumber}>
                  <td><span className="badge badge-info">{car.PlateNumber}</span></td>
                  <td>{car.Type}</td>
                  <td className="font-semibold">{car.Model}</td>
                  <td>{car.ManufacturingYear}</td>
                  <td>{car.DriverPhone}</td>
                  <td>{car.MechanicName}</td>
                  <td className="flex gap-2">
                    <button className="btn btn-secondary btn-sm" onClick={() => openEdit(car)}>✏️ Edit</button>
                    <button className="btn btn-danger btn-sm" onClick={() => handleDelete(car.PlateNumber)}>🗑️ Del</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setShowModal(false)}>
          <div className="modal">
            <div className="modal-header">
              <h3>{editPlate ? '✏️ Edit Car' : '🚗 Register New Car'}</h3>
              <button className="modal-close" onClick={() => setShowModal(false)}>×</button>
            </div>
            {error && <div className="alert alert-error">{error}</div>}
            <form onSubmit={handleSubmit}>
              <div className="grid-2">
                <div className="form-group">
                  <label>Plate Number</label>
                  <input value={form.plateNumber} onChange={e => setForm({ ...form, plateNumber: e.target.value })}
                    placeholder="e.g. RAB 123A" required disabled={!!editPlate} />
                </div>
                <div className="form-group">
                  <label>Type</label>
                  <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })} required>
                    <option value="">Select type</option>
                    {['Sedan','SUV','Truck','Van','Bus','Motorcycle','Other'].map(t => <option key={t}>{t}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label>Model</label>
                  <input value={form.model} onChange={e => setForm({ ...form, model: e.target.value })} placeholder="e.g. Toyota Corolla" required />
                </div>
                <div className="form-group">
                  <label>Manufacturing Year</label>
                  <input type="number" value={form.manufacturingYear} onChange={e => setForm({ ...form, manufacturingYear: e.target.value })}
                    placeholder="e.g. 2018" min="1950" max="2025" required />
                </div>
                <div className="form-group">
                  <label>Driver Phone</label>
                  <input value={form.driverPhone} onChange={e => setForm({ ...form, driverPhone: e.target.value })} placeholder="07XXXXXXXX" required />
                </div>
                <div className="form-group">
                  <label>Mechanic Name</label>
                  <input value={form.mechanicName} onChange={e => setForm({ ...form, mechanicName: e.target.value })} placeholder="Assigned mechanic" required />
                </div>
              </div>
              <div className="flex gap-3 mt-2">
                <button type="submit" className="btn btn-primary" disabled={loading}>{loading ? 'Saving...' : editPlate ? 'Update Car' : 'Register Car'}</button>
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
