import React, { useState, useEffect } from 'react';
import Layout from '../layouts/Layout';
import StatCard from '../components/StatCard';
import { stockOutAPI } from '../api/stockOutAPI';
import { sparePartAPI } from '../api/sparePartAPI';
import { stockInAPI } from '../api/stockInAPI';

const ReportsPage = ({ user, onLogout }) => {
  const [stockOutData, setStockOutData] = useState([]);
  const [stockStatusData, setStockStatusData] = useState([]);
  const [reportStats, setReportStats] = useState({
    totalStockOut: 0,
    totalValue: 0,
    totalStockIn: 0
  });
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    fetchReports();
  }, [selectedDate]);

  const fetchReports = async () => {
    try {
      const [stockOutResponse, sparePartsResponse, stockInResponse] = await Promise.all([
        stockOutAPI.getAllStockOut(),
        sparePartAPI.getAllSpareParts(),
        stockInAPI.getAllStockIn()
      ]);

      // Filter stock out for the selected date
      const filteredStockOut = stockOutResponse.data.filter(
        record => record.stockOutDate === selectedDate
      );

      // Calculate report stats
      const totalStockOutQty = filteredStockOut.reduce((sum, record) => sum + record.stockOutQuantity, 0);
      const totalValue = filteredStockOut.reduce((sum, record) => sum + record.stockOutTotalPrice, 0);

      setStockOutData(filteredStockOut);
      setReportStats({
        totalStockOut: totalStockOutQty,
        totalValue: totalValue,
        totalStockIn: stockInResponse.data.reduce((sum, record) => sum + record.stockInQuantity, 0)
      });

      // Calculate stock status
      const statusData = sparePartsResponse.data.map(part => {
        const stockInQty = stockInResponse.data
          .filter(record => record.sparePartId === part.sparePartId)
          .reduce((sum, record) => sum + record.stockInQuantity, 0);

        const stockOutQty = stockOutResponse.data
          .filter(record => record.sparePartId === part.sparePartId)
          .reduce((sum, record) => sum + record.stockOutQuantity, 0);

        return {
          sparePartId: part.sparePartId,
          name: part.name,
          category: part.category,
          storedQuantity: part.quantity,
          stockInQuantity: stockInQty,
          stockOutQuantity: stockOutQty,
          remainingQuantity: part.quantity,
          status: part.quantity > 50 ? 'In Stock' : part.quantity > 0 ? 'Low Stock' : 'Out of Stock'
        };
      });

      setStockStatusData(statusData);
    } catch (error) {
      console.error('Error fetching reports:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <Layout title="Reports" user={user} onLogout={onLogout}>
      {/* Header with Date Filter */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">📈 Reports</h2>
        <div className="flex gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Select Date:</label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="input-field w-48"
            />
          </div>
          <button
            onClick={handlePrint}
            className="btn-primary self-end"
          >
            🖨️ Print Report
          </button>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <p className="text-gray-500">Loading reports...</p>
        </div>
      ) : (
        <>
          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <StatCard
              icon="📤"
              title="Total Stock Out (Today)"
              value={reportStats.totalStockOut}
              color="orange"
            />
            <StatCard
              icon="💰"
              title="Total Value Out"
              value={`$${reportStats.totalValue.toFixed(2)}`}
              color="red"
            />
            <StatCard
              icon="📥"
              title="Total Stock In"
              value={reportStats.totalStockIn}
              color="green"
            />
          </div>

          {/* Daily Stock Out Report */}
          <div className="card">
            <h3 className="text-xl font-bold text-gray-800 mb-4">📊 Daily Stock Out Report - {selectedDate}</h3>
            {stockOutData.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b-2 border-gray-200">
                      <th className="text-left p-3 font-semibold text-gray-700">Spare Part</th>
                      <th className="text-left p-3 font-semibold text-gray-700">Category</th>
                      <th className="text-left p-3 font-semibold text-gray-700">Quantity Removed</th>
                      <th className="text-left p-3 font-semibold text-gray-700">Unit Price</th>
                      <th className="text-left p-3 font-semibold text-gray-700">Total Price</th>
                      <th className="text-left p-3 font-semibold text-gray-700">Removed By</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stockOutData.map((record) => (
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
                        <td className="p-3 text-gray-700">{record.username}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-center text-gray-500 py-6">No stock out records for this date</p>
            )}
          </div>

          {/* Daily Stock Status Report */}
          <div className="card mt-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">📦 Stock Status Report</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-gray-200">
                    <th className="text-left p-3 font-semibold text-gray-700">Spare Part</th>
                    <th className="text-left p-3 font-semibold text-gray-700">Category</th>
                    <th className="text-left p-3 font-semibold text-gray-700">Stored Quantity</th>
                    <th className="text-left p-3 font-semibold text-gray-700">Total Stock In</th>
                    <th className="text-left p-3 font-semibold text-gray-700">Total Stock Out</th>
                    <th className="text-left p-3 font-semibold text-gray-700">Remaining Quantity</th>
                    <th className="text-left p-3 font-semibold text-gray-700">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {stockStatusData.map((part) => (
                    <tr key={part.sparePartId} className="table-row">
                      <td className="p-3 text-gray-700 font-semibold">{part.name}</td>
                      <td className="p-3 text-gray-700">{part.category}</td>
                      <td className="p-3 text-gray-700">
                        <span className="inline-block px-3 py-1 rounded-full bg-blue-100 text-blue-800">
                          {part.storedQuantity}
                        </span>
                      </td>
                      <td className="p-3 text-gray-700">
                        <span className="inline-block px-3 py-1 rounded-full bg-emerald-100 text-emerald-800">
                          {part.stockInQuantity}
                        </span>
                      </td>
                      <td className="p-3 text-gray-700">
                        <span className="inline-block px-3 py-1 rounded-full bg-red-100 text-red-800">
                          {part.stockOutQuantity}
                        </span>
                      </td>
                      <td className="p-3 text-gray-700 font-semibold">{part.remainingQuantity}</td>
                      <td className="p-3">
                        <span className={`inline-block px-3 py-1 rounded-full font-semibold ${
                          part.status === 'In Stock' ? 'bg-emerald-100 text-emerald-800' :
                          part.status === 'Low Stock' ? 'bg-orange-100 text-orange-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {part.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </Layout>
  );
};

export default ReportsPage;
