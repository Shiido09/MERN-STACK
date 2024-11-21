// src/pages/admin-pages/Dashboard.jsx
import React, { useEffect, useState } from 'react';
import AdminLayout from './AdminLayout';
import CircularLoader from '../../components/loader/CircularLoader';
import axios from 'axios';
import SalesChart from '../../components/SalesChart'; // Import SalesChart

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/stats', { withCredentials: true });
      setStats(response.data);
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <AdminLayout>
      <h2 className="text-2xl font-semibold">Dashboard</h2>
      <p>Welcome to the Admin Dashboard!</p>
      {loading ? (
        <CircularLoader />
      ) : (
        <div>
          <div className="grid grid-cols-3 gap-4 mt-6">
            <div className="bg-blue-100 p-4 rounded-lg shadow">
              <h3 className="text-xl font-bold">Total Orders</h3>
              <p className="text-2xl font-semibold">{stats?.totalOrders || 0}</p>
            </div>
            <div className="bg-green-100 p-4 rounded-lg shadow">
              <h3 className="text-xl font-bold">Total Products</h3>
              <p className="text-2xl font-semibold">{stats?.totalSales || 0}</p>
            </div>
            <div className="bg-red-100 p-4 rounded-lg shadow">
              <h3 className="text-xl font-bold">Total Users</h3>
              <p className="text-2xl font-semibold">{stats?.totalReturns || 0}</p>
            </div>
          </div>
          <div className="mt-8">
            <SalesChart /> {/* Add SalesChart component */}
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default Dashboard;