import React, { useState, useEffect } from "react";
import Header from "./Header"; // Assuming you have a Header component
import { FaSpinner } from "react-icons/fa"; // Spinner for loading state

const OrderPage = () => {
  const [loading, setLoading] = useState(true); // Loading state
  const [orders, setOrders] = useState([]); // Placeholder for orders
  const [filter, setFilter] = useState("All"); // Filter state
  const [modalOpen, setModalOpen] = useState(false); // Modal open state
  const [currentOrderId, setCurrentOrderId] = useState(null); // Order ID for review
  const [review, setReview] = useState(""); // Review text

  // Simulating API call
  useEffect(() => {
    setTimeout(() => {
      setOrders([
        {
          id: 1,
          date: "2024-11-21",
          items: [
            { name: "Anna Field Waist belt", quantity: 2, price: 33.98 },
            { name: "Levi's Original Tee", quantity: 1, price: 23.99 },
          ],
          total: 91.95,
          status: "Pending",
        },
        {
          id: 2,
          date: "2024-11-20",
          items: [{ name: "Blender", quantity: 1, price: 100.0 }],
          total: 100.0,
          status: "Delivered",
        },
        {
          id: 3,
          date: "2024-11-19",
          items: [{ name: "Coffee Maker", quantity: 1, price: 50.0 }],
          total: 50.0,
          status: "Cancelled",
        },
      ]);
      setLoading(false);
    }, 2000); // Simulate 2-second delay
  }, []);

  // Cancel order function
  const cancelOrder = (orderId) => {
    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order.id === orderId ? { ...order, status: "Cancelled" } : order
      )
    );
    alert(`Order #${orderId} has been cancelled.`);
  };

  // Filter orders based on status
  const filteredOrders =
    filter === "All"
      ? orders
      : orders.filter((order) => order.status === filter);

  // Handle review modal open
  const openReviewModal = (orderId) => {
    setCurrentOrderId(orderId);
    setModalOpen(true);
  };

  // Handle review submission
  const handleReviewSubmit = () => {
    if (review.trim() === "") {
      alert("Please write a review before submitting.");
      return;
    }

    // Here you would typically save the review (e.g., through an API call)
    alert(`Review submitted for Order #${currentOrderId}: ${review}`);
    setModalOpen(false); // Close the modal
    setReview(""); // Clear review input
  };

  return (
    <div className="bg-stone-300 min-h-screen">
      <Header />
      <div className="container mx-auto p-8 mt-16">
        {/* Heading and Filter in Same Row */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-primary">Orders</h1>
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
              <option value="Pending">Pending</option>
              <option value="Delivered">Delivered</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        {/* Orders Section */}
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
                key={order.id}
                className="bg-white shadow-lg p-6 rounded-lg space-y-4 transition-transform hover:scale-105 hover:shadow-2xl"
              >
                <div className="flex justify-between items-center">
                  <h2 className="text-lg font-semibold text-primary">
                    Order #{order.id}
                  </h2>
                  <span className="text-sm text-gray-500">
                    Date: {order.date}
                  </span>
                </div>
                <div className="space-y-2">
                  {order.items.map((item, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center"
                    >
                      <span className="text-gray-600">
                        {item.quantity} × {item.name}
                      </span>
                      <span className="text-gray-800 font-semibold">
                        £{item.price.toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between items-center pt-4 border-t">
                  <span className="font-bold text-primary">Total:</span>
                  <span className="font-bold text-primary">
                    £{order.total.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-end space-x-4 pt-4">
                  {order.status === "Pending" && (
                    <button
                      onClick={() => cancelOrder(order.id)}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-800 transition-transform hover:scale-105"
                    >
                      Cancel Order
                    </button>
                  )}
                  {order.status === "Delivered" && (
                    <button
                      onClick={() => openReviewModal(order.id)}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-800 transition-transform hover:scale-105"
                    >
                      Leave a Review
                    </button>
                  )}
                  <span
                    className={`px-4 py-2 rounded-lg text-white font-semibold ${
                      order.status === "Delivered"
                        ? "bg-green-600"
                        : order.status === "Cancelled"
                        ? "bg-gray-600"
                        : "bg-yellow-600"
                    }`}
                  >
                    {order.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Review Modal */}
      {modalOpen && (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
          <div className="bg-white p-8 rounded-lg w-96">
            <h3 className="text-xl font-semibold mb-4">Leave a Review</h3>
            <textarea
              value={review}
              onChange={(e) => setReview(e.target.value)}
              className="w-full p-4 border rounded-lg mb-4"
              placeholder="Write your review here..."
              rows="4"
            />
            <div className="flex justify-between">
              <button
                onClick={() => setModalOpen(false)}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={handleReviewSubmit}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-800"
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
