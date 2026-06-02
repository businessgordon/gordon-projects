import React, { useState, useEffect } from 'react';
import Layout from '../layouts/Layout';
import StatCard from '../components/StatCard';
import { sparePartAPI } from '../api/sparePartAPI';
import { stockInAPI } from '../api/stockInAPI';
import { stockOutAPI } from '../api/stockOutAPI';

const DashboardPage = ({ user, onLogout }) => {
  const [stats, setStats] = useState({
    totalSpareParts: 0,
    totalStockIn: 0,
    totalStockOut: 0,
    remainingStock: 0,
    totalValue: 0
  });
  const [recentActivities, setRecentActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [spareParts, stockInRecords, stockOutRecords] = await Promise.all([
        sparePartAPI.getAllSpareParts(),
        stockInAPI.getAllStockIn(),
        stockOutAPI.getAllStockOut()
      ]);

      const totalSpareParts = spareParts.data.length;
      const totalStockInQty = stockInRecords.data.reduce((sum, record) => sum + record.stockInQuantity, 0);
      const totalStockOutQty = stockOutRecords.data.reduce((sum, record) => sum + record.stockOutQuantity, 0);
      const totalValue = spareParts.data.reduce((sum, part) => sum + (part.totalPrice || 0), 0);

      setStats({
        totalSpareParts,
        totalStockIn: totalStockInQty,
        totalStockOut: totalStockOutQty,
        remainingStock: spareParts.data.reduce((sum, part) => sum + part.quantity, 0),
        totalValue
      });

      // Get recent activities
      const activities = stockOutRecords.data.slice(0, 5).map(record => ({
        id: record.stockOutId,
        type: 'Stock Out',
        spare_part: record.name,
        quantity: record.stockOutQuantity,
        date: new Date(record.stockOutDate).toLocaleDateString(),
        user: record.username
      }));

      setRecentActivities(activities);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout title="Dashboard" user={user} onLogout={onLogout}>
      {loading ? (
        <div className="text-center py-12">
          <p className="text-gray-500">Loading dashboard...</p>
        </div>
      ) : (
        <>
          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <StatCard
              icon="📦"
              title="Total Spare Parts"
              value={stats.totalSpareParts}
              color="blue"
            />
            <StatCard
              icon="📥"
              title="Total Stock In"
              value={stats.totalStockIn}
              color="green"
            />
            <StatCard
              icon="📤"
              title="Total Stock Out"
              value={stats.totalStockOut}
              color="orange"
            />
            <StatCard
              icon="📦"
              title="Remaining Stock"
              value={stats.remainingStock}
              color="blue"
            />
            <StatCard
              icon="💰"
              title="Total Value"
              value={`${stats.totalValue.toLocaleString()}$`}
              color="green"
            />
          </div>

          {/* Recent Activities */}
          <div className="card">
            <h3 className="text-xl font-bold text-gray-800 mb-4">📊 Recent Stock Out Activities</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-gray-200">
                    <th className="text-left p-3 font-semibold text-gray-700">Spare Part</th>
                    <th className="text-left p-3 font-semibold text-gray-700">Quantity</th>
                    <th className="text-left p-3 font-semibold text-gray-700">Date</th>
                    <th className="text-left p-3 font-semibold text-gray-700">User</th>
                  </tr>
                </thead>
                <tbody>
                  {recentActivities.length > 0 ? (
                    recentActivities.map((activity) => (
                      <tr key={activity.id} className="table-row">
                        <td className="p-3 text-gray-700">{activity.spare_part}</td>
                        <td className="p-3 text-gray-700">{activity.quantity} units</td>
                        <td className="p-3 text-gray-700">{activity.date}</td>
                        <td className="p-3 text-gray-700">{activity.user}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="p-6 text-center text-gray-500">
                        No recent activities
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </Layout>
  );
};

export default DashboardPage;
