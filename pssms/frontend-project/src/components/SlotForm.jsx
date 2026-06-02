import { useEffect, useState } from 'react';
import api from '../services/api';

export default function SlotForm() {
  const [slots, setSlots] = useState([]);
  const [slotNumber, setSlotNumber] = useState('');
  const [slotStatus, setSlotStatus] = useState('available');
  const [message, setMessage] = useState('');

  const fetchSlots = async () => {
    const response = await api.get('/api/slots');
    setSlots(response.data);
  };

  useEffect(() => {
    fetchSlots();
  }, []);

  const submit = async (event) => {
    event.preventDefault();
    await api.post('/api/slots', { slot_number: slotNumber, slot_status: slotStatus });
    setMessage('Parking slot saved successfully.');
    setSlotNumber('');
    setSlotStatus('available');
    fetchSlots();
  };

  return (
    <div className="space-y-8">
      <div className="dashboard-card">
        <div className="mb-6 flex items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold">Parking Slot Entry</h2>
            <p className="mt-2 text-sm text-slate-500">Create or update parking slot availability for your facility.</p>
          </div>
        </div>
        <form onSubmit={submit} className="grid gap-4 sm:grid-cols-2">
          <input
            required
            value={slotNumber}
            onChange={(e) => setSlotNumber(e.target.value)}
            placeholder="Slot Number"
            className="form-field"
          />
          <select
            value={slotStatus}
            onChange={(e) => setSlotStatus(e.target.value)}
            className="form-field"
          >
            <option value="available">Available</option>
            <option value="occupied">Occupied</option>
          </select>
          <button className="primary-button w-full justify-center sm:col-span-2">Save Slot</button>
        </form>
        {message && <div className="mt-4 rounded-2xl bg-emerald-50 p-4 text-sm text-emerald-700">{message}</div>}
      </div>

      <div className="table-panel">
        <div className="border-b border-slate-200 px-6 py-5">
          <h3 className="text-lg font-semibold">Available Parking Slots</h3>
        </div>
        <div className="overflow-x-auto p-6">
          <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
            <thead className="bg-slate-50 text-slate-700">
              <tr>
                <th className="px-4 py-3">Slot Number</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white">
              {slots.map((slot) => (
                <tr key={slot.slot_id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-4">{slot.slot_number}</td>
                  <td className="px-4 py-4 capitalize">{slot.slot_status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
