import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { toast } from 'react-toastify';

export const fetchProducts = createAsyncThunk('products/fetchProducts', async () => {
  const response = await axios.get('http://localhost:5000/api/products', { withCredentials: true });
  return response.data.products;
});

export const createProduct = createAsyncThunk('products/createProduct', async (formData, { dispatch }) => {
  await axios.post('http://localhost:5000/api/products', formData, { withCredentials: true });
  dispatch(fetchProducts());
  toast.success('Product created successfully!');
});

export const updateProduct = createAsyncThunk('products/updateProduct', async ({ id, formData }, { dispatch }) => {
  await axios.put(`http://localhost:5000/api/products/${id}`, formData, { withCredentials: true });
  dispatch(fetchProducts());
  toast.success('Product updated successfully!');
});

export const deleteProduct = createAsyncThunk('products/deleteProduct', async (id, { dispatch }) => {
  await axios.delete(`http://localhost:5000/api/products/${id}`, { withCredentials: true });
  dispatch(fetchProducts());
  toast.success('Product deleted successfully!');
});

export const deleteSelectedProducts = createAsyncThunk('products/deleteSelectedProducts', async (selectedRows, { dispatch }) => {
  await Promise.all(selectedRows.map(id => axios.delete(`http://localhost:5000/api/products/${id}`, { withCredentials: true })));
  dispatch(fetchProducts());
  toast.success('Selected products deleted successfully!');
});

const productsSlice = createSlice({
  name: 'products',
  initialState: {
    products: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default productsSlice.reducer;