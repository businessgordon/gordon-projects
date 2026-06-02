import React, { useState, useEffect } from 'react';
import Layout from '../layouts/Layout';
import Modal from '../components/Modal';
import Alert from '../components/Alert';
import { stockInAPI } from '../api/stockInAPI';
import { sparePartAPI } from '../api/sparePartAPI';

const StockInPage = ({ user, onLogout }) => {
  const [stockInRecords, setStockInRecords] = useState([]);
  const [spareParts, setSpareParts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [alert, setAlert] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    sparePartId: '',
    stockInQuantity: '',
    stockInDate: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [stockInResponse, sparePartsResponse] = await Promise.all([
        stockInAPI.getAllStockIn(),
        sparePartAPI.getAllSpareParts()
      ]);
      setStockInRecords(stockInResponse.data);
      setSpareParts(sparePartsResponse.data);
    } catch (error) {
      setAlert({ type: 'error', message: 'Failed to fetch data' });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddClick = () => {
    setFormData({
      sparePartId: '',
      stockInQuantity: '',
      stockInDate: new Date().toISOString().split('T')[0]
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await stockInAPI.createStockIn({
        sparePartId: parseInt(formData.sparePartId),
        stockInQuantity: parseInt(formData.stockInQuantity),
        stockInDate: formData.stockInDate
      });
      setAlert({ type: 'success', message: 'Stock in record created successfully' });
      setShowModal(false);
      fetchData();
    } catch (error) {
      setAlert({ type: 'error', message: error.response?.data?.message || 'Failed to create record' });
    }
  };

  const filteredRecords = stockInRecords.filter(record =>
    record.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Layout title="Stock In Management" user={user} onLogout={onLogout}>
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">📥 Stock In Records</h2>
        <button
          onClick={handleAddClick}
          className="btn-primary"
        >
          + Add Stock In
        </button>
      </div>

      {/* Search Bar */}
      <div>
        <input
          type="text"
          placeholder="Search by spare part name or category..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="input-field"
        />
      </div>

      {/* Modal */}
      <Modal
        isOpen={showModal}
        title="Add Stock In Record"
        onClose={() => setShowModal(false)}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Spare Part *
            </label>
            <select
              name="sparePartId"
              value={formData.sparePartId}
              onChange={handleChange}
              className="input-field"
              required
            >
              <option value="">Select a spare part</option>
              {spareParts.map(part => (
                <option key={part.sparePartId} value={part.sparePartId}>
                  {part.name} ({part.category})
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Quantity to Add *
            </label>
            <input
              type="number"
              name="stockInQuantity"
              value={formData.stockInQuantity}
              onChange={handleChange}
              className="input-field"
              min="1"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Date *
            </label>
            <input
              type="date"
              name="stockInDate"
              value={formData.stockInDate}
              onChange={handleChange}
              className="input-field"
              required
            />
          </div>
          <div className="flex gap-3 justify-end mt-6">
            <button
              type="button"
              onClick={() => setShowModal(false)}
              className="btn-ghost"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary"
            >
              Add Stock In
            </button>
          </div>
        </form>
      </Modal>

      {/* Table */}
      <div className="card">
        {loading ? (
          <p className="text-center text-gray-500 py-6">Loading stock in records...</p>
        ) : filteredRecords.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="text-left p-3 font-semibold text-gray-700">Spare Part</th>
                  <th className="text-left p-3 font-semibold text-gray-700">Category</th>
                  <th className="text-left p-3 font-semibold text-gray-700">Quantity Added</th>
                  <th className="text-left p-3 font-semibold text-gray-700">Unit Price</th>
                  <th className="text-left p-3 font-semibold text-gray-700">Total Value</th>
                  <th className="text-left p-3 font-semibold text-gray-700">Date</th>
                </tr>
              </thead>
              <tbody>
                {filteredRecords.map((record) => (
                  <tr key={record.stockInId} className="table-row">
                    <td className="p-3 text-gray-700 font-semibold">{record.name}</td>
                    <td className="p-3 text-gray-700">{record.category}</td>
                    <td className="p-3 text-gray-700">
                      <span className="inline-block px-3 py-1 rounded-full bg-emerald-100 text-emerald-800">
                        {record.stockInQuantity} units
                      </span>
                    </td>
                    <td className="p-3 text-gray-700">${record.unitPrice.toFixed(2)}</td>
                    <td className="p-3 text-gray-700 font-semibold">${(record.totalPrice || 0).toFixed(2)}</td>
                    <td className="p-3 text-gray-700">{new Date(record.stockInDate).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-center text-gray-500 py-6">No stock in records found</p>
        )}
      </div>

      {/* Alert */}
      {alert && (
        <Alert
          type={alert.type}
          message={alert.message}
          onClose={() => setAlert(null)}
          duration={5000}
        />
      )}
    </Layout>
  );
};

export default StockInPage;
