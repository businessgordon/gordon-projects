import React, { useState, useRef } from 'react';
import { getDailyPaymentReport, getPayment } from '../services/api';

export default function Reports() {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [report, setReport] = useState(null);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [billData, setBillData] = useState(null);
  const [showBill, setShowBill] = useState(false);
  const [billPaymentId, setBillPaymentId] = useState('');
  const [billLoading, setBillLoading] = useState(false);

  const printRef = useRef();
  const billRef = useRef();

  const fetchReport = async () => {
    setError(''); setLoading(true);
    try {
      const res = await getDailyPaymentReport(date);
      setReport(res.data.report);
      setTotal(res.data.total);
    } catch {
      setError('Failed to load report.');
    } finally { setLoading(false); }
  };

  const fetchBill = async () => {
    if (!billPaymentId) return;
    setBillLoading(true); setBillData(null);
    try {
      const res = await getPayment(billPaymentId);
      setBillData(res.data);
      setShowBill(true);
    } catch {
      setError('Payment not found. Check the Payment Number.');
    } finally { setBillLoading(false); }
  };

  const handlePrint = (ref) => {
    const content = ref.current;
    const win = window.open('', '_blank', 'width=800,height=600');
    win.document.write('<html><head><title>CRPMS Print</title>');
    win.document.write('<style>body{font-family:Arial,sans-serif;color:#000;padding:20px;} table{width:100%;border-collapse:collapse;} th,td{border:1px solid #ccc;padding:8px;text-align:left;} th{background:#f0f0f0;} .header{text-align:center;margin-bottom:20px;} .total{font-weight:bold;font-size:16px;margin-top:16px;} .bill-box{border:2px solid #333;border-radius:8px;padding:20px;max-width:600px;margin:0 auto;}</style>');
    win.document.write('</head><body>');
    win.document.write(content.innerHTML);
    win.document.write('</body></html>');
    win.document.close();
    win.focus();
    setTimeout(() => { win.print(); win.close(); }, 500);
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h2>📊 Reports</h2>
          <p>Daily service reports and payment bills</p>
        </div>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      <div className="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-2">

        {/* Daily Report Card */}
        <div className="card">
          <h3 className="mb-1 font-rajdhani text-lg font-bold text-textPrimary">📅 Daily Report</h3>
          <p className="mb-5 text-sm text-textSecondary">
            View all services and payments for a specific date
          </p>
          <div className="form-group">
            <label>Select Date</label>
            <input type="date" value={date} onChange={e => setDate(e.target.value)} />
          </div>
          <button className="btn btn-primary" onClick={fetchReport} disabled={loading}>
            {loading ? 'Loading...' : 'Generate Report'}
          </button>
        </div>

        {/* Bill Generator Card */}
        <div className="card">
          <h3 className="mb-1 font-rajdhani text-lg font-bold text-textPrimary">🧾 Generate Bill</h3>
          <p className="mb-5 text-sm text-textSecondary">
            Print a payment bill/invoice for a specific payment
          </p>
          <div className="form-group">
            <label>Payment Number</label>
            <input
              type="number"
              placeholder="Enter Payment Number"
              value={billPaymentId}
              onChange={e => setBillPaymentId(e.target.value)}
              min="1"
            />
          </div>
          <button className="btn btn-primary" onClick={fetchBill} disabled={billLoading}>
            {billLoading ? 'Loading...' : 'View Bill'}
          </button>
        </div>
      </div>

      {/* Daily Report Table */}
      {report && (
        <div className="card overflow-hidden p-0">
          <div className="flex items-center justify-between border-b border-border p-5">
            <div>
              <h3 className="font-rajdhani text-lg font-bold text-textPrimary">Daily Report — {new Date(date + 'T00:00:00').toLocaleDateString('en-RW', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</h3>
              <p className="mt-0.5 text-sm text-textSecondary">
                {report.length} transaction{report.length !== 1 ? 's' : ''} · Total: <strong className="text-success">{total.toLocaleString()} RWF</strong>
              </p>
            </div>
            <button className="btn btn-secondary" onClick={() => handlePrint(printRef)}>🖨️ Print Report</button>
          </div>

          {/* Hidden printable content */}
          <div ref={printRef} className="hidden">
            <div className="header">
              <h2>SmartPark — Car Repair Payment Management System</h2>
              <p>Rubavu District, Western Province, Rwanda</p>
              <h3>Daily Report — {new Date(date + 'T00:00:00').toLocaleDateString('en-RW', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</h3>
              <p>Generated: {new Date().toLocaleString()}</p>
            </div>
            <table>
              <thead>
                <tr>
                  <th>Pay#</th><th>Plate</th><th>Car Model</th><th>Service</th>
                  <th>Mechanic</th><th>Driver Phone</th><th>Amount (RWF)</th><th>Received By</th>
                </tr>
              </thead>
              <tbody>
                {report.map(r => (
                  <tr key={r.PaymentNumber}>
                    <td>#{r.PaymentNumber}</td>
                    <td>{r.PlateNumber}</td>
                    <td>{r.Model} ({r.Type})</td>
                    <td>{r.ServiceName}</td>
                    <td>{r.MechanicName}</td>
                    <td>{r.DriverPhone}</td>
                    <td>{Number(r.AmountPaid).toLocaleString()}</td>
                    <td>{r.ReceivedBy || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="total">Total Revenue: {total.toLocaleString()} RWF</div>
          </div>

          {/* Visible table */}
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Pay#</th><th>Plate</th><th>Car Model</th><th>Service</th>
                  <th>Mechanic</th><th>Driver Phone</th><th>Amount (RWF)</th><th>Received By</th>
                </tr>
              </thead>
              <tbody>
                {report.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="p-8 text-center text-textSecondary">
                      No payments recorded for this date.
                    </td>
                  </tr>
                ) : report.map(r => (
                  <tr key={r.PaymentNumber}>
                    <td><span className="badge badge-success">#{r.PaymentNumber}</span></td>
                    <td><span className="badge badge-info">{r.PlateNumber}</span></td>
                    <td className="font-semibold">{r.Model} <span className="font-normal text-textSecondary">({r.Type})</span></td>
                    <td>{r.ServiceName}</td>
                    <td className="text-xs">{r.MechanicName}</td>
                    <td className="text-xs">{r.DriverPhone}</td>
                    <td className="font-rajdhani text-lg font-bold text-success">
                      {Number(r.AmountPaid).toLocaleString()}
                    </td>
                    <td className="text-xs">{r.ReceivedBy || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {report.length > 0 && (
            <div className="flex items-center justify-end gap-4 border-t border-border px-5 py-3.5">
              <span className="text-sm text-textSecondary">Total Revenue:</span>
              <span className="font-rajdhani text-2xl font-bold text-success">
                {total.toLocaleString()} RWF
              </span>
            </div>
          )}
        </div>
      )}

      {/* Bill Modal */}
      {showBill && billData && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setShowBill(false)}>
          <div className="modal max-w-xl">
            <div className="modal-header">
              <h3>🧾 Payment Bill</h3>
              <div className="flex gap-2">
                <button className="btn btn-secondary btn-sm" onClick={() => handlePrint(billRef)}>🖨️ Print</button>
                <button className="modal-close" onClick={() => setShowBill(false)}>x</button>
              </div>
            </div>

            {/* Printable bill */}
            <div ref={billRef} className="hidden">
              <div className="bill-box">
                <div className="header">
                  <h2>SmartPark Garage</h2>
                  <p>Rubavu District, Western Province, Rwanda</p>
                  <p>Car Repair Payment Management System (CRPMS)</p>
                  <hr />
                  <h3>PAYMENT RECEIPT / INVOICE</h3>
                </div>
                <p><strong>Receipt No:</strong> PAY-{String(billData.PaymentNumber).padStart(5, '0')}</p>
                <p><strong>Payment Date:</strong> {new Date(billData.PaymentDate).toLocaleDateString('en-RW', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                <p><strong>Received By:</strong> {billData.ReceivedBy || billData.Username || 'SmartPark Staff'}</p>
                <hr />
                <p><strong>Vehicle Details</strong></p>
                <p>Plate Number: {billData.PlateNumber}</p>
                <p>Car: {billData.Model} ({billData.Type})</p>
                <p>Driver Phone: {billData.DriverPhone}</p>
                <p>Mechanic: {billData.MechanicName}</p>
                <hr />
                <p><strong>Service Details</strong></p>
                <p>Service: {billData.ServiceName}</p>
                <p>Service Date: {new Date(billData.ServiceDate).toLocaleDateString('en-RW')}</p>
                <p>Standard Price: {Number(billData.ServicePrice).toLocaleString()} RWF</p>
                <hr />
                <div className="total">AMOUNT PAID: {Number(billData.AmountPaid).toLocaleString()} RWF</div>
                <br />
                <p className="text-center text-xs">Thank you for choosing SmartPark Garage!</p>
              </div>
            </div>

            {/* Visible bill */}
            <div className="border border-border rounded-lg overflow-hidden">
              {/* Bill header */}
              <div className="bg-gradient-to-r from-accent to-orange-700 px-6 py-5 text-center">
                <div className="text-3xl mb-1">🔩</div>
                <div className="font-rajdhani text-xl font-bold tracking-[0.05em] text-white">
                  SmartPark Garage
                </div>
                <div className="text-white text-opacity-80 text-sm">
                  Rubavu District, Western Province, Rwanda
                </div>
              </div>

              {/* Bill body */}
              <div className="px-6 py-5">
                <div className="text-center mb-5 pb-4 border-b border-dashed border-border">
                  <div className="font-rajdhani text-base font-bold tracking-[0.1em] text-textSecondary">
                    PAYMENT RECEIPT
                  </div>
                  <div className="mt-1 text-sm text-textSecondary">
                    Receipt No: <strong className="text-textPrimary">PAY-{String(billData.PaymentNumber).padStart(5, '0')}</strong>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  {[
                    { label: 'Payment Date', value: new Date(billData.PaymentDate).toLocaleDateString('en-RW') },
                    { label: 'Received By', value: billData.ReceivedBy || 'SmartPark Staff' },
                    { label: 'Plate Number', value: billData.PlateNumber },
                    { label: 'Vehicle', value: billData.Model + ' (' + billData.Type + ')' },
                    { label: 'Driver Phone', value: billData.DriverPhone },
                    { label: 'Mechanic', value: billData.MechanicName },
                    { label: 'Service', value: billData.ServiceName },
                    { label: 'Service Date', value: new Date(billData.ServiceDate).toLocaleDateString('en-RW') },
                  ].map((item, i) => (
                    <div key={i}>
                      <div className="mb-0.5 text-xs uppercase tracking-[0.06em] text-textSecondary">{item.label}</div>
                      <div className="text-sm font-semibold text-textPrimary">{item.value}</div>
                    </div>
                  ))}
                </div>

                <div className="bg-green-950 border border-green-800 rounded-btn p-5 text-center mt-2">
                  <div className="mb-1 text-xs uppercase tracking-[0.08em] text-textSecondary">Amount Paid</div>
                  <div className="font-rajdhani text-4xl font-bold text-success">
                    {Number(billData.AmountPaid).toLocaleString()} RWF
                  </div>
                </div>

                <p className="mt-4 text-center text-sm text-textSecondary">
                  Thank you for choosing SmartPark Garage!
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
