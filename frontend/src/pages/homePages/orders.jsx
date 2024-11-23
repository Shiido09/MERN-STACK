import React, { useState, useEffect } from "react";
import axios from "axios";
import Header from "./Header";
import { FaSpinner, FaTimes, FaStar, FaEdit } from "react-icons/fa";
import { toast } from "react-toastify";

const OrderPage = () => {
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState("All");
  const [showModal, setShowModal] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  
  // Review modal states
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewText, setReviewText] = useState("");
  const [rating, setRating] = useState(0);
  const [productId, setProductId] = useState(null); // To store the productId for review

  useEffect(() => {
    const fetchUserOrders = async () => {
      try {
        const { data } = await axios.get(
          "http://localhost:5000/api/orders/my-orders",
          { withCredentials: true }
        );
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

  const handleCancelOrder = async () => {
    try {
      await axios.put(
        `http://localhost:5000/api/orders/cancel/${selectedOrderId}`,
        {},
        { withCredentials: true }
      );
      setOrders(
        orders.map((order) =>
          order._id === selectedOrderId
            ? { ...order, orderStatus: "Cancelled" }
            : order
        )
      );
      toast.success("Order successfully cancelled!");
      setShowModal(false);
    } catch (error) {
      console.error("Error cancelling order:", error);
      toast.error("Failed to cancel the order.");
    }
  };

  const openModal = (orderId) => {
    setSelectedOrderId(orderId);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  // Review modal functions
  const openReviewModal = (orderId, productId) => {
    setSelectedOrderId(orderId);
    setProductId(productId); // Set the selected productId
    setShowReviewModal(true);
  };

  const closeReviewModal = () => {
    setShowReviewModal(false);
    setReviewText("");
    setRating(0);
  };

  const submitReview = async () => {
    const userId = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user'))._id : null;
  
    if (!userId) {
      console.log("User is not authenticated");
      return;
    }

    try {
      const response = await axios.post(
        `http://localhost:5000/api/orders/review/${productId}`, // Send productId here
        {
          review: reviewText,
          rating,
          userId,
        }
      );

      if (response.status === 201) {
        console.log("Review submitted successfully");
        toast.success("Review submitted successfully");
        closeReviewModal();
      }
    } catch (error) {
      console.error("Error submitting review:", error);
      toast.error("Failed to submit review");
    }
  };

  return (
    <div className="bg-stone-300 min-h-screen">
      <Header />
      <div className="container mx-auto p-8 mt-16">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-primary">My Orders</h1>
          {/* Filter Section */}
          <div className="flex items-center">
            <label
              className="text-gray-700 font-semibold mr-4"
              htmlFor="filter"
            >
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
                {/* Order Details */}
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
                      <div key={index} className="mb-4">
                        {/* Check if the order is delivered */}
                        {order.orderStatus === "Delivered" ? (
                          // Format for "Delivered" orders
                          <div className="flex flex-col space-y-2">
                            <div className="flex justify-between items-start">
                              <span className="text-gray-600 text-sm">{item.quantity} × {item.product.product_name}</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-gray-800 font-semibold text-lg">
                                ${(item.product.price * item.quantity).toFixed(2)}
                              </span>
                              <button
                                onClick={() => openReviewModal(order._id, item.product._id)} // Pass both orderId and productId
                                className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 transition ml-4"
                              >
                                <FaEdit className="mr-2" />
                              </button>
                            </div>
                          </div>
                        ) : (
                          // Format for other order statuses (Processing, Cancelled, etc.)
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600">
                              {item.quantity} × {item.product.product_name}
                            </span>
                            <span className="text-gray-800 font-semibold">
                              ${(item.product.price * item.quantity).toFixed(2)}
                            </span>
                          </div>
                        )}
                      </div>
                    ))}

                  <div className="flex justify-between items-center mt-4 border-t pt-4">
                    <span className="text-lg font-bold text-gray-800">
                      Total:
                    </span>
                    <span className="text-lg font-bold text-gray-800">
                      ${order.totalPrice.toFixed(2)}
                    </span>
                  </div>
                </div>
                {/* Order Actions */}
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
                  {order.orderStatus === "Processing" && (
                    <button
                      onClick={() => openModal(order._id)}
                      className="flex items-center bg-red-600 text-white px-4 py-2 rounded-lg shadow hover:bg-red-700 transition"
                    >
                      <FaTimes className="mr-2" /> Cancel Order
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Cancel Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-8 rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold mb-4">
              Confirm Order Cancellation
            </h2>
            <p className="text-gray-600 mb-6">
              Are you sure you want to cancel this order?
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={closeModal}
                className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
              >
                No, Keep Order
              </button>
              <button
                onClick={handleCancelOrder}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Yes, Cancel Order
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Review Modal */}
      {showReviewModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-8 rounded-lg shadow-lg w-96">
            <h2 className="text-2xl font-semibold mb-4">Write a Review</h2>
            <textarea
              className="w-full h-32 p-4 mb-4 border border-gray-300 rounded-lg"
              placeholder="Write your review here..."
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
            />
            <div className="flex items-center mb-4">
              {[...Array(5)].map((_, index) => (
                <FaStar
                  key={index}
                  className={`cursor-pointer text-yellow-500 ${
                    index < rating ? "text-yellow-400" : ""
                  }`}
                  onClick={() => setRating(index + 1)}
                />
              ))}
            </div>
            <div className="flex justify-end space-x-4">
              <button
                onClick={closeReviewModal}
                className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={submitReview}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Submit Review
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderPage;
