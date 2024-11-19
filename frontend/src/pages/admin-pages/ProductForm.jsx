import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { TextField, Button, Select, MenuItem, InputLabel, FormControl, Box, Typography, CircularProgress, IconButton } from '@mui/material';
import { toast } from 'react-toastify';
import DeleteIcon from '@mui/icons-material/Delete';

const ProductForm = ({ onSubmit, product }) => {
  const [productName, setProductName] = useState('');
  const [price, setPrice] = useState('');
  const [stocks, setStocks] = useState('');
  const [category, setCategory] = useState('');
  const [explanation, setExplanation] = useState('');
  const [images, setImages] = useState([]);
  const [existingImages, setExistingImages] = useState([]); // To display already uploaded images
  const [imagesToRemove, setImagesToRemove] = useState([]); // To keep track of images to be removed
  const [loading, setLoading] = useState(false); // Loading state

  useEffect(() => {
    // Populate form fields when editing a product
    if (product) {
      setProductName(product.product_name);
      setPrice(product.price);
      setStocks(product.stocks);
      setCategory(product.category); // Assuming product.category contains the category
      setExplanation(product.explanation); // Assuming product.explanation contains the explanation
      setExistingImages(product.product_images); // Load existing images
      setImages([]); // Reset images
    } else {
      // Reset form for adding new product
      setProductName('');
      setPrice('');
      setStocks('');
      setCategory('');
      setExplanation('');
      setExistingImages([]);
      setImages([]);
    }
  }, [product]);

  const handleImageChange = (e) => {
    setImages([...e.target.files]);
  };

  const handleRemoveExistingImage = (index) => {
    const imageToRemove = existingImages[index];
    setImagesToRemove([...imagesToRemove, imageToRemove]);
    setExistingImages(existingImages.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Set loading to true when form is submitted

    const formData = new FormData();
    formData.append('product_name', productName);
    formData.append('price', price);
    formData.append('stocks', stocks);
    formData.append('category', category);
    formData.append('explanation', explanation);
    images.forEach((image) => {
      formData.append('product_images', image);
    });
    formData.append('imagesToRemove', JSON.stringify(imagesToRemove));

    try {
      if (product) {
        // If product exists, update it
        await axios.put(`http://localhost:5000/api/products/${product.id}`, formData, { withCredentials: true });
        toast.success('Product updated successfully!');
      } else {
        // Otherwise, create a new product
        await axios.post('http://localhost:5000/api/products', formData, { withCredentials: true });
        toast.success('Product created successfully!');
      }
      onSubmit(); // Call the onSubmit callback to close the modal and refresh the product list
    } catch (error) {
      console.error("Error submitting product form:", error);
      toast.error("Failed to submit the product form. Please try again later.");
    } finally {
      setLoading(false); // Set loading to false after form submission is complete
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
      <Typography variant="h5" component="h1" gutterBottom>
        {product ? 'Edit Product' : 'Add Product'}
      </Typography>
      <TextField
        label="Product Name"
        value={productName}
        onChange={(e) => setProductName(e.target.value)}
        fullWidth
        required
        margin="normal"
      />
      <TextField
        label="Price"
        type="number"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        fullWidth
        required
        margin="normal"
      />
      <TextField
        label="Stocks"
        type="number"
        value={stocks}
        onChange={(e) => setStocks(e.target.value)}
        fullWidth
        required
        margin="normal"
      />
      <FormControl fullWidth required margin="normal">
        <InputLabel>Category</InputLabel>
        <Select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <MenuItem value="Smart Appliances">Smart Appliances</MenuItem>
          <MenuItem value="Outdoor Appliances">Outdoor Appliances</MenuItem>
          <MenuItem value="Personal Care Appliances">Personal Care Appliances</MenuItem>
          <MenuItem value="Small Appliances">Small Appliances</MenuItem>
          <MenuItem value="Home Comfort Appliances">Home Comfort Appliances</MenuItem>
          <MenuItem value="Cleaning Appliances">Cleaning Appliances</MenuItem>
          <MenuItem value="Laundry Appliances">Laundry Appliances</MenuItem>
          <MenuItem value="Kitchen Appliances">Kitchen Appliances</MenuItem>
        </Select>
      </FormControl>
      <TextField
        label="Explanation"
        value={explanation}
        onChange={(e) => setExplanation(e.target.value)}
        fullWidth
        required
        multiline
        rows={4}
        margin="normal"
      />
      <Box sx={{ display: 'flex', flexWrap: 'wrap', mt: 2 }}>
        {existingImages.map((image, index) => (
          <Box key={index} sx={{ position: 'relative', m: 1 }}>
            <img
              src={image.url}
              alt={`Product ${productName}`}
              style={{ width: '100px', height: '100px', objectFit: 'cover' }}
            />
            <IconButton
              onClick={() => handleRemoveExistingImage(index)}
              sx={{
                position: 'absolute',
                top: 0,
                right: 0,
                background: 'rgba(255, 0, 0, 0.7)',
                color: 'white',
                '&:hover': {
                  background: 'rgba(255, 0, 0, 1)',
                },
              }}
            >
              <DeleteIcon />
            </IconButton>
          </Box>
        ))}
      </Box>
      <Button
        variant="contained"
        component="label"
        sx={{ mt: 2 }}
      >
        Upload New Images
        <input
          type="file"
          hidden
          multiple
          onChange={handleImageChange}
        />
      </Button>
      <Box sx={{ mt: 3 }}>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={loading}
          fullWidth
        >
          {loading ? <CircularProgress size={24} /> : (product ? 'Update' : 'Submit')}
        </Button>
      </Box>
    </Box>
  );
};

export default ProductForm;