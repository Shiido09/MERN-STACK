import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from './Header'; 
import { FiArrowRight } from 'react-icons/fi';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify'; // Import Toastify
import 'react-toastify/dist/ReactToastify.css'; // Import Toastify styles

const CheckoutPage = () => {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [address, setAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("Credit Card");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState(""); // New email state
  const [shippingCost, setShippingCost] = useState(0);

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

  const calculateTotal = () => {
    return cart.reduce((total, item) => {
      const price = item.product.price || 0;
      const quantity = item.quantity || 0;
      return total + price * quantity;
    }, 0);
  };

  const handleShippingChange = (e) => {
    const selectedAddress = e.target.value;
    setAddress(selectedAddress);

    // Example shipping cost logic based on address
    switch (selectedAddress) {
      case 'Standard Shipping':
        setShippingCost(5);
        break;
      case 'Express Shipping':
        setShippingCost(15);
        break;
      default:
        setShippingCost(0);
        break;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!address || !paymentMethod || !phoneNumber || !email) {
      toast.error('Please fill in all the fields.');
      return;
    }
    
    try {
      // Make a request to create an order (or complete checkout)
      const user = JSON.parse(localStorage.getItem('user'));
      const orderData = {
        userId: user._id,
        items: cart,
        total: calculateTotal() + shippingCost,
        address,
        paymentMethod,
        phoneNumber,
        email // Include email in order data
      };
      const response = await axios.post(`http://localhost:5000/api/orders`, orderData);
      
      toast.success('Checkout successful!');
      // Redirect to order confirmation page or reset cart
    } catch (err) {
      setError(err.message || 'Failed to complete checkout.');
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="bg-stone-300 min-h-screen">
      <Header />
      <div className="container mx-auto p-8 mt-16 flex flex-col lg:flex-row space-x-0 lg:space-x-8">
        <div className="flex-1">
          <h1 className="text-3xl font-bold mb-6 text-primary">Checkout</h1>
          
          <div className="bg-white shadow-lg p-6 rounded-lg mb-6">
            <h2 className="text-xl font-semibold text-primary">Cart Summary</h2>
            <div className="mt-4 space-y-4">
              {cart.map((item) => (
                <div key={item.product._id} className="flex justify-between text-lg">
                  <span>{item.product.name}</span>
                  <span>£{(item.product.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 flex justify-between text-lg font-semibold">
              <span>Total:</span>
              <span>£{calculateTotal().toFixed(2)}</span>
            </div>
          </div>
          
          <form onSubmit={handleSubmit} className="bg-white shadow-lg p-6 rounded-lg">
            <div className="mb-4">
              <label htmlFor="address" className="block text-lg font-semibold text-primary">Shipping Address</label>
              <select
                id="address"
                className="w-full mt-2 p-2 border rounded-lg"
                value={address}
                onChange={handleShippingChange}
              >
                <option value="">Select Shipping Option</option>
                <option value="Standard Shipping">Standard Shipping - £5</option>
                <option value="Express Shipping">Express Shipping - £15</option>
              </select>
            </div>

            <div className="mb-4">
              <label htmlFor="paymentMethod" className="block text-lg font-semibold text-primary">Payment Method</label>
              <select
                id="paymentMethod"
                className="w-full mt-2 p-2 border rounded-lg"
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
              >
                <option value="Credit Card">Credit Card</option>
                <option value="PayPal">PayPal</option>
                <option value="Bank Transfer">Bank Transfer</option>
              </select>
            </div>

            <div className="mb-4">
              <label htmlFor="phoneNumber" className="block text-lg font-semibold text-primary">Phone Number</label>
              <input
                type="text"
                id="phoneNumber"
                className="w-full mt-2 p-2 border rounded-lg"
                placeholder="Enter your phone number"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
              />
            </div>

            <div className="mb-4">
              <label htmlFor="email" className="block text-lg font-semibold text-primary">Email Address</label>
              <input
                type="email"
                id="email"
                className="w-full mt-2 p-2 border rounded-lg"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

          </form>
        </div>

        <div className="w-full lg:w-1/3  space-y-6 mt-6 lg:mt-0">
          <div className="mt-12 bg-stone-100 p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold text-primary">Order Summary</h2>
            <div className="mt-4">
              <ul>
                {cart.map((item) => (
                  <li key={item.product._id} className="flex justify-between text-lg">
                    <span>{item.product.name}</span>
                    <span>£{(item.product.price * item.quantity).toFixed(2)}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="mt-4 flex justify-between text-lg font-semibold">
              <span>Shipping:</span>
              <span>£{shippingCost.toFixed(2)}</span>
            </div>
            <div className="mt-4 flex justify-between text-lg font-semibold">
              <span>Total:</span>
              <span>£{(calculateTotal() + shippingCost).toFixed(2)}</span>
            </div>
            
            <div className="mt-8">
              <button 
                type="submit"
                className="w-full px-6 py-3 bg-slate-900 text-white font-semibold rounded-lg hover:bg-primary-dark transition text-center"
              >
                Complete Checkout
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Toast Container */}
      <ToastContainer />
    </div>
  );
};

export default CheckoutPage;
