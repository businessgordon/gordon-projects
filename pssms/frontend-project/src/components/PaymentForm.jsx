import { useEffect, useState } from 'react';
import api from '../services/api';

const RATE_PER_HOUR = 500;

export default function PaymentForm() {
  const [records, setRecords] = useState([]);
  const [iRecordId, setIRecordId] = useState('');
  const [amount, setAmount] = useState('');
  const [paymentDate, setPaymentDate] = useState('');
  const [message, setMessage] = useState('');

  const fetchRecords = async () => {
    const response = await api.get('/api/records');
    setRecords(response.data);
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  useEffect(() => {
    if (!iRecordId) {
      setAmount('');
      return;
    }
    const selected = records.find((r) => r.record_id === parseInt(iRecordId, 10));
    if (selected) {
      setAmount(selected.duration * RATE_PER_HOUR);
    }
  }, [iRecordId, records]);

  const submit = async (event) => {
    event.preventDefault();
    await api.post('/api/payments', {
      record_id: iRecordId,
      amount_paid: amount,
      payment_date: paymentDate
    });
    setMessage('Payment recorded successfully.');
    setIRecordId('');
    setAmount('');
    setPaymentDate('');
  };

  return (
    <div className="space-y-8">
      <div className="dashboard-card">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-semibold">Payment Entry</h2>
            <p className="mt-2 text-sm text-slate-500">Record parking payments and keep the revenue dashboard up to date.</p>
          </div>
          <div className="rounded-3xl bg-slate-100 px-4 py-3 text-sm text-slate-700">
            Rate: {RATE_PER_HOUR.toLocaleString()} per hour
          </div>
        </div>
        <form onSubmit={submit} className="grid gap-4 lg:grid-cols-[1fr_1.1fr]">
          <select value={iRecordId} onChange={(e) => setIRecordId(e.target.value)} className="form-field" required>
            <option value="">Select record</option>
            {records.map((record) => (
              <option key={record.record_id} value={record.record_id}>
                {record.plate_number} - {record.slot_number} ({record.duration}h)
              </option>
            ))}
          </select>
          <input
            readOnly
            value={amount}
            placeholder="Amount to pay"
            className="form-field bg-slate-100"
          />
          <input
            type="datetime-local"
            value={paymentDate}
            onChange={(e) => setPaymentDate(e.target.value)}
            required
            className="form-field"
          />
          <button className="primary-button w-full justify-center lg:col-span-2">Save Payment</button>
        </form>
        {message && <div className="mt-4 rounded-2xl bg-emerald-50 p-4 text-sm text-emerald-700">{message}</div>}
      </div>
    </div>
  );
}
