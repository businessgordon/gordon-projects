import React, { useEffect, useState } from 'react';
import { getPayments, createPayment, getServiceRecords } from '../services/api';

const emptyForm = { recordNumber: '', amountPaid: '', paymentDate: '' };

export default function Payments() {
  const [payments, setPayments] = useState([]);
  const [records, setRecords] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchAll = () => {
    getPayments().then(r => setPayments(r.data)).catch(() => {});
  };

  useEffect(() => {
    fetchAll();
    getServiceRecords().then(r => setRecords(r.data)).catch(() => {});
  }, []);

  const openAdd = () => {
    setForm({ ...emptyForm, paymentDate: new Date().toISOString().split('T')[0] });
    setError(''); setShowModal(true);
  };

  const handleRecordSelect = (recordId) => {
    const rec = records.find(r => String(r.RecordNumber) === String(recordId));
    setForm(f => ({
      ...f,
      recordNumber: recordId,
      amountPaid: rec ? rec.ServicePrice : ''
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); setError(''); setLoading(true);
    try {
      await createPayment(form);
      setSuccess('Payment recorded successfully.');
      setShowModal(false); fetchAll();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to record payment.');
    } finally { setLoading(false); }
  };

  const totalRevenue = payments.reduce((s, p) => s + Number(p.AmountPaid), 0);

  return (
    <div>
      <div className="page-header">
        <div>
          <h2>💳 Payments</h2>
          <p>Record and track payments for completed repairs</p>
        </div>
        <button className="btn btn-primary" onClick={openAdd}>+ Record Payment</button>
      </div>

      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="stat-card">
          <div className="stat-icon">💳</div>
          <div className="stat-value text-accent2">{payments.length}</div>
          <div className="stat-label">Total Payments</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">💰</div>
          <div className="stat-value text-[22px] text-success">
            {totalRevenue.toLocaleString()}
          </div>
          <div className="stat-label">Total Revenue (RWF)</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">📅</div>
          <div className="stat-value text-[22px] text-warning">
            {payments.filter(p => new Date(p.PaymentDate).toDateString() === new Date().toDateString()).length}
          </div>
          <div className="stat-label">Payments Today</div>
        </div>
      </div>

      <div className="card overflow-hidden p-0">
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Payment #</th><th>Date</th><th>Plate</th><th>Car</th>
                <th>Service</th><th>Amount Paid (RWF)</th><th>Received By</th>
              </tr>
            </thead>
            <tbody>
              {payments.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-10 text-center text-textSecondary">
                    No payments recorded yet.
                  </td>
                </tr>
              ) : payments.map(p => (
                <tr key={p.PaymentNumber}>
                  <td><span className="badge badge-success">#{p.PaymentNumber}</span></td>
                  <td className="text-xs text-textSecondary">
                    {new Date(p.PaymentDate).toLocaleDateString('en-RW')}
                  </td>
                  <td><span className="badge badge-info">{p.PlateNumber}</span></td>
                  <td className="font-semibold">{p.Model}</td>
                  <td>{p.ServiceName}</td>
                  <td className="font-rajdhani text-lg font-bold text-success">
                    {Number(p.AmountPaid).toLocaleString()}
                  </td>
                  <td className="text-xs">{p.ReceivedBy || '—'}</td>
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
              <h3>💳 Record Payment</h3>
              <button className="modal-close" onClick={() => setShowModal(false)}>x</button>
            </div>
            {error && <div className="alert alert-error">{error}</div>}
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Service Record</label>
                <select value={form.recordNumber}
                  onChange={e => handleRecordSelect(e.target.value)} required>
                  <option value="">-- Select a service record --</option>
                  {records.map(r => (
                    <option key={r.RecordNumber} value={r.RecordNumber}>
                      #{r.RecordNumber} | {r.PlateNumber} — {r.ServiceName} ({Number(r.ServicePrice).toLocaleString()} RWF)
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Amount Paid (RWF)</label>
                <input type="number" value={form.amountPaid}
                  onChange={e => setForm({ ...form, amountPaid: e.target.value })}
                  placeholder="Amount in RWF" min="0" required />
              </div>
              <div className="form-group">
                <label>Payment Date</label>
                <input type="date" value={form.paymentDate}
                  onChange={e => setForm({ ...form, paymentDate: e.target.value })} required />
              </div>
              {form.recordNumber && (() => {
                const rec = records.find(r => String(r.RecordNumber) === String(form.recordNumber));
                return rec ? (
                  <div className="mb-4 rounded-btn border border-border bg-bgInput px-3.5 py-3.5 text-xs leading-relaxed text-textSecondary">
                    <strong className="text-textPrimary">Car:</strong> {rec.Model} ({rec.Type})<br />
                    <strong className="text-textPrimary">Driver:</strong> {rec.DriverPhone}<br />
                    <strong className="text-textPrimary">Service:</strong> {rec.ServiceName}<br />
                    <strong className="text-textPrimary">Standard Price:</strong>{' '}
                    <span className="text-success">{Number(rec.ServicePrice).toLocaleString()} RWF</span>
                  </div>
                ) : null;
              })()}
              <div className="mt-2 flex gap-3">
                <button type="submit" className="btn btn-primary" disabled={loading}>
                  {loading ? 'Saving...' : 'Record Payment'}
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
