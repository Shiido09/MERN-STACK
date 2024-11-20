import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Header from './Header'; // Assuming you have a Header component

const ProductPage = () => {
  const categories = [
    { id: 1, name: 'Kitchen Appliances' },
    { id: 2, name: 'Laundry Appliances' },
    { id: 3, name: 'Cleaning Appliances' },
    { id: 4, name: 'Home Comfort Appliances' },
    { id: 5, name: 'Small Appliances' },
    { id: 6, name: 'Personal Care Appliances' },
    { id: 7, name: 'Outdoor Appliances' },
    { id: 8, name: 'Smart Appliances' },
  ];

  const brands = ['Brand A', 'Brand B', 'Brand C'];
  const priceRanges = ['Under $100', '$100 - $300', 'Above $300'];

  const [filters, setFilters] = useState({
    categories: [],
    brands: [],
    priceRanges: [],
  });

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleFilterChange = (type) => (event) => {
    const { value, checked } = event.target;

    setFilters((prev) => {
      const updatedFilters = { ...prev };
      const selectedArray = updatedFilters[type];

      if (checked) {
        updatedFilters[type] = [...selectedArray, value];
      } else {
        updatedFilters[type] = selectedArray.filter((item) => item !== value);
      }

      return updatedFilters;
    });
  };

  const handleViewDetails = (product) => {
    setSelectedProduct(product);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedProduct(null);
  };

  // Example products with images, descriptions, and reviews
  const products = [
    { id: 1, name: 'Blender', category: 'Kitchen Appliances', brand: 'Brand A', price: 99.99, imageUrl: '/images/landing1.jpg', description: 'High-performance blender for smoothies and soups.', reviews: 4, otherInfo: 'Comes with 2-year warranty.' },
    { id: 2, name: 'Washing Machine', category: 'Laundry Appliances', brand: 'Brand B', price: 499.99, imageUrl: '/images/landing1.jpg', description: 'Energy-efficient washing machine with multiple cycles.', reviews: 4.5, otherInfo: '12-month warranty.' },
    { id: 3, name: 'Robot Vacuum', category: 'Cleaning Appliances', brand: 'Brand A', price: 199.99, imageUrl: '/images/landing1.jpg', description: 'Smart vacuum cleaner with automatic charging.', reviews: 4.7, otherInfo: 'Includes 3 cleaning modes.' },
    { id: 4, name: 'Air Purifier', category: 'Home Comfort Appliances', brand: 'Brand C', price: 299.99, imageUrl: '/images/landing1.jpg', description: 'HEPA filter air purifier for better air quality.', reviews: 4.8, otherInfo: 'Ideal for large rooms.' },
    { id: 5, name: 'Iron', category: 'Laundry Appliances', brand: 'Brand C', price: 59.99, imageUrl: '/images/landing1.jpg', description: 'Steam iron with quick heat-up time and anti-drip feature.', reviews: 3, otherInfo: 'Lightweight design.' },
  ];

  const filteredProducts = products.filter((product) => {
    const matchesCategory =
      filters.categories.length > 0 ? filters.categories.includes(product.category) : true;
    const matchesBrand = filters.brands.length > 0 ? filters.brands.includes(product.brand) : true;
    const matchesPriceRange =
      filters.priceRanges.length > 0
        ? filters.priceRanges.some((range) => {
            if (range === 'Under $100') return product.price < 100;
            if (range === '$100 - $300') return product.price >= 100 && product.price <= 300;
            if (range === 'Above $300') return product.price > 300;
            return false;
          })
        : true;

    const matchesSearchQuery =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesBrand && matchesPriceRange && matchesSearchQuery;
  });

  const renderStarRating = (rating) => {
    const filledStars = Math.floor(rating);
    const emptyStars = 5 - filledStars;
    const halfStar = rating % 1 >= 0.5 ? 1 : 0;

    return (
      <div className="flex items-center">
        {[...Array(filledStars)].map((_, index) => (
          <span key={`filled-${index}`} className="text-yellow-500">⭐</span>
        ))}
        {halfStar === 1 && <span className="text-yellow-500">⭐</span>}
        {[...Array(emptyStars)].map((_, index) => (
          <span key={`empty-${index}`} className="text-gray-400">⭐</span>
        ))}
      </div>
    );
  };

  return (
    <div>
      <Header />

      <div className="min-h-screen bg-stone-300 p-6 flex">
        {/* Filters Section (Sidebar) */}
        <div className="w-1/6 p-4 bg-stone-100 rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold mb-4">Filters</h2>

          {/* Search Bar */}
          <div className="mb-4">
            <input
              type="text"
              placeholder="Search Products..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="w-full p-2 border rounded-lg"
            />
          </div>

          {/* Categories Filter */}
          <div className="mb-4">
            <h3 className="text-lg font-semibold mb-2">Categories</h3>
            <div className="space-y-1 text-sm">
              {categories.map((category) => (
                <div key={category.id} className="flex items-center">
                  <input
                    type="checkbox"
                    id={`category-${category.id}`}
                    value={category.name}
                    checked={filters.categories.includes(category.name)}
                    onChange={handleFilterChange('categories')}
                    className="mr-2"
                  />
                  <label htmlFor={`category-${category.id}`} className="text-sm">
                    {category.name}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Brand Filter */}
          <div className="mb-4">
            <h3 className="text-lg font-semibold mb-2">Brand</h3>
            <div className="space-y-1 text-sm">
              {brands.map((brand, index) => (
                <div key={index} className="flex items-center">
                  <input
                    type="checkbox"
                    id={`brand-${brand}`}
                    value={brand}
                    checked={filters.brands.includes(brand)}
                    onChange={handleFilterChange('brands')}
                    className="mr-2"
                  />
                  <label htmlFor={`brand-${brand}`} className="text-sm">
                    {brand}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Price Range Filter */}
          <div className="mb-4">
            <h3 className="text-lg font-semibold mb-2">Price Range</h3>
            <div className="space-y-1 text-sm">
              {priceRanges.map((range, index) => (
                <div key={index} className="flex items-center">
                  <input
                    type="checkbox"
                    id={`price-${range}`}
                    value={range}
                    checked={filters.priceRanges.includes(range)}
                    onChange={handleFilterChange('priceRanges')}
                    className="mr-2"
                  />
                  <label htmlFor={`price-${range}`} className="text-sm">
                    {range}
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Products Display Area */}
        <div className="w-3/4 pl-6">
          <h2 className="text-2xl font-bold mb-6">Products</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product) => (
                <div key={product.id} className="border rounded-lg shadow-lg p-4 bg-stone-100 transform transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-xl hover:bg-stone-200">
                  <img src={product.imageUrl} alt={product.name} className="w-full h-48 object-cover rounded-lg mb-4" />
                  <h3 className="text-lg font-semibold">{product.name}</h3>
                  <p className="text-sm text-gray-600">{product.category}</p>
                  <p className="text-sm text-gray-600">{product.brand}</p>
                  <div className="mb-2">{renderStarRating(product.reviews)}</div>
                  <p className="text-xl font-bold text-indigo-500">${product.price.toFixed(2)}</p>
                  <button
                    onClick={() => handleViewDetails(product)}
                    className="inline-block mt-4 px-6 py-2 text-white bg-indigo-500 rounded-lg hover:bg-indigo-600"
                  >
                    View Details
                  </button>
                </div>
              ))
            ) : (
              <p>No products found</p>
            )}
          </div>
        </div>
      </div>

      {/* Modal for Product Details */}
      {showModal && selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-lg w-full">
            <h3 className="text-2xl font-bold mb-4">{selectedProduct.name}</h3>
            <img src={selectedProduct.imageUrl} alt={selectedProduct.name} className="w-full h-64 object-cover rounded-lg mb-4" />
            <p className="text-lg mb-2"><strong>Description:</strong> {selectedProduct.description}</p>
            <p className="text-lg mb-2"><strong>Brand:</strong> {selectedProduct.brand}</p>
            <p className="text-lg mb-2"><strong>Reviews:</strong> {selectedProduct.reviews} stars</p>
            <p className="text-lg mb-2"><strong>Other Info:</strong> {selectedProduct.otherInfo}</p>
            <button
              onClick={handleCloseModal}
              className="mt-4 px-6 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductPage;
