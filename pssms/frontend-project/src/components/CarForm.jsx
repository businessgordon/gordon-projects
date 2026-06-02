import { useEffect, useState } from 'react';
import api from '../services/api';

export default function CarForm() {
  const [cars, setCars] = useState([]);
  const [plateNumber, setPlateNumber] = useState('');
  const [driverName, setDriverName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [message, setMessage] = useState('');

  const fetchCars = async () => {
    const response = await api.get('/api/cars');
    setCars(response.data);
  };

  useEffect(() => {
    fetchCars();
  }, []);

  const submit = async (event) => {
    event.preventDefault();
    await api.post('/api/cars', { plate_number: plateNumber, driver_name: driverName, phone_number: phoneNumber });
    setMessage('Car saved successfully.');
    setPlateNumber('');
    setDriverName('');
    setPhoneNumber('');
    fetchCars();
  };

  return (
    <div className="space-y-8">
      <div className="dashboard-card">
        <div className="mb-6 flex items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold">Car Registration</h2>
            <p className="mt-2 text-sm text-slate-500">Add new vehicles and drivers to the parking system.</p>
          </div>
        </div>
        <form onSubmit={submit} className="grid gap-4 sm:grid-cols-2">
          <input
            required
            value={plateNumber}
            onChange={(e) => setPlateNumber(e.target.value.toUpperCase())}
            placeholder="Plate Number"
            className="form-field"
          />
          <input
            required
            value={driverName}
            onChange={(e) => setDriverName(e.target.value)}
            placeholder="Driver Name"
            className="form-field"
          />
          <input
            required
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            placeholder="Phone Number"
            className="form-field"
          />
          <button className="primary-button w-full justify-center sm:col-span-2">Save Car</button>
        </form>
        {message && <div className="mt-4 rounded-2xl bg-emerald-50 p-4 text-sm text-emerald-700">{message}</div>}
      </div>

      <div className="table-panel">
        <div className="border-b border-slate-200 px-6 py-5">
          <h3 className="text-lg font-semibold">Registered Cars</h3>
        </div>
        <div className="overflow-x-auto p-6">
          <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
            <thead className="bg-slate-50 text-slate-700">
              <tr>
                <th className="px-4 py-3">Plate</th>
                <th className="px-4 py-3">Driver</th>
                <th className="px-4 py-3">Phone</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white">
              {cars.map((car) => (
                <tr key={car.car_id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-4">{car.plate_number}</td>
                  <td className="px-4 py-4">{car.driver_name}</td>
                  <td className="px-4 py-4">{car.phone_number}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
