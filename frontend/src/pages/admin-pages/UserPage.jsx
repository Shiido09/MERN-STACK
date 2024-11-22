import React, { useEffect, useState } from 'react';
import MUIDataTable from 'mui-datatables';
import { Box, Typography } from '@mui/material';
import AdminLayout from './AdminLayout';
import axios from 'axios';
import CircularLoader from '../../components/loader/CircularLoader';

const UserPage = () => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/auth/users', { withCredentials: true });
      const usersData = response.data.users.map(user => ({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        address: user.address,
        phoneNo: user.phoneNo,
        avatar: user.avatar,
      }));
      setRows(usersData);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const columns = [
    { name: 'id', label: 'ID' },
    { name: 'name', label: 'Name' },
    { name: 'email', label: 'Email' },
    { name: 'role', label: 'Role' },
    { name: 'address', label: 'Address' },
    { name: 'phoneNo', label: 'Phone Number' },
    {
      name: 'avatar',
      label: 'Avatar',
      options: {
        customBodyRender: (value) => (
          <img
            src={value}
            alt="Avatar"
            style={{ width: '50px', height: '50px', borderRadius: '50%' }}
            onError={(e) => e.target.src = 'default-avatar.png'}
          />
        ),
      },
    },
  ];

  return (
    <AdminLayout>
      <h2 className="text-2xl font-semibold">Users</h2>
      {loading ? (
        <CircularLoader />
      ) : (
        <MUIDataTable
          title={"User List"}
          data={rows}
          columns={columns}
          options={{ selectableRows: 'none' }}
        />
      )}
    </AdminLayout>
  );
};

export default UserPage;