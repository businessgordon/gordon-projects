import React, { useState, useEffect } from 'react';
import Layout from '../layouts/Layout';
import Modal from '../components/Modal';
import Alert from '../components/Alert';
import { stockOutAPI } from '../api/stockOutAPI';
import { sparePartAPI } from '../api/sparePartAPI';

const StockOutPage = ({ user, onLogout }) => {
  const [stockOutRecords, setStockOutRecords] = useState([]);
  const [spareParts, setSpareParts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [alert, setAlert] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    sparePartId: '',
    stockOutQuantity: '',
    stockOutUnitPrice: '',
    stockOutDate: new Date().toISOString().split('T')[0]
  });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [stockOutResponse, sparePartsResponse] = await Promise.all([
        stockOutAPI.getAllStockOut(),
        sparePartAPI.getAllSpareParts()
      ]);
      setStockOutRecords(stockOutResponse.data);
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
      stockOutQuantity: '',
      stockOutUnitPrice: '',
      stockOutDate: new Date().toISOString().split('T')[0]
    });
    setEditingId(null);
    setShowModal(true);
  };

  const handleEditClick = (record) => {
    setFormData({
      sparePartId: record.sparePartId,
      stockOutQuantity: record.stockOutQuantity,
      stockOutUnitPrice: record.stockOutUnitPrice,
      stockOutDate: record.stockOutDate
    });
    setEditingId(record.stockOutId);
    setShowModal(true);
  };

  const handleDeleteClick = async (id) => {
    if (!window.confirm('Are you sure you want to delete this stock out record?')) return;

    try {
      await stockOutAPI.deleteStockOut(id);
      setAlert({ type: 'success', message: 'Stock out record deleted successfully' });
      fetchData();
    } catch (error) {
      setAlert({ type: 'error', message: error.response?.data?.message || 'Failed to delete' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const data = {
        sparePartId: parseInt(formData.sparePartId),
        stockOutQuantity: parseInt(formData.stockOutQuantity),
        stockOutUnitPrice: parseFloat(formData.stockOutUnitPrice),
        stockOutDate: formData.stockOutDate
      };

      if (editingId) {
        await stockOutAPI.updateStockOut(editingId, data);
        setAlert({ type: 'success', message: 'Stock out record updated successfully' });
      } else {
        await stockOutAPI.createStockOut(data);
        setAlert({ type: 'success', message: 'Stock out record created successfully' });
      }
      setShowModal(false);
      fetchData();
    } catch (error) {
      setAlert({ type: 'error', message: error.response?.data?.message || 'Failed to save' });
    }
  };

  const filteredRecords = stockOutRecords.filter(record =>
    record.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Layout title="Stock Out Management" user={user} onLogout={onLogout}>
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">📤 Stock Out Records</h2>
        <button
          onClick={handleAddClick}
          className="btn-primary"
        >
          + Add Stock Out
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
        title={editingId ? 'Edit Stock Out Record' : 'Add Stock Out Record'}
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
                  {part.name} ({part.category}) - Available: {part.quantity}
                </option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Quantity to Remove *
              </label>
              <input
                type="number"
                name="stockOutQuantity"
                value={formData.stockOutQuantity}
                onChange={handleChange}
                className="input-field"
                min="1"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Unit Price ($) *
              </label>
              <input
                type="number"
                name="stockOutUnitPrice"
                value={formData.stockOutUnitPrice}
                onChange={handleChange}
                className="input-field"
                min="0"
                step="0.01"
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Date *
            </label>
            <input
              type="date"
              name="stockOutDate"
              value={formData.stockOutDate}
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
              {editingId ? 'Update' : 'Add'} Stock Out
            </button>
          </div>
        </form>
      </Modal>

      {/* Table */}
      <div className="card">
        {loading ? (
          <p className="text-center text-gray-500 py-6">Loading stock out records...</p>
        ) : filteredRecords.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="text-left p-3 font-semibold text-gray-700">Spare Part</th>
                  <th className="text-left p-3 font-semibold text-gray-700">Category</th>
                  <th className="text-left p-3 font-semibold text-gray-700">Quantity</th>
                  <th className="text-left p-3 font-semibold text-gray-700">Unit Price</th>
                  <th className="text-left p-3 font-semibold text-gray-700">Total Price</th>
                  <th className="text-left p-3 font-semibold text-gray-700">Date</th>
                  <th className="text-left p-3 font-semibold text-gray-700">User</th>
                  <th className="text-left p-3 font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredRecords.map((record) => (
                  <tr key={record.stockOutId} className="table-row">
                    <td className="p-3 text-gray-700 font-semibold">{record.name}</td>
                    <td className="p-3 text-gray-700">{record.category}</td>
                    <td className="p-3 text-gray-700">
                      <span className="inline-block px-3 py-1 rounded-full bg-red-100 text-red-800">
                        {record.stockOutQuantity} units
                      </span>
                    </td>
                    <td className="p-3 text-gray-700">${record.stockOutUnitPrice.toFixed(2)}</td>
                    <td className="p-3 text-gray-700 font-semibold">${record.stockOutTotalPrice.toFixed(2)}</td>
                    <td className="p-3 text-gray-700">{new Date(record.stockOutDate).toLocaleDateString()}</td>
                    <td className="p-3 text-gray-700">{record.username}</td>
                    <td className="p-3 text-gray-700 space-x-2">
                      <button
                        onClick={() => handleEditClick(record)}
                        className="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded text-sm transition"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteClick(record.stockOutId)}
                        className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded text-sm transition"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-center text-gray-500 py-6">No stock out records found</p>
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

export default StockOutPage;
