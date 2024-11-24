
// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import Header from "./Header";
// import { FaSpinner, FaTimes, FaStar, FaEdit } from "react-icons/fa";
// import { toast } from "react-toastify";
// import { Formik, Field, Form, ErrorMessage } from "formik";
// import * as Yup from "yup";

// const OrderPage = () => {
//   const [loading, setLoading] = useState(true);
//   const [orders, setOrders] = useState([]);
//   const [filter, setFilter] = useState("All");
//   const [showModal, setShowModal] = useState(false);
//   const [selectedOrderId, setSelectedOrderId] = useState(null);

//   // Review modal states
//   const [showReviewModal, setShowReviewModal] = useState(false);
//   const [productId, setProductId] = useState(null); // To store the productId for review

//   useEffect(() => {
//     const fetchUserOrders = async () => {
//       try {
//         const { data } = await axios.get(
//           "http://localhost:5000/api/orders/my-orders",
//           { withCredentials: true }
//         );
//         setOrders(data);
//       } catch (error) {
//         console.error("Error fetching orders:", error);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchUserOrders();
//   }, []);

//   const filteredOrders =
//     filter === "All"
//       ? orders
//       : orders.filter((order) => order.orderStatus === filter);

//   const handleCancelOrder = async () => {
//     try {
//       await axios.put(
//         `http://localhost:5000/api/orders/cancel/${selectedOrderId}`,
//         {},
//         { withCredentials: true }
//       );
//       setOrders(
//         orders.map((order) =>
//           order._id === selectedOrderId
//             ? { ...order, orderStatus: "Cancelled" }
//             : order
//         )
//       );
//       toast.success("Order successfully cancelled!");
//       setShowModal(false);
//     } catch (error) {
//       console.error("Error cancelling order:", error);
//       toast.error("Failed to cancel the order.");
//     }
//   };

//   const openModal = (orderId) => {
//     setSelectedOrderId(orderId);
//     setShowModal(true);
//   };

//   const closeModal = () => {
//     setShowModal(false);
//   };

//   // Review modal functions
//   const openReviewModal = (orderId, productId) => {
//     setSelectedOrderId(orderId);
//     setProductId(productId); // Set the selected productId
//     setShowReviewModal(true);
//   };

//   const closeReviewModal = () => {
//     setShowReviewModal(false);
//   };

//   const submitReview = async (values) => {
//     const userId = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user'))._id : null;

//     if (!userId) {
//       console.log("User is not authenticated");
//       return;
//     }

//     try {
//       const response = await axios.post(
//         `http://localhost:5000/api/orders/review/${productId}`, // Send productId here
//         {
//           review: values.reviewText,
//           rating: values.rating,
//           userId,
//           orderID: selectedOrderId,
//         }
//       );

//       if (response.status === 201) {
//         console.log("Review submitted successfully");
//         toast.success("Review submitted successfully");

//         setTimeout(() => {
//           window.location.reload(); // Refresh the page after 2 seconds
//         }, 1000);

//         closeReviewModal();
//       }
//     } catch (error) {
//       console.error("Error submitting review:", error);
//       toast.error("Failed to submit review");
//     }
//   };

//   const hasReviewed = (orderId, productId) => {
//     const order = orders.find((o) => o._id === orderId);
//     if (!order) return false;

//     return order.orderItems.some((item) =>
//       item.product._id === productId && item.product.reviews.some(
//         (review) =>
//           review.orderID.toString() === orderId.toString() &&
//           review.user.toString() === (localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user'))._id : null)
//       )
//     );
//   };

//   // Validation Schema using Yup
//   const reviewValidationSchema = Yup.object().shape({
//     reviewText: Yup.string()
//       .required("Review text is required.")
//       .min(10, "Review must be at least 10 characters long."),
//     rating: Yup.number()
//       .required("Rating is required.")
//       .min(1, "Rating must be at least 1 star.")
//       .max(5, "Rating cannot exceed 5 stars."),
//   });

//   return (
//     <div className="bg-stone-300 min-h-screen">
//       <Header />
//       <div className="container mx-auto p-8 mt-16">
//         <div className="flex justify-between items-center mb-6">
//           <h1 className="text-3xl font-bold text-primary">My Orders</h1>
//           {/* Filter Section */}
//           <div className="flex items-center">
//             <label
//               className="text-gray-700 font-semibold mr-4"
//               htmlFor="filter"
//             >
//               Filter by Status:
//             </label>
//             <select
//               id="filter"
//               value={filter}
//               onChange={(e) => setFilter(e.target.value)}
//               className="px-4 py-2 border rounded-lg shadow-sm bg-white"
//             >
//               <option value="All">All</option>
//               <option value="Processing">Processing</option>
//               <option value="Delivered">Delivered</option>
//               <option value="Cancelled">Cancelled</option>
//               <option value="To Deliver">To Deliver</option>
//               <option value="To Ship">To Ship</option>
//             </select>
//           </div>
//         </div>

//         {loading ? (
//           <div className="flex justify-center items-center min-h-[50vh]">
//             <FaSpinner className="animate-spin text-slate-700 text-4xl" />
//           </div>
//         ) : filteredOrders.length === 0 ? (
//           <p className="text-lg text-gray-500 text-center">
//             No orders found for the selected status.
//           </p>
//         ) : (
//           <div className="space-y-6">
//             {filteredOrders.map((order) => (
//               <div
//                 key={order._id}
//                 className="bg-white shadow-lg p-6 rounded-lg space-y-4 transition-transform hover:scale-105 hover:shadow-2xl"
//               >
//                 {/* Order Details */}
//                 <div className="flex justify-between items-center">
//                   <h2 className="text-lg font-semibold text-primary">
//                     Order #{order._id}
//                   </h2>
//                   <span className="text-sm text-gray-500">
//                     Date: {new Date(order.createdAt).toLocaleDateString()}
//                   </span>
//                 </div>
//                 <div className="space-y-2">
//                   {order.orderItems.map((item, index) => (
//                     <div key={index} className="mb-4">
//                       {order.orderStatus === "Delivered" ? (
//                         <div className="flex flex-col space-y-2">
//                           <div className="flex justify-between items-start">
//                             <span className="text-gray-600 text-sm">{item.quantity} × {item.product.product_name}</span>
//                           </div>
//                           <div className="flex justify-between items-center">
//                             <span className="text-gray-800 font-semibold text-lg">
//                               ${(item.product.price * item.quantity).toFixed(2)}
//                             </span>
//                             {hasReviewed(order._id, item.product._id) ? (
//                               <span className="text-sm text-gray-500">Already Reviewed</span>
//                             ) : (
//                               <button
//                                 onClick={() => openReviewModal(order._id, item.product._id)} // Pass both orderId and productId
//                                 className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 transition ml-4"
//                               >
//                                 <FaEdit className="mr-2" />
//                                 Write Review
//                               </button>
//                             )}
//                           </div>
//                         </div>
//                       ) : (
//                         <div className="flex justify-between items-center">
//                           <span className="text-gray-600">{item.quantity} × {item.product.product_name}</span>
//                           <span className="text-gray-800 font-semibold">
//                             ${(item.product.price * item.quantity).toFixed(2)}
//                           </span>
//                         </div>
//                       )}
//                     </div>
//                   ))}

//                   <div className="flex justify-between items-center mt-4 border-t pt-4">
//                     <span className="text-lg font-bold text-gray-800">
//                       Total:
//                     </span>
//                     <span className="text-lg font-bold text-gray-800">
//                       ${order.totalPrice.toFixed(2)}
//                     </span>
//                   </div>
//                 </div>
//                 <div className="flex justify-end items-center space-x-4">
//               {order.orderStatus === "To Deliver" && (
//                 <div className="text-blue-600 font-medium">
//                   Your order is out for delivery.
//                 </div>
//               )}

//               {order.orderStatus === "To Ship" && (
//                 <div className="text-yellow-600 font-medium">
//                   Your order is being prepared for shipping.
//                 </div>
//               )}

//               {order.orderStatus === "To Ship" && (
//                 <button
//                   className="bg-gray-400 text-white py-2 px-4 rounded-lg shadow cursor-not-allowed"
//                   disabled
//                 >
//                   Cannot Cancel
//                 </button>
//               )}
//             </div>


//                 {order.orderStatus === "Processing" && (
//                   <button
//                     onClick={() => openModal(order._id)}
//                     className="bg-red-600 text-white py-2 px-4 rounded-lg shadow hover:bg-red-700"
//                   >
//                     Cancel Order
//                   </button>
//                 )}

                
//               </div>
//             ))}
//           </div>
//         )}
//       </div>

//       {/* Cancel Order Modal */}
//       {showModal && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
//           <div className="bg-white p-6 rounded-lg shadow-lg w-96">
//             <div className="flex justify-between items-center mb-4">
//               <h2 className="text-xl font-semibold text-primary">Cancel Order</h2>
//               <FaTimes
//                 onClick={closeModal}
//                 className="text-gray-600 cursor-pointer"
//               />
//             </div>
//             <p className="text-gray-700 mb-4">
//               Are you sure you want to cancel this order?
//             </p>
//             <div className="flex justify-end space-x-4">
//               <button
//                 onClick={closeModal}
//                 className="px-4 py-2 bg-gray-300 rounded-lg"
//               >
//                 Close
//               </button>
//               <button
//                 onClick={handleCancelOrder}
//                 className="px-4 py-2 bg-red-600 text-white rounded-lg"
//               >
//                 Confirm Cancel
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Review Modal */}
//       {showReviewModal && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
//           <div className="bg-white p-6 rounded-lg shadow-lg w-96">
//             <h2 className="text-xl font-semibold mb-4 text-primary">Write a Review</h2>
//             <Formik
//               initialValues={{
//                 reviewText: "",
//                 rating: 1,
//               }}
//               validationSchema={reviewValidationSchema}
//               onSubmit={submitReview}
//             >
//               {({ setFieldValue, values, touched, errors }) => (
//                 <Form>
//                   <div className="space-y-4">
//                     <div>
//                       <label
//                         htmlFor="rating"
//                         className="text-sm font-semibold text-gray-700"
//                       >
//                         Rating:
//                       </label>
//                       <div className="flex space-x-2 mt-2">
//                         {[1, 2, 3, 4, 5].map((star) => (
//                           <FaStar
//                             key={star}
//                             onClick={() => setFieldValue("rating", star)}
//                             className={`cursor-pointer text-2xl ${
//                               values.rating >= star
//                                 ? "text-yellow-500"
//                                 : "text-gray-300"
//                             }`}
//                           />
//                         ))}
//                       </div>
//                       <ErrorMessage
//                         name="rating"
//                         component="div"
//                         className="text-red-500 text-xs mt-1"
//                       />
//                     </div>

//                     <div>
//                       <label
//                         htmlFor="reviewText"
//                         className="text-sm font-semibold text-gray-700"
//                       >
//                         Review:
//                       </label>
//                       <Field
//                         as="textarea"
//                         id="reviewText"
//                         name="reviewText"
//                         rows="4"
//                         className="w-full p-2 border rounded-lg mt-2"
//                       />
//                       <ErrorMessage
//                         name="reviewText"
//                         component="div"
//                         className="text-red-500 text-xs mt-1"
//                       />
//                     </div>

//                     <div className="flex justify-between">
//                       <button
//                         type="button"
//                         onClick={closeReviewModal}
//                         className="px-4 py-2 bg-gray-300 rounded-lg"
//                       >
//                         Close
//                       </button>
//                       <button
//                         type="submit"
//                         className="px-4 py-2 bg-blue-600 text-white rounded-lg"
//                       >
//                         Submit Review
//                       </button>
//                     </div>
//                   </div>
//                 </Form>
//               )}
//             </Formik>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default OrderPage;





import React, { useState, useEffect } from "react";
import axios from "axios";
import Header from "./Header";
import { FaSpinner, FaTimes, FaStar, FaEdit } from "react-icons/fa";
import { toast } from "react-toastify";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";

const OrderPage = () => {
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState("All");
  const [showModal, setShowModal] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);

  // Review modal states
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [productId, setProductId] = useState(null); // To store the productId for review

  // udpate review
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false); // Modal visibility
  const [currentReview, setCurrentReview] = useState({ orderID: '', rating: 0, comment: '' }); // Review data
 
  const user = JSON.parse(localStorage.getItem('user')); // Retrieve user object from local storage
  const userID = user?._id; // Extract the user ID safely

  
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
  };

  const submitReview = async (values) => {
    const userId = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user'))._id : null;

    if (!userId) {
      console.log("User is not authenticated");
      return;
    }

    try {
      const response = await axios.post(
        `http://localhost:5000/api/orders/review/${productId}`, // Send productId here
        {
          review: values.reviewText,
          rating: values.rating,
          userId,
          orderID: selectedOrderId,
        }
      );

      if (response.status === 201) {
        console.log("Review submitted successfully");
        toast.success("Review submitted successfully");

        setTimeout(() => {
          window.location.reload(); // Refresh the page after 2 seconds
        }, 1000);

        closeReviewModal();
      }
    } catch (error) {
      console.error("Error submitting review:", error);
      toast.error("Failed to submit review");
    }
  };

  const hasReviewed = (orderId, productId) => {
    const order = orders.find((o) => o._id === orderId);
    if (!order) return false;

    return order.orderItems.some((item) =>
      item.product._id === productId && item.product.reviews.some(
        (review) =>
          review.orderID.toString() === orderId.toString() &&
          review.user.toString() === (localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user'))._id : null)
      )
    );
  };

  // Validation Schema using Yup
  const reviewValidationSchema = Yup.object().shape({
    reviewText: Yup.string()
      .required("Review text is required.")
      .min(10, "Review must be at least 10 characters long."),
    rating: Yup.number()
      .required("Rating is required.")
      .min(1, "Rating must be at least 1 star.")
      .max(5, "Rating cannot exceed 5 stars."),
  });

  const openUpdateReviewModal = (orderID, product, userID) => {
    const review = product.reviews.find(
      (r) => r.orderID === orderID && r.user === userID
    );
  
    if (review) {
      setCurrentReview({
        ...review,
        orderID,
        productID: product._id, // Store productId from the product object
        productName: product.product_name,
      });
      setIsUpdateModalOpen(true);
    } else {
      console.error("Review not found for the current order and user.");
    }
  };
  
  

  
  const handleUpdateSubmit = async () => {
    try {
      await updateReview(
        currentReview.productID, // Use productId here
        currentReview.orderID,
        userID,
        currentReview.rating,
        currentReview.comment
      );
      toast.success('Review updated successfully');
      setIsUpdateModalOpen(false); // Close modal on success
      setOrders(); // Refresh orders to reflect the updated review
      setTimeout(() => {
        window.location.reload(); // Refresh the page after 2 seconds
      }, 500)
    } catch (error) {
      console.error('Error updating review:', error.message);
      toast.error('Failed to update review');
    }
  };
  
  
  

  const updateReview = async (productId, orderID, userID, rating, comment) => {
    try {
      const response = await axios.put(`http://localhost:5000/api/orders/update-review/${productId}`, {
        orderID,
        userID,
        rating,
        comment,
      });
  
      
  
      return response.data;
    } catch (error) {
      console.error("Error updating review:", error);
      // You can also show a notification or message to the user in case of an error
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
              <option value="To Deliver">To Deliver</option>
              <option value="To Ship">To Ship</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center min-h-[50vh]">
            <FaSpinner className="animate-spin text-slate-700 text-4xl" />
          </div>
        ) : (filteredOrders?.length || 0) === 0 ? (
          <p className="text-lg text-gray-500 text-center">
            No orders found for the selected status.
          </p>
        )  : (
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
                       {order.orderStatus === "Delivered" ? (
                              <div className="flex flex-col space-y-2">
                                {/* Product and Price Info */}
                                <div className="flex justify-between items-start">
                                  <span className="text-gray-600 text-sm">
                                    {item.quantity} × {item.product.product_name}
                                  </span>
                                </div>
                                <div className="flex justify-between items-center">
                                  <span className="text-gray-800 font-semibold text-lg">
                                    ${(item.product.price * item.quantity).toFixed(2)}
                                  </span>
                                  {/* Review Button or Status */}
                                  {hasReviewed(order._id, item.product._id) ? (
                                    <span className="text-sm text-gray-500">Already Reviewed</span>
                                  ) : (
                                    <button
                                      onClick={() => openReviewModal(order._id, item.product._id)}
                                      className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 transition ml-4"
                                    >
                                      <FaEdit className="mr-2" />
                                      Write Review
                                    </button>
                                  )}
                                </div>

                                {/* Display Existing Reviews */}
                                {item.product.reviews && item.product.reviews.filter(review => review.orderID === order._id).length > 0 && (
                                  <div className="mt-2 bg-gray-100 p-3 rounded-lg shadow-inner">
                                    <h4 className="text-md font-medium mb-2">Reviews:</h4>
                                    {item.product.reviews
                                      .filter((review) => review.orderID === order._id) // Filter reviews by orderID
                                      .map((review) => (
                                        <div key={review._id} className="mb-2 border-b pb-2 last:border-none flex justify-between items-center">
                                          <div>
                                            {/* Star Ratings */}
                                            <div className="flex">
                                              {[...Array(5)].map((_, i) => (
                                                <FaStar
                                                  key={i}
                                                  className={`mr-1 ${i < review.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                                                />
                                              ))}
                                            </div>
                                            {/* Comment */}
                                            <p className="text-gray-700 mt-1">{review.comment}</p>
                                          </div>
                                          
                                          <button
                                              onClick={() => openUpdateReviewModal(order._id, item.product, userID)} // Pass product details instead of relying on `item` in the function
                                              className="flex items-center bg-yellow-500 text-white px-2 py-1 rounded-lg shadow hover:bg-yellow-600 transition ml-4"
                                            >
                                              <FaEdit className="mr-1" />
                                              Update
                                            </button>



                                        </div>
                                      ))}
                                  </div>
                                )}


                              </div>
                            ): (
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">{item.quantity} × {item.product.product_name}</span>
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
                <div className="flex justify-end items-center space-x-4">
              {order.orderStatus === "To Deliver" && (
                <div className="text-blue-600 font-medium">
                  Your order is out for delivery.
                </div>
              )}

              {order.orderStatus === "To Ship" && (
                <div className="text-yellow-600 font-medium">
                  Your order is being prepared for shipping.
                </div>
              )}

              {order.orderStatus === "To Ship" && (
                <button
                  className="bg-gray-400 text-white py-2 px-4 rounded-lg shadow cursor-not-allowed"
                  disabled
                >
                  Cannot Cancel
                </button>
              )}
            </div>


                {order.orderStatus === "Processing" && (
                  <button
                    onClick={() => openModal(order._id)}
                    className="bg-red-600 text-white py-2 px-4 rounded-lg shadow hover:bg-red-700"
                  >
                    Cancel Order
                  </button>
                )}

                
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Cancel Order Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-primary">Cancel Order</h2>
              <FaTimes
                onClick={closeModal}
                className="text-gray-600 cursor-pointer"
              />
            </div>
            <p className="text-gray-700 mb-4">
              Are you sure you want to cancel this order?
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={closeModal}
                className="px-4 py-2 bg-gray-300 rounded-lg"
              >
                Close
              </button>
              <button
                onClick={handleCancelOrder}
                className="px-4 py-2 bg-red-600 text-white rounded-lg"
              >
                Confirm Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      
{isUpdateModalOpen && (
  <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
    <div className="bg-white p-5 rounded-lg shadow-lg w-full max-w-md">
      <h2 className="text-lg font-semibold mb-3">Update Review</h2>

      <Formik
        initialValues={{
          reviewText: currentReview.comment || "", // Default to current review's comment
          rating: currentReview.rating || 1, // Default to current review's rating
        }}
        validationSchema={reviewValidationSchema} // Use the same validation schema
        onSubmit={handleUpdateSubmit}
      >
        {({ setFieldValue, values, touched, errors }) => (
          <Form>
            {/* Review Comment Input */}
            <div className="mb-3">
              <label
                htmlFor="reviewText"
                className="text-sm font-semibold text-gray-700"
              >
                Review:
              </label>
              <Field
                as="textarea"
                id="reviewText"
                name="reviewText"
                rows="4"
                className="w-full p-2 border rounded-lg mt-2"
              />
              {touched.reviewText && errors.reviewText && (
                <div className="text-red-500 text-xs mt-1">{errors.reviewText}</div>
              )}
            </div>

            {/* Star Rating Input */}
            <div className="mb-3">
              <label
                htmlFor="rating"
                className="text-sm font-semibold text-gray-700"
              >
                Rating:
              </label>
              <div className="flex space-x-2 mt-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <FaStar
                    key={star}
                    onClick={() => setFieldValue("rating", star)}
                    className={`cursor-pointer text-2xl ${values.rating >= star ? "text-yellow-500" : "text-gray-300"}`}
                  />
                ))}
              </div>
              {touched.rating && errors.rating && (
                <div className="text-red-500 text-xs mt-1">{errors.rating}</div>
              )}
            </div>

            {/* Submit and Cancel Buttons */}
            <div className="flex justify-between">
              <button
                type="button"
                onClick={() => setIsUpdateModalOpen(false)}
                className="px-4 py-2 bg-gray-300 rounded-lg"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg"
              >
                Update Review
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  </div>
)}



      
      {/* Review Modal */}
      {showReviewModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-semibold mb-4 text-primary">Write a Review</h2>
            <Formik
              initialValues={{
                reviewText: "",
                rating: 1,
              }}
              validationSchema={reviewValidationSchema}
              onSubmit={submitReview}
            >
              {({ setFieldValue, values, touched, errors }) => (
                <Form>
                  <div className="space-y-4">
                    <div>
                      <label
                        htmlFor="rating"
                        className="text-sm font-semibold text-gray-700"
                      >
                        Rating:
                      </label>
                      <div className="flex space-x-2 mt-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <FaStar
                            key={star}
                            onClick={() => setFieldValue("rating", star)}
                            className={`cursor-pointer text-2xl ${
                              values.rating >= star
                                ? "text-yellow-500"
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                      <ErrorMessage
                        name="rating"
                        component="div"
                        className="text-red-500 text-xs mt-1"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="reviewText"
                        className="text-sm font-semibold text-gray-700"
                      >
                        Review:
                      </label>
                      <Field
                        as="textarea"
                        id="reviewText"
                        name="reviewText"
                        rows="4"
                        className="w-full p-2 border rounded-lg mt-2"
                      />
                      <ErrorMessage
                        name="reviewText"
                        component="div"
                        className="text-red-500 text-xs mt-1"
                      />
                    </div>

                    <div className="flex justify-between">
                      <button
                        type="button"
                        onClick={closeReviewModal}
                        className="px-4 py-2 bg-gray-300 rounded-lg"
                      >
                        Close
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg"
                      >
                        Submit Review
                      </button>
                    </div>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderPage;
