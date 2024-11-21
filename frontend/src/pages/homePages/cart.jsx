import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Header from './Header'; 
import { FaTrashAlt } from 'react-icons/fa';
import { FiArrowRight } from 'react-icons/fi';
import { FaExclamationTriangle } from 'react-icons/fa'; // Import the warning icon
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify'; // Import Toastify
import 'react-toastify/dist/ReactToastify.css'; // Import Toastify styles

const CartPage = () => {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [itemToRemove, setItemToRemove] = useState(null);
  const [selectedItems, setSelectedItems] = useState([]); // State to track selected items
  const [selectAll, setSelectAll] = useState(false); // State to track "Select All" checkbox

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const user = JSON.parse(localStorage.getItem('user'));
        if (!user || !user._id) {
          setError('User not found in local storage.');
          return;
        }

        const response = await axios.get(`http://localhost:5000/api/auth/${user._id}/cart`);
        setCart(response.data);
      } catch (err) {
        setError(err.message || 'Failed to fetch cart data.');
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, []);

  const updateQuantity = async (id, newQuantity) => {
    if (newQuantity <= 0) return;

    try {
      const user = JSON.parse(localStorage.getItem('user'));
      const response = await axios.put(`http://localhost:5000/api/auth/${user._id}/cart/${id}`, {
        quantity: newQuantity
      });

      const updatedCart = await axios.get(`http://localhost:5000/api/auth/${user._id}/cart`);
      setCart(updatedCart.data);
    } catch (err) {
      setError(err.message || 'Failed to update quantity.');
    }
  };

  const removeItem = async (id) => {
    const user = JSON.parse(localStorage.getItem('user'));
    try {
      await axios.delete(`http://localhost:5000/api/auth/${user._id}/cart/${id}`);
      const updatedCart = await axios.get(`http://localhost:5000/api/auth/${user._id}/cart`);
      setCart(updatedCart.data);
      setModalVisible(false); // Close the modal after successful removal

      // Show success toast after item is removed
      toast.success('Item removed successfully!');
    } catch (err) {
      setError(err.message || 'Failed to remove item.');
    }
  };

  const calculateTotal = () => {
    return cart.reduce((total, item) => {
      const price = item.product.price || 0;
      const quantity = item.quantity || 0;
      if (selectedItems.includes(item.product._id)) {
        return total + price * quantity;
      }
      return total;
    }, 0);
  };

  const handleSelectItem = (id) => {
    setSelectedItems((prevSelectedItems) =>
      prevSelectedItems.includes(id)
        ? prevSelectedItems.filter((itemId) => itemId !== id)
        : [...prevSelectedItems, id]
    );
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedItems([]); // Deselect all
    } else {
      setSelectedItems(cart.map((item) => item.product._id)); // Select all
    }
    setSelectAll(!selectAll); // Toggle the Select All checkbox
  };

  const showModal = (id) => {
    setItemToRemove(id); // Set the item that will be removed
    setModalVisible(true); // Show the modal
  };

  const hideModal = () => {
    setModalVisible(false); // Hide the modal
    setItemToRemove(null); // Clear the item to remove
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="bg-stone-300 min-h-screen">
      <Header />
      <div className="container mx-auto p-8 mt-16 flex flex-col lg:flex-row space-x-0 lg:space-x-8">
        <div className="flex-1">
          <h1 className="text-3xl font-bold mb-6 text-primary">
            Your Cart ({cart.length} items)
          </h1>

          {/* Select All Checkbox */}
          <div className="flex items-center mb-4">
            <input
              type="checkbox"
              id="selectAll"
              checked={selectAll}
              onChange={handleSelectAll}
              className="mr-2"
            />
            <label htmlFor="selectAll" className="text-lg text-primary">
              Select All
            </label>
          </div>

          <div className="max-h-[500px] overflow-y-auto space-y-6 pr-4">
            {cart.length === 0 ? (
              <p className="text-lg text-gray-500">Your cart is empty.</p>
            ) : (
              cart.map((item, index) => (
                <div key={item.product._id}>
                  <div className="flex items-center justify-between bg-white shadow-lg p-6 rounded-lg">
                    <div className="flex items-center space-x-6">
                      <input
                        type="checkbox"
                        checked={selectedItems.includes(item.product._id)}
                        onChange={() => handleSelectItem(item.product._id)}
                        className="mr-4"
                      />
                      <img
                        src={Array.isArray(item.product.product_images) && item.product.product_images.length > 0
                          ? item.product.product_images[0].url
                          : '/path/to/fallback-image.jpg'}
                        alt={item.product.name}
                        className="w-24 h-24 object-cover rounded"
                      />
                      <div>
                        <h2 className="text-xl font-semibold text-primary">
                          {item.product.name || item.product.product_name}
                        </h2>
                        <p className="text-gray-600">Price: £{item.product.price}</p>
                        <p className="text-gray-500">Product Name: {item.product.product_name}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-6">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() =>
                            updateQuantity(item.product._id, item.quantity - 1)
                          }
                          className="px-2 py-1 bg-gray-200 rounded-lg hover:bg-gray-300"
                        >
                          -
                        </button>
                        <input
                          type="number"
                          value={item.quantity}
                          min="1"
                          className="w-12 text-center border rounded"
                          onChange={(e) =>
                            updateQuantity(item.product._id, +e.target.value)
                          }
                        />
                        <button
                          onClick={() =>
                            updateQuantity(item.product._id, item.quantity + 1)
                          }
                          className="px-2 py-1 bg-gray-200 rounded-lg hover:bg-gray-300"
                        >
                          +
                        </button>
                      </div>
                      <p className="text-lg font-semibold text-primary">
                        £{(item.product.price * item.quantity).toFixed(2)}
                      </p>
                      <button
                        onClick={() => showModal(item.product._id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <FaTrashAlt />
                      </button>
                    </div>
                  </div>
                  {index < cart.length - 1 && <div className="border-t my-4"></div>}
                </div>
              ))
            )}
          </div>
        </div>
        <div className="w-full lg:w-1/3 space-y-6 mt-6 lg:mt-0">
          <div className="bg-stone-100 p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold text-primary">Cart Summary</h2>
            <div className="mt-4 flex justify-between text-lg font-semibold">
              <span>Total:</span>
              <span>£{calculateTotal().toFixed(2)}</span>
            </div>
            <Link
              to="/checkout"
              className="w-full mt-8 px-6 py-3 bg-slate-900 text-white font-semibold rounded-lg hover:bg-primary-dark transition text-center block"
            >
              <span className="ml-16 flex items-center space-x-2">
                <span>Proceed to Checkout</span>
                <FiArrowRight className="text-xl" />
              </span>
            </Link>
            <p className="text-center text-sm text-gray-500">
              Items placed in this cart are not reserved.
            </p>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {modalVisible && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
            <h3 className="text-lg font-semibold text-center mb-4">Are you sure you want to remove this item from your cart?</h3>

            {/* Centered Warning Icon below the question */}
            <div className="flex justify-center mb-4">
              <FaExclamationTriangle className="text-red-500 text-7xl" />
            </div>

            <div className="mt-4 flex justify-end space-x-4">
              <button
                onClick={() => {
                  removeItem(itemToRemove);
                }}
                className="bg-red-500 mr-44 text-white py-1 px-4 rounded-lg hover:bg-red-600"
              >
                Yes, Remove
              </button>
              <button
                onClick={hideModal}
                className="bg-gray-500 text-white py-1 px-4 rounded-lg hover:bg-gray-600"
              >
                No, Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Container */}
      <ToastContainer />
    </div>
  );
};

export default CartPage;
