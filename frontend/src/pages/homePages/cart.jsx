import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Header from './Header'; // Assuming you have a Header component
import { FaTrashAlt } from 'react-icons/fa'; // Trash icon for removing items from cart

const CartPage = () => {
  const [cart, setCart] = useState([
    {
      id: 1,
      name: 'Anna Field Waist belt',
      price: 33.98,
      quantity: 2,
      imageUrl: '/images/waist_belt.jpg', // Replace with actual image path
    },
    {
      id: 2,
      name: "Levi's Original Tee",
      price: 23.99,
      quantity: 1,
      imageUrl: '/images/tee.jpg', // Replace with actual image path
    },
    {
      id: 3,
      name: 'Nike Sports Shoes',
      price: 49.99,
      quantity: 1,
      imageUrl: '/images/shoes.jpg', // Replace with actual image path
    },
  ]);

  const [shippingMethod, setShippingMethod] = useState({
    method: 'Standard Delivery',
    cost: 3.99,
  });

  const updateQuantity = (id, newQuantity) => {
    if (newQuantity <= 0) return;
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const removeItem = (id) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== id));
  };

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0) + shippingMethod.cost;
  };

  const handleShippingChange = (e) => {
    const method = e.target.value;
    const cost = method === 'Standard Delivery' ? 3.99 : method === 'Express Delivery' ? 7.99 : 14.99;
    setShippingMethod({ method, cost });
  };

  return (
    <div className="bg-stone-300 min-h-screen">
      <Header />
      <div className="container mx-auto p-8 mt-16 flex flex-col lg:flex-row space-x-0 lg:space-x-8">
        {/* Left Section: Cart Items */}
        <div className="flex-1">
          <h1 className="text-3xl font-bold mb-6 text-primary">Your bag ({cart.length} items)</h1>

          <div className="max-h-[500px] overflow-y-auto space-y-6 pr-4">
            {cart.length === 0 ? (
              <p className="text-lg text-gray-500">Your cart is empty.</p>
            ) : (
              cart.map((item, index) => (
                <div key={item.id}>
                  <div className="flex items-center justify-between bg-white shadow-lg p-6 rounded-lg">
                    <div className="flex items-center space-x-6">
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="w-24 h-24 object-cover rounded"
                      />
                      <div>
                        <h2 className="text-xl font-semibold text-primary">{item.name}</h2>
                        <p className="text-gray-600">Price: £{item.price}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-6">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="px-2 py-1 bg-gray-200 rounded-lg hover:bg-gray-300"
                        >
                          -
                        </button>
                        <input
                          type="number"
                          value={item.quantity}
                          min="1"
                          className="w-12 text-center border rounded"
                          onChange={(e) => updateQuantity(item.id, +e.target.value)}
                        />
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="px-2 py-1 bg-gray-200 rounded-lg hover:bg-gray-300"
                        >
                          +
                        </button>
                      </div>
                      <p className="text-lg font-semibold text-primary">
                        £{(item.price * item.quantity).toFixed(2)}
                      </p>
                      <button
                        onClick={() => removeItem(item.id)}
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

        {/* Right Section */}
        <div className="w-full lg:w-1/3 space-y-6 mt-6 lg:mt-0">
          {/* Shipping Form */}
          <div className="bg-stone-100 p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold text-primary">Shipping Information</h2>
            <label htmlFor="shipping-method" className="block text-gray-600 mt-2">
              Select a shipping method:
            </label>
            <select
              id="shipping-method"
              value={shippingMethod.method}
              onChange={handleShippingChange}
              className="w-full mt-2 p-2 border rounded-lg"
            >
              <option value="Standard Delivery">Standard Delivery (£3.99)</option>
              <option value="Express Delivery">Express Delivery (£7.99)</option>
              <option value="Next-Day Delivery">Next-Day Delivery (£14.99)</option>
            </select>
          </div>

          {/* Summary Section */}
          <div className="bg-stone-100 p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold text-primary">Order Summary</h2>
            <div className="flex justify-between text-lg">
              <span>Subtotal</span>
              <span>£{cart.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-lg">
              <span>Delivery</span>
              <span>£{shippingMethod.cost.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-lg font-semibold">
              <span>Total (VAT included)</span>
              <span>£{calculateTotal().toFixed(2)}</span>
            </div>
            <Link
              to="/checkout"
              className="w-full px-6 py-3 bg-slate-900 text-white font-semibold rounded-lg hover:bg-primary-dark transition text-center block"
            >
              Proceed to Checkout
            </Link>
            <p className="text-center text-sm text-gray-500">
              Items placed in this bag are not reserved.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
