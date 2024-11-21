import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { TextField, Button, Select, MenuItem, InputLabel, FormControl, Box, Typography, IconButton } from '@mui/material';
import { toast } from 'react-toastify';
import DeleteIcon from '@mui/icons-material/Delete';
import CircularLoader from '../../components/loader/CircularLoader';
import { useFormik } from 'formik';
import * as Yup from 'yup';

const ProductForm = ({ onSubmit, product }) => {
  const dispatch = useDispatch();
  const globalLoading = useSelector((state) => state.products.loading);
  const [localLoading, setLocalLoading] = useState(false);
  const [existingImages, setExistingImages] = useState(product ? product.product_images : []);

  const validationSchema = Yup.object({
    productName: Yup.string().required('Product name is required'),
    price: Yup.number().typeError('Price must be a number').required('Price is required'),
    stocks: Yup.number().typeError('Stocks must be a number').required('Stocks are required'),
    category: Yup.string().required('Category is required'),
    images: Yup.array().min(1, 'At least one image is required')
  });

  const formik = useFormik({
    initialValues: {
      productName: product ? product.product_name : '',
      price: product ? product.price : '',
      stocks: product ? product.stocks : '',
      category: product ? product.category : '',
      images: []
    },
    validationSchema,
    onSubmit: async (values) => {
      setLocalLoading(true);
      const formData = new FormData();
      formData.append('product_name', values.productName);
      formData.append('price', values.price);
      formData.append('stocks', values.stocks);
      formData.append('category', values.category);
      formData.append('explanation', values.explanation);
      values.images.forEach((image) => {
        formData.append('product_images', image);
      });

      try {
        await onSubmit(formData, !!product);
        setLocalLoading(false);
      } catch (error) {
        console.error("Error submitting product form:", error);
        toast.error("Failed to submit the product form. Please try again later.");
        setLocalLoading(false);
      }
    }
  });

  const handleImageChange = (e) => {
    formik.setFieldValue('images', Array.from(e.target.files));
  };

  const handleRemoveExistingImage = (index) => {
    const imageToRemove = existingImages[index];
    setExistingImages(existingImages.filter((_, i) => i !== index));
  };

  return (
    <Box component="form" onSubmit={formik.handleSubmit} sx={{ mt: 3 }}>
      {globalLoading ? (
        <CircularLoader />
      ) : (
        <>
          <Typography variant="h5" component="h1" gutterBottom>
            {product ? 'Edit Product' : 'Add Product'}
          </Typography>
          <TextField
            label="Product Name"
            name="productName"
            value={formik.values.productName}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            fullWidth
            margin="normal"
            error={formik.touched.productName && Boolean(formik.errors.productName)}
            helperText={formik.touched.productName && formik.errors.productName}
          />
          <TextField
            label="Price"
            name="price"
            type="number"
            value={formik.values.price}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            fullWidth
            margin="normal"
            error={formik.touched.price && Boolean(formik.errors.price)}
            helperText={formik.touched.price && formik.errors.price}
          />
          <TextField
            label="Stocks"
            name="stocks"
            type="number"
            value={formik.values.stocks}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            fullWidth
            margin="normal"
            error={formik.touched.stocks && Boolean(formik.errors.stocks)}
            helperText={formik.touched.stocks && formik.errors.stocks}
          />
          <FormControl fullWidth margin="normal" error={formik.touched.category && Boolean(formik.errors.category)}>
            <InputLabel>Category</InputLabel>
            <Select
              name="category"
              value={formik.values.category}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
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
            {formik.touched.category && formik.errors.category && (
              <Typography variant="caption" color="error">{formik.errors.category}</Typography>
            )}
          </FormControl>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', mt: 2 }}>
            {existingImages.map((image, index) => (
              <Box key={index} sx={{ position: 'relative', m: 1 }}>
                <img
                  src={image.url}
                  alt={`Product ${formik.values.productName}`}
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
          {formik.touched.images && formik.errors.images && (
            <Typography variant="caption" color="error">{formik.errors.images}</Typography>
          )}
          <Box sx={{ mt: 3 }}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={localLoading}
              fullWidth
            >
              {localLoading ? <CircularLoader /> : (product ? 'Update' : 'Submit')}
            </Button>
          </Box>
        </>
      )}
    </Box>
  );
};

export default ProductForm;