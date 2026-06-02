import React, { useEffect, useState } from 'react';
import {
  getServiceRecords, createServiceRecord,
  updateServiceRecord, deleteServiceRecord,
  getCars, getServices
} from '../services/api';

const emptyForm = { serviceDate: '', plateNumber: '', serviceCode: '' };

export default function ServiceRecords() {
  const [records, setRecords] = useState([]);
  const [cars, setCars] = useState([]);
  const [services, setServices] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');

  const fetchAll = () => {
    getServiceRecords().then(r => setRecords(r.data)).catch(() => {});
  };

  useEffect(() => {
    fetchAll();
    getCars().then(r => setCars(r.data)).catch(() => {});
    getServices().then(r => setServices(r.data)).catch(() => {});
  }, []);

  const openAdd = () => {
    setForm({ ...emptyForm, serviceDate: new Date().toISOString().split('T')[0] });
    setEditId(null); setError(''); setShowModal(true);
  };

  const openEdit = (rec) => {
    setForm({
      serviceDate: rec.ServiceDate ? rec.ServiceDate.split('T')[0] : '',
      plateNumber: rec.PlateNumber,
      serviceCode: rec.ServiceCode
    });
    setEditId(rec.RecordNumber); setError(''); setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); setError(''); setLoading(true);
    try {
      if (editId) {
        await updateServiceRecord(editId, form);
        setSuccess('Record updated successfully.');
      } else {
        await createServiceRecord(form);
        setSuccess('Service record created successfully.');
      }
      setShowModal(false); fetchAll();
    } catch (err) {
      setError(err.response?.data?.message || 'Operation failed.');
    } finally { setLoading(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Permanently delete Record #' + id + '?')) return;
    try {
      await deleteServiceRecord(id);
      setSuccess('Record #' + id + ' deleted.'); fetchAll();
    } catch { setError('Cannot delete record.'); }
  };

  const filtered = records.filter(r =>
    (r.PlateNumber || '').toLowerCase().includes(search.toLowerCase()) ||
    (r.ServiceName || '').toLowerCase().includes(search.toLowerCase()) ||
    (r.Model || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="page-header">
        <div>
          <h2>📋 Service Records</h2>
          <p>Track all repair jobs — create, update, and delete records</p>
        </div>
        <button className="btn btn-primary" onClick={openAdd}>+ New Record</button>
      </div>

      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <div className="mb-4">
        <input
          className="w-full max-w-xs rounded-btn border border-border bg-bgCard px-3.5 py-2.5 text-sm text-textPrimary outline-none transition-colors focus:border-accent"
          placeholder="Search by plate, model or service..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      <div className="card overflow-hidden p-0">
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>#</th><th>Date</th><th>Plate</th><th>Car Model</th>
                <th>Service</th><th>Price (RWF)</th><th>Mechanic</th><th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-10 text-center text-textSecondary">
                    No service records found.
                  </td>
                </tr>
              ) : filtered.map(rec => (
                <tr key={rec.RecordNumber}>
                  <td><span className="badge badge-warning">#{rec.RecordNumber}</span></td>
                  <td className="text-xs text-textSecondary">
                    {new Date(rec.ServiceDate).toLocaleDateString('en-RW')}
                  </td>
                  <td><span className="badge badge-info">{rec.PlateNumber}</span></td>
                  <td className="font-semibold">{rec.Model} <span className="font-normal text-textSecondary">({rec.Type})</span></td>
                  <td>{rec.ServiceName}</td>
                  <td className="font-rajdhani font-bold text-success">
                    {Number(rec.ServicePrice).toLocaleString()}
                  </td>
                  <td className="text-xs">{rec.MechanicName}</td>
                  <td>
                    <div className="flex gap-1.5">
                      <button className="btn btn-secondary btn-sm" onClick={() => openEdit(rec)}>Edit</button>
                      <button className="btn btn-danger btn-sm" onClick={() => handleDelete(rec.RecordNumber)}>Del</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="border-t border-border px-4 py-3 text-sm text-textSecondary">
          Showing {filtered.length} of {records.length} records
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setShowModal(false)}>
          <div className="modal">
            <div className="modal-header">
              <h3>{editId ? 'Edit Record #' + editId : 'New Service Record'}</h3>
              <button className="modal-close" onClick={() => setShowModal(false)}>x</button>
            </div>
            {error && <div className="alert alert-error">{error}</div>}
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Service Date</label>
                <input type="date" value={form.serviceDate}
                  onChange={e => setForm({ ...form, serviceDate: e.target.value })} required />
              </div>
              <div className="form-group">
                <label>Car (Plate Number)</label>
                <select value={form.plateNumber}
                  onChange={e => setForm({ ...form, plateNumber: e.target.value })} required>
                  <option value="">-- Select a car --</option>
                  {cars.map(c => (
                    <option key={c.PlateNumber} value={c.PlateNumber}>
                      {c.PlateNumber} — {c.Model} ({c.Type})
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Service</label>
                <select value={form.serviceCode}
                  onChange={e => setForm({ ...form, serviceCode: e.target.value })} required>
                  <option value="">-- Select a service --</option>
                  {services.map(s => (
                    <option key={s.ServiceCode} value={s.ServiceCode}>
                      {s.ServiceName} — {Number(s.ServicePrice).toLocaleString()} RWF
                    </option>
                  ))}
                </select>
              </div>
              {form.serviceCode && (() => {
                const svc = services.find(s => s.ServiceCode === form.serviceCode);
                return svc ? (
                  <div className="px-3.5 py-3.5 bg-green-950 border border-green-800 rounded-btn text-sm text-success mb-4">
                    Service Price: {Number(svc.ServicePrice).toLocaleString()} RWF
                  </div>
                ) : null;
              })()}
              <div className="flex gap-3 mt-2">
                <button type="submit" className="btn btn-primary" disabled={loading}>
                  {loading ? 'Saving...' : editId ? 'Update Record' : 'Create Record'}
                </button>
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
