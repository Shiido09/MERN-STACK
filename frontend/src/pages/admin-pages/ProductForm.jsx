import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ProductForm = ({ onSubmit, product }) => {
  const [productName, setProductName] = useState('');
  const [price, setPrice] = useState('');
  const [stocks, setStocks] = useState('');
  const [brandId, setBrandId] = useState('');
  const [brands, setBrands] = useState([]);
  const [images, setImages] = useState([]);

  const fetchBrands = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/brands', { withCredentials: true });
      setBrands(response.data.brands);
    } catch (error) {
      console.error("Error fetching brands:", error);
      alert("Failed to load brands. Please try again later.");
    }
  };

  useEffect(() => {
    fetchBrands();
    
    // If a product is passed, populate the form fields for editing
    if (product) {
      setProductName(product.product_name);
      setPrice(product.price);
      setStocks(product.stocks);
      setBrandId(product.brand); // Assuming product.brand contains the brand ID
      setImages([]); // Reset images, you can load current images if needed
    } else {
      // Reset form for adding new product
      setProductName('');
      setPrice('');
      setStocks('');
      setBrandId('');
      setImages([]);
    }
  }, [product]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('product_name', productName);
    formData.append('price', price);
    formData.append('stocks', stocks);
    formData.append('brand', brandId);
    images.forEach((image) => {
      formData.append('product_images', image);
    });

    try {
      if (product) {
        // If product exists, update it
        await axios.put(`http://localhost:5000/api/products/${product._id}`, formData, { withCredentials: true });
      } else {
        // Otherwise, create a new product
        await axios.post('http://localhost:5000/api/products', formData, { withCredentials: true });
      }
      if (onSubmit) {
        await onSubmit(); // Call the onSubmit prop function to refresh the product list
      }
      // Reset the form
      setProductName('');
      setPrice('');
      setStocks('');
      setBrandId('');
      setImages([]);
    } catch (error) {
      console.error("Error adding/updating product:", error);
      alert("Failed to process the product. Please try again later.");
    }
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages(files);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="product_name">Product Name</label>
        <input
          type="text"
          id="product_name"
          value={productName}
          onChange={(e) => setProductName(e.target.value)}
          required
        />
      </div>
      <div>
        <label htmlFor="price">Price</label>
        <input
          type="number"
          id="price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
        />
      </div>
      <div>
        <label htmlFor="stocks">Stocks</label>
        <input
          type="number"
          id="stocks"
          value={stocks}
          onChange={(e) => setStocks(e.target.value)}
          required
        />
      </div>
      <div>
        <label htmlFor="brand">Brand</label>
        <select
          id="brand"
          value={brandId}
          onChange={(e) => setBrandId(e.target.value)}
          required
        >
          <option value="">Select a brand</option>
          {brands.map((brand) => (
            <option key={brand._id} value={brand._id}>
              {brand.brand_name} {/* Adjust according to your brand object */}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="product_images">Product Images</label>
        <input
          type="file"
          id="product_images"
          multiple
          onChange={handleImageChange}
        />
      </div>
      <button type="submit" className="mt-2 bg-blue-500 text-white p-2 rounded">
        {product ? 'Update' : 'Submit'} {/* Change button text based on edit or add */}
      </button>
    </form>
  );
};

export default ProductForm;
