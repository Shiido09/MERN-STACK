// src/pages/admin-pages/Dashboard.jsx
import React, { useEffect, useState } from 'react';
import AdminLayout from './AdminLayout'; // Import AdminLayout
import { DataGrid } from '@mui/x-data-grid'; // Import DataGrid from MUI
import axios from 'axios'; // Import axios for making API requests

const Dashboard = () => {
  const [rows, setRows] = useState([]); // State for rows
  const [loading, setLoading] = useState(true); // State for loading

  // Fetch user data from the backend
  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/auth/users', { withCredentials: true }); // Update the URL according to your API
      const usersData = response.data.users.map(user => ({
        id: user._id, // Use the user ID for the DataGrid
        name: user.name,
        email: user.email,
        role: user.isAdmin ? 'Admin' : 'User', // Determine the role based on isAdmin flag
      }));
      setRows(usersData); // Set the fetched data to the rows state
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false); // Stop loading
    }
  };

  // Effect to fetch users on component mount
  useEffect(() => {
    fetchUsers();
  }, []);

  // Column definitions for the Data Grid
  const columns = [
    { field: 'id', headerName: 'ID', width: 90 },
    { field: 'name', headerName: 'Name', width: 150 },
    { field: 'email', headerName: 'Email', width: 200 },
    { field: 'role', headerName: 'Role', width: 120 },
  ];

  return (
    <AdminLayout>
      <h2 className="text-2xl font-semibold">Dashboard</h2>
      <p>Welcome to the Admin Dashboard!</p>
      {loading ? ( // Show loading indicator while fetching data
        <p>Loading...</p>
      ) : (
        <div style={{ height: 400, width: '100%', marginTop: '20px' }}>
          <DataGrid 
            rows={rows} 
            columns={columns} 
            pageSize={5} 
            rowsPerPageOptions={[5]} 
            checkboxSelection 
            disableSelectionOnClick 
          />
        </div>
      )}
    </AdminLayout>
  );
};

export default Dashboard;
