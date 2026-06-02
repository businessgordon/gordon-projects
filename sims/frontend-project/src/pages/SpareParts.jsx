import React, { useState, useEffect } from 'react';
import Layout from '../layouts/Layout';
import Modal from '../components/Modal';
import Alert from '../components/Alert';
import { sparePartAPI } from '../api/sparePartAPI';

const SpareParts = ({ user, onLogout }) => {
  const [spareParts, setSpareParts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [alert, setAlert] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    quantity: '',
    unitPrice: ''
  });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchSpareParts();
  }, []);

  const fetchSpareParts = async () => {
    try {
      const response = await sparePartAPI.getAllSpareParts();
      setSpareParts(response.data);
    } catch (error) {
      setAlert({ type: 'error', message: 'Failed to fetch spare parts' });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddClick = () => {
    setFormData({ name: '', category: '', quantity: '', unitPrice: '' });
    setEditingId(null);
    setShowModal(true);
  };

  const handleEditClick = (part) => {
    setFormData({
      name: part.name,
      category: part.category,
      quantity: part.quantity,
      unitPrice: part.unitPrice
    });
    setEditingId(part.sparePartId);
    setShowModal(true);
  };

  const handleDeleteClick = async (id) => {
    if (!window.confirm('Are you sure you want to delete this spare part?')) return;

    try {
      await sparePartAPI.deleteSparePart(id);
      setAlert({ type: 'success', message: 'Spare part deleted successfully' });
      fetchSpareParts();
    } catch (error) {
      setAlert({ type: 'error', message: error.response?.data?.message || 'Failed to delete' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingId) {
        await sparePartAPI.updateSparePart(editingId, formData);
        setAlert({ type: 'success', message: 'Spare part updated successfully' });
      } else {
        await sparePartAPI.createSparePart(formData);
        setAlert({ type: 'success', message: 'Spare part created successfully' });
      }
      setShowModal(false);
      fetchSpareParts();
    } catch (error) {
      setAlert({ type: 'error', message: error.response?.data?.message || 'Failed to save' });
    }
  };

  const filteredSpareParts = spareParts.filter(part =>
    part.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    part.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Layout title="Spare Parts Management" user={user} onLogout={onLogout}>
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">📦 Spare Parts</h2>
        <button
          onClick={handleAddClick}
          className="btn-primary"
        >
          + Add Spare Part
        </button>
      </div>

      {/* Search Bar */}
      <div>
        <input
          type="text"
          placeholder="Search by name or category..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="input-field"
        />
      </div>

      {/* Modal */}
      <Modal
        isOpen={showModal}
        title={editingId ? 'Edit Spare Part' : 'Add New Spare Part'}
        onClose={() => setShowModal(false)}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Part Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="input-field"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Category *
              </label>
              <input
                type="text"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="input-field"
                placeholder="e.g., Engine, Brake, etc."
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Quantity *
              </label>
              <input
                type="number"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                className="input-field"
                min="0"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Unit Price ($) *
              </label>
              <input
                type="number"
                name="unitPrice"
                value={formData.unitPrice}
                onChange={handleChange}
                className="input-field"
                min="0"
                step="0.01"
                required
              />
            </div>
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
              {editingId ? 'Update' : 'Add'} Spare Part
            </button>
          </div>
        </form>
      </Modal>

      {/* Table */}
      <div className="card">
        {loading ? (
          <p className="text-center text-gray-500 py-6">Loading spare parts...</p>
        ) : filteredSpareParts.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="text-left p-3 font-semibold text-gray-700">Part Name</th>
                  <th className="text-left p-3 font-semibold text-gray-700">Category</th>
                  <th className="text-left p-3 font-semibold text-gray-700">Quantity</th>
                  <th className="text-left p-3 font-semibold text-gray-700">Unit Price</th>
                  <th className="text-left p-3 font-semibold text-gray-700">Total Value</th>
                  <th className="text-left p-3 font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredSpareParts.map((part) => (
                  <tr key={part.sparePartId} className="table-row">
                    <td className="p-3 text-gray-700 font-semibold">{part.name}</td>
                    <td className="p-3 text-gray-700">{part.category}</td>
                    <td className="p-3 text-gray-700">
                      <span className="inline-block px-3 py-1 rounded-full bg-blue-100 text-blue-800">
                        {part.quantity} units
                      </span>
                    </td>
                    <td className="p-3 text-gray-700">${part.unitPrice.toFixed(2)}</td>
                    <td className="p-3 text-gray-700 font-semibold">${(part.totalPrice || 0).toFixed(2)}</td>
                    <td className="p-3 text-gray-700 space-x-2">
                      <button
                        onClick={() => handleEditClick(part)}
                        className="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded text-sm transition"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteClick(part.sparePartId)}
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
          <p className="text-center text-gray-500 py-6">No spare parts found</p>
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

export default SpareParts;
