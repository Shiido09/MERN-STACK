import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts } from '../../slices/productSlice';
import Header from './Header'; // Assuming you have a Header component

const ProductPage = () => {
  const [filters, setFilters] = useState({
    selectedCategories: [],
    selectedPriceRanges: [],
    searchQuery: '',
  });

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0); // To track the current image index

  const dispatch = useDispatch();
  const { products, loading, error } = useSelector((state) => state.products);

  useEffect(() => {
    // Fetch products with filters when component mounts or filters change
    if (filters) {
      dispatch(fetchProducts({ filters }));
    }
  }, [dispatch, filters]);

  const handleSearchChange = (event) => {
    setFilters((prev) => ({ ...prev, searchQuery: event.target.value }));
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
    setCurrentImageIndex(0); // Reset image index when a product is selected
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedProduct(null);
  };

  const handleNextImage = () => {
    if (selectedProduct && selectedProduct.product_images) {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % selectedProduct.product_images.length);
    }
  };

  const handlePreviousImage = () => {
    if (selectedProduct && selectedProduct.product_images) {
      setCurrentImageIndex(
        (prevIndex) =>
          (prevIndex - 1 + selectedProduct.product_images.length) % selectedProduct.product_images.length
      );
    }
  };

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
        <div className="w-1/8 p-4 bg-stone-100 rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold mb-4">Filters</h2>

          {/* Search Bar */}
          <div className="mb-4">
            <input
              type="text"
              placeholder="Search Products..."
              value={filters.searchQuery}
              onChange={handleSearchChange}
              className="w-full p-2 border rounded-lg"
            />
          </div>

          {/* Categories Filter */}
          <div className="mb-4">
            <h3 className="text-lg font-semibold mb-2">Categories</h3>
            {[
              'Kitchen Appliances',
              'Laundry Appliances',
              'Cleaning Appliances',
              'Home Comfort Appliances',
              'Small Appliances',
              'Personal Care Appliances',
              'Outdoor Appliances',
              'Smart Appliances',
            ].map((category) => (
              <div key={category} className="flex items-center">
                <input
                  type="checkbox"
                  value={category}
                  checked={filters.selectedCategories.includes(category)}
                  onChange={handleFilterChange('selectedCategories')}
                  className="mr-2"
                />
                <label>{category}</label>
              </div>
            ))}
          </div>

          {/* Price Range Filter */}
          <div className="mb-4">
            <h3 className="text-lg font-semibold mb-2">Price Range</h3>
            {['Under $5000', '$5000 - $10000', 'Above $10000'].map((range) => (
              <div key={range} className="flex items-center">
                <input
                  type="checkbox"
                  value={range}
                  checked={filters.selectedPriceRanges.includes(range)}
                  onChange={handleFilterChange('selectedPriceRanges')}
                  className="mr-2"
                />
                <label>{range}</label>
              </div>
            ))}
          </div>
        </div>

        {/* Products Display Area */}
        <div className="w-3/4 pl-6">
          <h2 className="text-2xl font-bold mb-6">Products</h2>
          {loading ? (
            <p>Loading...</p>
          ) : error ? (
            <p>Error loading products: {error}</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.length > 0 ? (
                products.map((product) => (
                  <div
                    key={product._id}
                    className="border rounded-lg shadow-lg p-4 bg-stone-100 transform transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-xl hover:bg-stone-200"
                  >
                    <img
                      src={product.product_images[0]?.url}
                      alt={product.product_name}
                      className="w-full h-48 object-cover rounded-lg mb-4"
                    />
                    <h3 className="text-lg font-semibold">{product.product_name}</h3>
                    <p className="text-sm text-gray-600">{product.category}</p>
                    <div className="mb-2">{renderStarRating(product.numOfReviews)}</div>
                    <p className="text-xl font-bold text-slate-800">${product.price.toFixed(2)}</p>

                    {/* Stock and Quantity Selector */}
                    <div className="mb-4">
                      <label htmlFor={`quantity-${product._id}`} className="text-sm font-semibold">
                        Quantity
                      </label>
                      <div className="flex items-center space-x-2 mt-2">
                        <input
                          id={`quantity-${product._id}`}
                          type="number"
                          min="1"
                          max={product.stocks} // Prevent exceeding available stock
                          defaultValue="1"
                          className="w-16 p-2 border rounded-md"
                        />
                        <p className="text-sm text-gray-500">Stock: {product.stocks}</p>
                      </div>
                    </div>

                    {/* Add to Cart Button */}
                    <button
                      onClick={() => handleAddToCart(product)}
                      className="inline-block mt-4 mr-12 px-6 py-2 text-slate-600 bg-transparent rounded-lg hover:bg-stone-500 hover:text-white"
                    >
                      🛒
                    </button>

                    {/* View Details Button */}
                    <button
                      onClick={() => handleViewDetails(product)}
                      className="inline-block mt-4 ml-24 px-6 py-2 text-slate-600 bg-transparent rounded-lg hover:bg-stone-500 hover:text-white"
                    >
                      ℹ️
                    </button>
                  </div>
                ))
              ) : (
                <p>No products found</p>
              )}
            </div>
          )}
        </div>

      </div>
      {/* Modal for Product Details */}
      {showModal && selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 transition-opacity duration-300 ease-in-out opacity-100">
          <div className="bg-stone-100 p-6 rounded-lg shadow-lg w-1/3">
            <h2 className="text-2xl font-bold mb-4">{selectedProduct.product_name}</h2>

            {/* Image Section - Centered Image */}
            <div className="mb-4 flex justify-center items-center">
              <img
                src={selectedProduct.product_images[currentImageIndex]?.url}
                alt={selectedProduct.product_name}
                className="w-96 h-96 object-contain rounded-lg mb-4" // Image with fixed size
              />
            </div>

            {/* Image Navigation */}
            <div className="flex justify-between mb-4">
              <button
                onClick={handlePreviousImage}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
              >
                Previous
              </button>
              <button
                onClick={handleNextImage}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
              >
                Next
              </button>
            </div>

            {/* Product Details */}
            <p className="mb-4">{selectedProduct.explanation}</p>
            <p className="mb-4 text-xl font-semibold">
              Price: ${selectedProduct.price.toFixed(2)}
            </p>

            {/* Stock Information */}
            <p className="mb-4 text-sm text-gray-500">Stock: {selectedProduct.stocks}</p>

            {/* Close Button */}
            <button
              onClick={handleCloseModal}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
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
