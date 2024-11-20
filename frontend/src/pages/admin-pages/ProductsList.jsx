import React, { useEffect, useState } from 'react';
import MUIDataTable from 'mui-datatables';
import { IconButton, Button, Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import AdminLayout from './AdminLayout';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts, deleteProduct, createProduct, updateProduct } from '../../slices/productSlice';
import ProductForm from './ProductForm'; // Ensure this path is correct
import Modal from './Modal'; // Import the new Modal component
import CircularLoader from '../../components/loader/CircularLoader'; // Adjust the import path as needed
import { toast } from 'react-toastify'; // Import toast from react-toastify

const Products = () => {
  const dispatch = useDispatch();
  const { products, loading } = useSelector((state) => state.products);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [productsToDelete, setProductsToDelete] = useState([]);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const handleOpenModal = () => {
    setSelectedProduct(null); // Clear the selected product for adding a new product
    setIsModalOpen(true);
  };

  const handleEdit = (product) => {
    setSelectedProduct(product); // Set the selected product for editing
    setIsModalOpen(true); // Open the modal
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null); // Clear selected product when closing the modal
  };

  const handleOpenDeleteDialog = (products) => {
    setProductsToDelete(products);
    setIsDeleteDialogOpen(true);
  };

  const handleCloseDeleteDialog = () => {
    setIsDeleteDialogOpen(false);
    setProductsToDelete([]);
  };

  const handleDeleteProduct = async () => {
    setIsDeleting(true);
    try {
      await Promise.all(productsToDelete.map(id => dispatch(deleteProduct(id)).unwrap()));
      setIsDeleting(false);
      handleCloseDeleteDialog();
      toast.success("Deleted successfully");
    } catch (error) {
      console.error("Error deleting product:", error);
      setIsDeleting(false);
    }
  };

  const handleRowDelete = (rowsDeleted) => {
    const idsToDelete = rowsDeleted.data.map(d => products[d.dataIndex]._id);
    handleOpenDeleteDialog(idsToDelete);
    return false; // Prevent automatic deletion
  };

  const handleProductSubmit = async (productData, isUpdate) => {
    try {
      if (isUpdate) {
        // Update product
        await dispatch(updateProduct({ id: selectedProduct._id, formData: productData })).unwrap();
        toast.success("Product updated successfully!");
      } else {
        // Create new product
        await dispatch(createProduct(productData)).unwrap();
        toast.success("Product created successfully!");
      }
      handleCloseModal();
    } catch (error) {
      console.error("Error submitting product form:", error);
      toast.error("Failed to submit the product form. Please try again later.");
    }
  };

  const columns = [
    { name: 'product_name', label: 'Product Name' },
    { name: 'category', label: 'Category' },
    { name: 'price', label: 'Price' },
    { name: 'stocks', label: 'Stocks' },
    {
      name: 'product_images',
      label: 'Product Images',
      options: {
        customBodyRender: (value) => (
          <div style={{ display: 'flex', flexWrap: 'wrap' }}>
            {value.map((image, index) => (
              <img 
                key={index}
                src={image.url} 
                alt={`Product`} 
                style={{ width: '50px', height: '50px', margin: '2px' }} 
              />
            ))}
          </div>
        ),
      },
    },
    {
      name: 'actions',
      label: 'Actions',
      options: {
        customBodyRender: (value, tableMeta) => (
          <IconButton color="primary" onClick={() => handleEdit(products[tableMeta.rowIndex])}>
            <EditIcon />
          </IconButton>
        ),
      },
    },
  ];

  const options = {
    filter: true,
    selectableRows: 'multiple',
    filterType: 'dropdown',
    responsive: 'standard',
    rowsPerPage: 5,
    expandableRows: true,
    onRowsDelete: handleRowDelete,
    renderExpandableRow: (rowData, rowMeta) => {
      const product = products[rowMeta.dataIndex];
      return (
        <TableRow>
          <TableCell colSpan={6}>
            <Box margin={1} padding={2} bgcolor="grey.100">
              <Typography variant="h6">Explanation</Typography>
              <Typography variant="body2">
                {product.explanation}
              </Typography>
            </Box>
          </TableCell>
        </TableRow>
      );
    },
    customToolbar: () => (
      <Button variant="contained" color="primary" onClick={handleOpenModal} style={{ marginRight: '10px' }}>
        Add Product
      </Button>
    ),
  };

  return (
    <AdminLayout>
      <h2 className="text-2xl font-semibold">Products</h2>
      {loading ? (
        <CircularLoader />
      ) : (
        <MUIDataTable
          title={"Product List"}
          data={products}
          columns={columns}
          options={options}
        />
      )}
      <Modal isOpen={isModalOpen} onClose={handleCloseModal} title={selectedProduct ? 'Edit Product' : 'Add Product'}>
        <ProductForm product={selectedProduct} onSubmit={handleProductSubmit} />
      </Modal>
      <Dialog
        open={isDeleteDialogOpen}
        onClose={handleCloseDeleteDialog}
      >
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete the selected product(s)?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDeleteProduct} color="secondary" disabled={isDeleting}>
            {isDeleting ? <CircularLoader /> : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
    </AdminLayout>
  );
};

export default Products;