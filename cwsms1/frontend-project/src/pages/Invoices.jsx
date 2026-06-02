import { useEffect, useState } from 'react';
import api from '../services/api';

export default function Invoices() {
  const [payments, setPayments] = useState([]);

  useEffect(() => {
    api.get('/payments', { params: { page: 1, limit: 20 } }).then((response) => setPayments(response.data.rows || []));
  }, []);

  return (
    <div className="space-y-6">
      <div className="surface-card p-6">
        <h2 className="text-2xl font-semibold">Invoices</h2>
        <p className="text-slate-600">Download printable receipts for car washing services.</p>
      </div>
      <div className="grid gap-6">
        {payments.map((item) => (
          <div key={item.payment_number} className="surface-card p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-sm text-slate-500">Invoice #{item.payment_number}</p>
                <p className="mt-2 text-xl font-semibold">Record {item.record_number}</p>
              </div>
              <button className="rounded-3xl surface-button surface-button-accent">Print PDF</button>
            </div>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div>
                <p className="text-slate-600">Amount Paid</p>
                <p className="text-lg">RWF {Number(item.amount_paid || 0).toLocaleString()}</p>
              </div>
              <div>
                <p className="text-slate-600">Payment Status</p>
                <p className="text-lg">{item.payment_status}</p>
              </div>
            </div>
          </div>
        ))}
        {!payments.length && <p className="surface-card p-6 text-slate-500">No invoices available yet.</p>}
      </div>
    </div>
  );
}
