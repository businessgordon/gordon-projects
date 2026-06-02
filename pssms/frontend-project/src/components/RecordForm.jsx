import { useEffect, useState } from 'react';
import api from '../services/api';

export default function RecordForm() {
  const [records, setRecords] = useState([]);
  const [cars, setCars] = useState([]);
  const [slots, setSlots] = useState([]);
  const [plateNumber, setPlateNumber] = useState('');
  const [slotNumber, setSlotNumber] = useState('');
  const [entryTime, setEntryTime] = useState('');
  const [exitTime, setExitTime] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState('');

  const fetchData = async () => {
    const [recordsResponse, carsResponse, slotsResponse] = await Promise.all([
      api.get('/api/records'),
      api.get('/api/cars'),
      api.get('/api/slots')
    ]);
    setRecords(recordsResponse.data);
    setCars(carsResponse.data);
    setSlots(slotsResponse.data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const reset = () => {
    setPlateNumber('');
    setSlotNumber('');
    setEntryTime('');
    setExitTime('');
    setEditingId(null);
  };

  const submit = async (event) => {
    event.preventDefault();
    const payload = { plate_number: plateNumber, slot_number: slotNumber, entry_time: entryTime, exit_time: exitTime };
    if (editingId) {
      await api.put(`/api/records/${editingId}`, payload);
      setMessage('Parking record updated.');
    } else {
      await api.post('/api/records', payload);
      setMessage('Parking record saved.');
    }
    reset();
    fetchData();
  };

  const remove = async (id) => {
    await api.delete(`/api/records/${id}`);
    setMessage('Parking record deleted.');
    fetchData();
  };

  const edit = (record) => {
    setEditingId(record.record_id);
    setPlateNumber(record.plate_number);
    setSlotNumber(record.slot_number);
    setEntryTime(record.entry_time.slice(0, 16));
    setExitTime(record.exit_time.slice(0, 16));
  };

  return (
    <div className="space-y-8">
      <div className="dashboard-card">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-semibold">Parking Record</h2>
            <p className="mt-2 text-sm text-slate-500">Create or edit parking records with entry and exit times.</p>
          </div>
        </div>
        <form onSubmit={submit} className="grid gap-4 lg:grid-cols-2">
          <select value={plateNumber} onChange={(e) => setPlateNumber(e.target.value)} className="form-field" required>
            <option value="">Select car plate</option>
            {cars.map((car) => (
              <option key={car.car_id} value={car.plate_number}>{car.plate_number}</option>
            ))}
          </select>
          <select value={slotNumber} onChange={(e) => setSlotNumber(e.target.value)} className="form-field" required>
            <option value="">Select slot</option>
            {slots.map((slot) => (
              <option key={slot.slot_id} value={slot.slot_number}>{slot.slot_number}</option>
            ))}
          </select>
          <label className="block">
            <span className="text-sm font-medium text-slate-700">Entry Time</span>
            <input type="datetime-local" value={entryTime} onChange={(e) => setEntryTime(e.target.value)} className="form-field mt-2" required />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-slate-700">Exit Time</span>
            <input type="datetime-local" value={exitTime} onChange={(e) => setExitTime(e.target.value)} className="form-field mt-2" required />
          </label>
          <div className="flex flex-col gap-3 sm:flex-row sm:col-span-2">
            <button className="primary-button w-full justify-center">{editingId ? 'Update Record' : 'Save Record'}</button>
            <button type="button" className="secondary-button w-full justify-center" onClick={reset}>Clear</button>
          </div>
        </form>
        {message && <div className="mt-4 rounded-2xl bg-emerald-50 p-4 text-sm text-emerald-700">{message}</div>}
      </div>

      <div className="table-panel">
        <div className="border-b border-slate-200 px-6 py-5">
          <h3 className="text-lg font-semibold">Parking Record List</h3>
        </div>
        <div className="overflow-x-auto p-6">
          <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
            <thead className="bg-slate-50 text-slate-700">
              <tr>
                <th className="px-4 py-3">Plate</th>
                <th className="px-4 py-3">Slot</th>
                <th className="px-4 py-3">Entry</th>
                <th className="px-4 py-3">Exit</th>
                <th className="px-4 py-3">Duration</th>
                <th className="px-4 py-3">Payment</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white">
              {records.map((record) => (
                <tr key={record.record_id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-4">{record.plate_number}</td>
                  <td className="px-4 py-4">{record.slot_number}</td>
                  <td className="px-4 py-4">{new Date(record.entry_time).toLocaleString()}</td>
                  <td className="px-4 py-4">{new Date(record.exit_time).toLocaleString()}</td>
                  <td className="px-4 py-4">{record.duration}</td>
                  <td className="px-4 py-4">{record.amount_paid ?? '-'}</td>
                  <td className="px-4 py-4 flex flex-wrap gap-2">
                    <button onClick={() => edit(record)} className="bg-cyan-600 text-white rounded-full px-3 py-1 text-sm">Edit</button>
                    <button onClick={() => remove(record.record_id)} className="bg-rose-600 text-white rounded-full px-3 py-1 text-sm">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
