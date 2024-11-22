import React, { useState, useEffect } from "react";
import axios from "axios";
import Header from "./Header";
import { FaSpinner } from "react-icons/fa";

const OrderPage = () => {
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    const fetchUserOrders = async () => {
      try {
        const { data } = await axios.get("http://localhost:5000/api/orders/my-orders", {
          withCredentials: true,
        });
        setOrders(data);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserOrders();
  }, []);

  const filteredOrders =
    filter === "All"
      ? orders
      : orders.filter((order) => order.orderStatus === filter);

  return (
    <div className="bg-stone-300 min-h-screen">
      <Header />
      <div className="container mx-auto p-8 mt-16">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-primary">My Orders</h1>
          <div className="flex items-center">
            <label className="text-gray-700 font-semibold mr-4" htmlFor="filter">
              Filter by Status:
            </label>
            <select
              id="filter"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-4 py-2 border rounded-lg shadow-sm bg-white"
            >
              <option value="All">All</option>
              <option value="Processing">Processing</option>
              <option value="Delivered">Delivered</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center min-h-[50vh]">
            <FaSpinner className="animate-spin text-slate-700 text-4xl" />
          </div>
        ) : filteredOrders.length === 0 ? (
          <p className="text-lg text-gray-500 text-center">
            No orders found for the selected status.
          </p>
        ) : (
          <div className="space-y-6">
            {filteredOrders.map((order) => (
              <div
                key={order._id}
                className="bg-white shadow-lg p-6 rounded-lg space-y-4 transition-transform hover:scale-105 hover:shadow-2xl"
              >
                <div className="flex justify-between items-center">
                  <h2 className="text-lg font-semibold text-primary">
                    Order #{order._id}
                  </h2>
                  <span className="text-sm text-gray-500">
                    Date: {new Date(order.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="space-y-2">
                  {order.orderItems.map((item, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <span className="text-gray-600">
                        {item.quantity} × {item.product.product_name}
                      </span>
                      <span className="text-gray-800 font-semibold">
                        ${ (item.product.price * item.quantity).toFixed(2) }
                      </span>
                    </div>
                  ))}
                  
                  {/* Shipping Price and Total Price */}
                  <div className="flex justify-between items-center mt-6">
                    <span className="text-gray-600">Shipping Price:</span>
                    <span className="text-gray-800 font-semibold">
                      ${order.shippingPrice.toFixed(2)}
                    </span>
                  </div>

                  {/* You could add a total price section here */}
                  <div className="flex justify-between items-center mt-4 border-t pt-4">
                    <span className="text-lg font-bold text-gray-800">Total:</span>
                    <span className="text-lg font-bold text-gray-800">
                      ${  order.totalPrice.toFixed(2) }
                    </span>
                  </div>
                </div>

                <div className="flex justify-end space-x-4 pt-4">
                  <span
                    className={`px-4 py-2 rounded-lg text-white font-semibold ${
                      order.orderStatus === "Delivered"
                        ? "bg-green-600"
                        : order.orderStatus === "Cancelled"
                        ? "bg-gray-600"
                        : "bg-yellow-600"
                    }`}
                  >
                    {order.orderStatus}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderPage;
