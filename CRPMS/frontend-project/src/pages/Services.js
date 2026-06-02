import React, { useEffect, useState } from 'react';
import { getServices, createService, updateService, deleteService } from '../services/api';

const emptyForm = { serviceCode: '', serviceName: '', servicePrice: '' };

export default function Services() {
  const [services, setServices] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editCode, setEditCode] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchServices = () => getServices().then(r => setServices(r.data)).catch(() => {});
  useEffect(() => { fetchServices(); }, []);

  const openAdd = () => { setForm(emptyForm); setEditCode(null); setError(''); setShowModal(true); };
  const openEdit = (s) => {
    setForm({ serviceCode: s.ServiceCode, serviceName: s.ServiceName, servicePrice: s.ServicePrice });
    setEditCode(s.ServiceCode); setError(''); setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); setError(''); setLoading(true);
    try {
      if (editCode) {
        await updateService(editCode, { serviceName: form.serviceName, servicePrice: form.servicePrice });
        setSuccess('Service updated.');
      } else {
        await createService(form);
        setSuccess('Service added.');
      }
      setShowModal(false); fetchServices();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed.');
    } finally { setLoading(false); }
  };

  const handleDelete = async (code) => {
    if (!window.confirm('Delete this service?')) return;
    try { await deleteService(code); setSuccess('Deleted.'); fetchServices(); }
    catch { setError('Cannot delete service.'); }
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h2>🔧 Services</h2>
          <p>Manage repair services and their prices</p>
        </div>
        <button className="btn btn-primary" onClick={openAdd}>+ Add Service</button>
      </div>

      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <div className="card overflow-hidden p-0">
        <div className="table-wrap">
          <table>
            <thead>
              <tr><th>Service Code</th><th>Service Name</th><th>Price (RWF)</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {services.length === 0 ? (
                <tr><td colSpan={4} className="p-10 text-center text-textSecondary">No services found.</td></tr>
              ) : services.map(s => (
                <tr key={s.ServiceCode}>
                  <td><span className="badge badge-info">{s.ServiceCode}</span></td>
                  <td className="font-semibold">{s.ServiceName}</td>
                  <td>
                    <span className="font-rajdhani text-lg font-bold text-success">
                      {Number(s.ServicePrice).toLocaleString()} RWF
                    </span>
                  </td>
                  <td className="flex gap-2">
                    <button className="btn btn-secondary btn-sm" onClick={() => openEdit(s)}>✏️ Edit</button>
                    <button className="btn btn-danger btn-sm" onClick={() => handleDelete(s.ServiceCode)}>🗑️ Del</button>
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
              <h3>{editCode ? '✏️ Edit Service' : '🔧 Add Service'}</h3>
              <button className="modal-close" onClick={() => setShowModal(false)}>×</button>
            </div>
            {error && <div className="alert alert-error">{error}</div>}
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Service Code</label>
                <input value={form.serviceCode} onChange={e => setForm({ ...form, serviceCode: e.target.value })}
                  placeholder="e.g. SRV007" required disabled={!!editCode} />
              </div>
              <div className="form-group">
                <label>Service Name</label>
                <input value={form.serviceName} onChange={e => setForm({ ...form, serviceName: e.target.value })}
                  placeholder="e.g. Brake Repair" required />
              </div>
              <div className="form-group">
                <label>Price (RWF)</label>
                <input type="number" value={form.servicePrice} onChange={e => setForm({ ...form, servicePrice: e.target.value })}
                  placeholder="e.g. 50000" min="0" required />
              </div>
              <div className="flex gap-3 mt-2">
                <button type="submit" className="btn btn-primary" disabled={loading}>{loading ? 'Saving...' : editCode ? 'Update' : 'Add Service'}</button>
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
