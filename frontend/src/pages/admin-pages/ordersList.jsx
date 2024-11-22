import React, { useState, useEffect } from 'react';
import MUIDataTable from 'mui-datatables';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Select, MenuItem, Typography } from '@mui/material';
import AdminLayout from './AdminLayout';
import { toast } from 'react-toastify';
import axios from 'axios';

const OrderList = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newStatus, setNewStatus] = useState('');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/orders');
        setOrders(response.data);
      } catch (err) {
        setError(err.message || 'Failed to fetch orders.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const handleOpenModal = (order) => {
    setSelectedOrder(order);
    setNewStatus(order.orderStatus);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedOrder(null);
  };

  const handleStatusChange = async () => {
    try {
      const response = await axios.put(
        `http://localhost:5000/api/orders/${selectedOrder._id}/status`,
        { status: newStatus },
        {
          withCredentials: true, // Include this to send cookies with the request
        }
      );

      const updatedOrder = response.data.order;

      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === updatedOrder._id ? updatedOrder : order
        )
      );

      toast.success('Order status updated successfully!');
      handleCloseModal();
    } catch (err) {
      toast.error('Failed to update order status.');
    }
  };

  const columns = [
    { name: '_id', label: 'Order ID' },
    { name: 'createdAt', label: 'Date', options: { customBodyRender: (value) => new Date(value).toLocaleDateString() } },
    { name: 'orderStatus', label: 'Status' },
    { name: 'deliveredAt', label: 'Delivered At', options: { customBodyRender: (value) => value ? new Date(value).toLocaleDateString() : 'Not delivered yet' } },
    { name: 'actions', label: 'Actions', options: { customBodyRender: (value, tableMeta) => (
      <Button variant="contained" color="primary" onClick={() => handleOpenModal(orders[tableMeta.rowIndex])}>
        View Details
      </Button>
    ) } },
  ];

  const options = {
    filter: true,
    selectableRows: 'multiple',
    filterType: 'dropdown',
    responsive: 'standard',
    rowsPerPage: 5,
  };

  return (
    <AdminLayout>
      <h2 className="text-2xl font-semibold">Orders</h2>
      {loading ? (
        <Typography variant="h6">Loading...</Typography>
      ) : error ? (
        <Typography variant="h6" color="error">{error}</Typography>
      ) : (
        <MUIDataTable
          title={"Order List"}
          data={orders}
          columns={columns}
          options={options}
        />
      )}

      <Dialog open={isModalOpen} onClose={handleCloseModal}>
        <DialogTitle>Order Details</DialogTitle>
        <DialogContent>
          {selectedOrder && (
            <div className="space-y-4">
              <Typography variant="h6">Order ID: {selectedOrder._id}</Typography>
              <Typography variant="body1">Date: {new Date(selectedOrder.createdAt).toLocaleDateString()}</Typography>
              <Typography variant="body1">Status: {selectedOrder.orderStatus}</Typography>
              <Typography variant="body1">Total Price: ₱ {selectedOrder.totalPrice.toFixed(2)}</Typography>
              <Typography variant="body1">Delivered At: {selectedOrder.deliveredAt ? new Date(selectedOrder.deliveredAt).toLocaleDateString() : 'Not delivered yet'}</Typography>
              <Typography variant="h6" style={{ marginTop: '20px' }}>User Details:</Typography>
              <Typography variant="body1">Name: {selectedOrder.user.name}</Typography>
              <Typography variant="body1">Phone: {selectedOrder.shippingInfo.phoneNo}</Typography>
              <Typography variant="body1">Address: {selectedOrder.shippingInfo.address}</Typography>
              <Typography variant="h6" style={{ marginTop: '20px' }}>Order Items:</Typography>
              {selectedOrder.orderItems.map((item, index) => (
                <div key={index} className="flex justify-between items-center mb-4">
                  <Typography variant="body1">{item.product.product_name}</Typography>
                  <Typography variant="body1">Quantity: {item.quantity}</Typography>
                </div>
              ))}
              <Typography variant="h6" style={{ marginTop: '20px' }}>Change Status:</Typography>
              <Select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
                fullWidth
                disabled={selectedOrder.orderStatus === 'Delivered'}
              >
                <MenuItem value="Processing">Processing</MenuItem>
                <MenuItem value="To Ship">To Ship</MenuItem>
                <MenuItem value="To Deliver">To Deliver</MenuItem>
                <MenuItem value="Delivered">Delivered</MenuItem>
                <MenuItem value="Cancelled">Cancelled</MenuItem>
              </Select>
            </div>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal} color="primary">
            Close
          </Button>
          <Button onClick={handleStatusChange} color="secondary" disabled={selectedOrder && selectedOrder.orderStatus === 'Delivered'}>
            Update Status
          </Button>
        </DialogActions>
      </Dialog>
    </AdminLayout>
  );
};

export default OrderList;