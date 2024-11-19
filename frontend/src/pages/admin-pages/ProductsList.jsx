import React, { useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { IconButton, Button, TextField } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AdminLayout from './AdminLayout';
import axios from 'axios';
import ProductForm from './ProductForm'; // Ensure this path is correct
import Modal from './Modal'; // Import the new Modal component
import { toast } from 'react-toastify';
import CircularLoader from '../../components/loader/CircularLoader'; // Adjust the import path as needed

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRows, setSelectedRows] = useState([]);

  const fetchProducts = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/products', { withCredentials: true });
      const productsWithId = response.data.products.map(product => ({
        id: product._id,
        product_name: product.product_name,
        price: product.price,
        stocks: product.stocks,
        category: product.category,
        explanation: product.explanation, // Ensure explanation is included
        product_images: product.product_images,
      }));
      setProducts(productsWithId);
    } catch (error) {
      console.error("Error fetching products:", error);
      alert("Failed to load products. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const deleteProduct = async (id) => {
    const confirmed = window.confirm("Are you sure you want to delete this product?");
    if (confirmed) {
      try {
        await axios.delete(`http://localhost:5000/api/products/${id}`, { withCredentials: true });
        setProducts(products.filter((product) => product.id !== id));
        toast.success('Product deleted successfully!');
      } catch (error) {
        console.error("Error deleting product:", error);
        alert("Failed to delete the product. Please try again later.");
      }
    }
  };

  const deleteSelectedProducts = async () => {
    const confirmed = window.confirm("Are you sure you want to delete the selected products?");
    if (confirmed) {
      try {
        await Promise.all(selectedRows.map(id => axios.delete(`http://localhost:5000/api/products/${id}`, { withCredentials: true })));
        setProducts(products.filter((product) => !selectedRows.includes(product.id)));
        setSelectedRows([]);
        toast.success('Selected products deleted successfully!');
      } catch (error) {
        console.error("Error deleting products:", error);
        alert("Failed to delete the products. Please try again later.");
      }
    }
  };

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
    fetchProducts(); // Optionally refresh the product list after closing
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
    product.id.toString().includes(searchQuery)
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
          <IconButton color="secondary" onClick={() => deleteProduct(params.row.id)}>
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
      <Button variant="contained" color="secondary" onClick={deleteSelectedProducts} style={{ marginBottom: '20px', marginLeft: '10px' }}>
        Delete Selected
      </Button>
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