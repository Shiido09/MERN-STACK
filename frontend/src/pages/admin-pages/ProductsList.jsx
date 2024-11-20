import React, { useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { IconButton, Button, TextField } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AdminLayout from './AdminLayout';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts, deleteProduct, deleteSelectedProducts } from '../../slices/productSlice';
import ProductForm from './ProductForm'; // Ensure this path is correct
import Modal from './Modal'; // Import the new Modal component
import CircularLoader from '../../components/loader/CircularLoader'; // Adjust the import path as needed

const Products = () => {
  const dispatch = useDispatch();
  const { products, loading } = useSelector((state) => state.products);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRows, setSelectedRows] = useState([]);
  const [sortModel, setSortModel] = useState([
    {
      field: 'product_name',
      sort: 'asc',
    },
  ]);

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
    dispatch(fetchProducts()); // Optionally refresh the product list after closing
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const filteredProducts = products.filter(product =>
    product.product_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.price.toString().includes(searchQuery) ||
    product.stocks.toString().includes(searchQuery) ||
    product.explanation.toLowerCase().includes(searchQuery) || // Ensure explanation is included in search
    product._id.toString().includes(searchQuery)
  );

  const columns = [
    { field: 'id', headerName: 'ID', width: 90 },
    { field: 'product_name', headerName: 'Product Name', width: 150 },
    { field: 'category', headerName: 'Category', width: 150 },
    { field: 'price', headerName: 'Price', width: 120 },
    { field: 'stocks', headerName: 'Stocks', width: 120 },
    { field: 'explanation', headerName: 'Explanation', width: 200 }, // Ensure explanation is included in columns
    {
      field: 'product_images',
      headerName: 'Product Images',
      width: 200,
      renderCell: (params) => (
        <div style={{ display: 'flex', flexWrap: 'wrap' }}>
          {params.value.map((image, index) => (
            <img 
              key={index}
              src={image.url} 
              alt={`Product ${params.row.product_name}`} 
              style={{ width: '50px', height: '50px', margin: '2px' }} 
            />
          ))}
        </div>
      ),
    },
    {
      field: 'action',
      headerName: 'Actions',
      width: 160,
      renderCell: (params) => (
        <>
          <IconButton color="primary" onClick={() => handleEdit(params.row)}>
            <EditIcon />
          </IconButton>
          <IconButton color="secondary" onClick={() => dispatch(deleteProduct(params.row.id))}>
            <DeleteIcon />
          </IconButton>
        </>
      ),
    },
  ];

  return (
    <AdminLayout>
      <h2 className="text-2xl font-semibold">Products</h2>
      <Button variant="contained" color="primary" onClick={handleOpenModal} style={{ marginBottom: '20px' }}>
        Add Product
      </Button>
      <Button variant="contained" color="secondary" onClick={() => dispatch(deleteSelectedProducts(selectedRows))} style={{ marginBottom: '20px', marginLeft: '10px' }}>
        Delete Selected
      </Button>
      <br /> {/* Add breakline here */}
      <TextField
        label="Search Products"
        variant="outlined"
        value={searchQuery}
        onChange={handleSearchChange}
        style={{ marginBottom: '20px', width: '50%' }} // Adjust the width to make it smaller
      />
      {loading ? (
        <CircularLoader />
      ) : (
        <div style={{ height: 400, width: '100%', marginTop: '20px' }}>
          <DataGrid 
            rows={filteredProducts} 
            columns={columns} 
            pageSize={5} 
            rowsPerPageOptions={[5]} 
            checkboxSelection 
            disableSelectionOnClick 
            getRowId={(row) => row._id} // Use the _id property as the unique identifier for each row
            sortModel={sortModel}
            onSortModelChange={(model) => setSortModel(model)}
            onRowSelectionModelChange={(newSelection) => {
              setSelectedRows(newSelection);
            }}
          />
        </div>
      )}
      <Modal isOpen={isModalOpen} onClose={handleCloseModal} title={selectedProduct ? 'Edit Product' : 'Add Product'}>
        <ProductForm product={selectedProduct} onSubmit={handleCloseModal} />
      </Modal>
    </AdminLayout>
  );
};

export default Products;