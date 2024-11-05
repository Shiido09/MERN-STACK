import React, { useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { IconButton, Button } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AdminLayout from './AdminLayout';
import axios from 'axios';
import ProductForm from './ProductForm'; // Ensure this path is correct
import Modal from './Modal'; // Import the new Modal component

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const fetchProducts = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/products', { withCredentials: true });
      const productsWithId = response.data.products.map(product => ({
        id: product._id,
        product_name: product.product_name,
        price: product.price,
        stocks: product.stocks,
        brand_name: product.brand.brand_name,
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
      } catch (error) {
        console.error("Error deleting product:", error);
        alert("Failed to delete the product. Please try again later.");
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

  const columns = [
    { field: 'id', headerName: 'ID', width: 90 },
    { field: 'product_name', headerName: 'Product Name', width: 150 },
    { field: 'brand_name', headerName: 'Brand Name', width: 150 },
    { field: 'price', headerName: 'Price', width: 120 },
    { field: 'stocks', headerName: 'Stocks', width: 120 },
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
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div style={{ height: 400, width: '100%', marginTop: '20px' }}>
          <DataGrid 
            rows={products} 
            columns={columns} 
            pageSize={5} 
            rowsPerPageOptions={[5]} 
            checkboxSelection 
            disableSelectionOnClick 
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
