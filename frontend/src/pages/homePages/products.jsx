import React, { useEffect, useState, useCallback  } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { filterProduct } from '../../slices/productSlice';
import Header from './Header'; // Assuming you have a Header component
import { FaTimes, FaArrowLeft, FaArrowRight, FaCartPlus, FaInfoCircle, FaStar, FaRegStar, FaStarHalfAlt} from 'react-icons/fa';
import { toast } from 'react-toastify';
import axios from 'axios';

const ProductPage = () => {
  const [filters, setFilters] = useState({
    selectedCategories: [],
    selectedPriceRanges: [],
    selectedMinRating: [], // Added selectedMinRating for rating filter
    searchQuery: '',
  });

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0); // To track the current image index
  const [expandedReviews, setExpandedReviews] = useState({}); // Track which reviews are expanded
  const [users, setUsers] = useState({}); // To store the user details by user_id
  const [showReviewsModal, setShowReviewsModal] = useState(false); 
  const [page, setPage] = useState(1); // Track the current page for pagination

  const dispatch = useDispatch();
  const { products, loading, error } = useSelector((state) => state.products);

  // useEffect(() => {
  //   // Fetch products with filters when component mounts or filters change
  //   if (filters) {
  //     dispatch(filterProduct({ filters }));
  //   }
  // }, [dispatch, filters]);

  useEffect(() => {
    dispatch(filterProduct({ filters, page }));
  }, [dispatch, filters, page]);

  // Function to detect when the user has scrolled to the bottom
  const handleScroll = useCallback((event) => {
    const bottom = event.target.scrollHeight === event.target.scrollTop + event.target.clientHeight;
    if (bottom && !loading) {
      setPage((prevPage) => prevPage + 1); // Increment page number to load more products
    }
  }, [loading]);

  useEffect(() => {
    // Add scroll event listener on the product container
    const productContainer = document.getElementById('product-container');
    productContainer.addEventListener('scroll', handleScroll);

    return () => {
      productContainer.removeEventListener('scroll', handleScroll);
    };
  }, [handleScroll]);


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

const handleRatingFilterChange = (rating) => {
  setFilters((prev) => {
    const newSelectedRatings = [...prev.selectedMinRating];

    // If the rating is already selected, remove it (unselect)
    if (newSelectedRatings.includes(rating)) {
      const index = newSelectedRatings.indexOf(rating);
      newSelectedRatings.splice(index, 1); // Remove the rating from the array
    } else {
      newSelectedRatings.push(rating); // Otherwise, add the rating to the array
    }

    return {
      ...prev,
      selectedMinRating: newSelectedRatings, // Update the selected ratings array
    };
  });
};



const renderStarRating = (averageRating) => {
  const stars = [];

  for (let i = 0; i < 5; i++) {
    if (i < Math.floor(averageRating)) {
      // Full star
      stars.push(<FaStar key={i} className="text-yellow-500" />);
    } else if (i < averageRating) {
      // Half star
      stars.push(<FaStarHalfAlt key={i} className="text-yellow-500" />);
    } else {
      // Empty star
      stars.push(<FaRegStar key={i} className="text-gray-300" />);
    }
  }

  return <div className="flex">{stars}</div>; // Wrap in a flex container for alignment
};


  const handleViewDetails = (product) => {
    setSelectedProduct(product);
    setShowModal(true);
    setCurrentImageIndex(0); // Reset image index when a product is selected
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setShowReviewsModal(false);
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

  
  

  const getUserId = () => {
    const user = JSON.parse(localStorage.getItem('user')); // Parse the JSON string back to an object
    return user ? user._id : null; // Return the user ID if it exists, otherwise null
  };

  const handleAddToCart = async (productId, quantity) => {
    try {
      const userId = getUserId(); // Get the user ID from localStorage

      // If no user ID is found in localStorage, handle the case (e.g., redirect to login)
      if (!userId) {
        console.error("User not logged in");
        toast.error("You need to log in first!"); // Show error message with Toastify
        return;
      }

      const response = await axios.post('http://localhost:5000/api/auth/add',
        {
          productId,
          quantity,
        },
        {
          headers: {
            'Authorization': `Bearer ${userId}`, // Assuming the user ID or token is passed in the Authorization header
          },
        }
      );

      // Log the success message to the console
      console.log('Product added to cart:', response.data);

      // Show success message with Toastify
      toast.success("Product added to cart successfully!");
    } catch (error) {
      console.error('Error adding to cart:', error);

      // Show error message with Toastify
      toast.error("Error adding product to cart. Please try again.");
    }
  };

  // Toggle the expanded state of a specific review
  const handleToggleReview = (index) => {
    setExpandedReviews((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };
  const handleOpenReviewsModal = (product) => {
    if (product && product.reviews) {
      setSelectedProduct(product);
      setShowReviewsModal(true);
    } else {
      console.log("No reviews available for this product");
    }
  };
  

  const handleCloseReviewsModal = () => {
    setShowReviewsModal(false);

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
            {['Under ₱5000', '₱5000 - ₱10000', 'Above ₱10000'].map((range) => (
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

          {/* Rating Filter */}
          <div className="mb-4">
  <h3 className="text-lg font-semibold mb-2">Rating</h3>
  {[1, 2, 3, 4, 5].map((rating) => (
    <div key={rating} className="flex items-center">
      <input
        type="checkbox"
        value={rating}
        checked={filters.selectedMinRating.includes(rating)} // Check if the rating is in the selected array
        onChange={() => handleRatingFilterChange(rating)} // Toggle rating
        className="mr-2"
      />
      <label>{renderStarRating(rating)}</label>
    </div>
  ))}
</div>

        </div>

        {/* Product Listing Section */}
        <div className="w-8/8 mb-12 ml-6" id="product-container" style={{ height: '120vh', overflowY: 'auto' }}>
          <h2 className="text-3xl font-semibold mb-4">Products</h2>

          {/* Product Cards */}
          <div className="grid grid-cols-3 gap-4">
            {loading ? (
              <p>Loading...</p>
            ) : error ? (
              <p className="text-red-500">Error: {error.message}</p>
            ) : (
              products.map((product) => (
                <div
                  key={product._id}
                  className="p-4 bg-white shadow-lg rounded-lg cursor-pointer hover:scale-105"
                >
                  <img
                    src={product.product_images[0]?.url}
                    alt={product.product_name}
                    className="w-full h-56 object-cover rounded-md mb-4"
                  />
                  <h3 className="text-lg font-semibold">{product.product_name}</h3>
                  <p className="text-sm text-gray-600">{product.category}</p>
                  <div className="mb-2">
                    {renderStarRating(
                      product.reviews?.length > 0
                        ? product.reviews.reduce((acc, review) => acc + review.rating, 0) / product.reviews.length
                        : 0
                    )}
                  </div>

                  <p className="text-xl font-bold text-slate-800">₱{product.price.toFixed(2)}</p>

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
                    onClick={() => {
                      const quantity = document.getElementById(`quantity-${product._id}`).value; // Get quantity from the input field
                      handleAddToCart(product._id, quantity); // Pass productId and quantity to the backend
                    }}
                    className="inline-block mt-4 mr-12 px-6 py-2 text-slate-600 bg-transparent rounded-lg hover:bg-stone-500 hover:text-white"
                  >
                    <FaCartPlus size={24} /> {/* Cart icon */}
                  </button>



                  <button
                    onClick={() => handleOpenReviewsModal(product)} // Just call the function
                    className="inline-block mt-4 px-6 py-2 text-slate-600 bg-transparent rounded-lg hover:bg-stone-500 hover:text-white"
                  >
                    <FaStar size={24} /> {/* Star icon */}
                  </button>

             
                  {/* View Details Button */}
                  <button
                    onClick={() => handleViewDetails(product)}
                    className="inline-block mt-4 ml-12 px-6 py-2 text-slate-600 bg-transparent rounded-lg hover:bg-stone-500 hover:text-white"
                  >
                    <FaInfoCircle size={24} /> {/* Info icon */}
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {loading && <div className="text-center mt-4">Loading more products...</div>}

      {showReviewsModal && selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-60">
          <div className="bg-white p-6 rounded-lg shadow-lg w-1/2 max-h-[80vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-4">Customer Reviews</h2>

            {/* Reviews Section */}
            <div className="space-y-4">
              {selectedProduct.reviews && selectedProduct.reviews.length > 0 ? (
                selectedProduct.reviews.map((review, index) => (
                  <div key={index} className="border-b py-4">
                    <div className="flex items-center mb-2">
                      {renderStarRating(review.rating)}
                      <p className="ml-2 text-sm text-gray-500">by {review.user.name}</p>
                    </div>

                    {/* Review Dropdown */}
                    <div className="text-sm text-gray-700">
                      {expandedReviews[index] ? (
                        <p>{review.comment}</p>
                      ) : (
                        <p>{review.comment.slice(0, 100)}...</p> // Show preview of the comment
                      )}

                      <button
                        onClick={() => handleToggleReview(index)} // Toggle review expand/collapse
                        className="text-blue-500 mt-2"
                      >
                        {expandedReviews[index] ? 'Show less' : 'Show more'}
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <p>No reviews yet.</p>
              )}
            </div>

            {/* Close Button */}
            <button
              onClick={handleCloseReviewsModal}
              className="px-4 py-2 text-black bg-transparent border border-transparent rounded-lg hover:bg-red-700 mt-4"
            >
              <FaTimes size={24} /> {/* Close icon */}
            </button>
          </div>
        </div>
      )}



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
              {/* Previous Button */}
              <button
                onClick={handlePreviousImage}
                className="px-4 py-2 text-black bg-transparent border border-transparent rounded-lg hover:bg-gray-700"
              >
                <FaArrowLeft size={24} /> {/* Left arrow icon */}
              </button>

              {/* Next Button */}
              <button
                onClick={handleNextImage}
                className="px-4 py-2 text-black bg-transparent border border-transparent rounded-lg hover:bg-gray-700"
              >
                <FaArrowRight size={24} /> {/* Right arrow icon */}
              </button>
            </div>

            {/* Product Details */}
            <p className="mb-4">{selectedProduct.explanation}</p>
            <p className="mb-4 text-xl font-semibold">
              Price: ₱{selectedProduct.price.toFixed(2)}
            </p>

            {/* Stock Information */}
            <p className="mb-4 text-sm text-gray-500">Stock: {selectedProduct.stocks}</p>

          

            {/* Close Button */}
            <button
              onClick={handleCloseModal}
              className="px-4 py-2 text-black bg-transparent border border-transparent rounded-lg hover:bg-red-700"
            >
              <FaTimes size={24} /> {/* Close icon */}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductPage;
