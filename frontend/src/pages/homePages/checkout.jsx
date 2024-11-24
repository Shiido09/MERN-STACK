// import React, { useEffect, useState } from 'react';
// import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import axios from 'axios';
// import Header from './Header';
// import { useNavigate } from 'react-router-dom';

// const CheckoutPage = () => {
//   const [products, setProducts] = useState([]);
//   const [total, setTotal] = useState(0);
//   const [address, setAddress] = useState('');
//   const [shippingMethod, setShippingMethod] = useState('');
//   const [paymentMethod, setPaymentMethod] = useState('Credit Card');
//   const [phoneNumber, setPhoneNumber] = useState('');
//   const [email, setEmail] = useState('');
//   const [shippingCost, setShippingCost] = useState(0);
//   const [error, setError] = useState(null);
//   const navigate = useNavigate(); // Initialize the navigation function

//   // Fetch checkoutData from localStorage
//   useEffect(() => {
//     try {
//       const checkoutData = JSON.parse(localStorage.getItem('checkoutData'));
//       if (!checkoutData || !checkoutData.products) {
//         setError('Checkout data not found in local storage.');
//         return;
//       }

//       setProducts(checkoutData.products);
//       setTotal(checkoutData.total);
//     } catch (err) {
//       setError('Failed to load checkout data from local storage.');
//     }

//     // Fetch the user's phone number and address from localStorage if available
//     const user = JSON.parse(localStorage.getItem('user'));
//     if (user) {
//       setPhoneNumber(user.phoneNo || '');
//       setAddress(user.address || '');
//     }
//   }, []);

//   const handleShippingChange = (e) => {
//     const selectedShipping = e.target.value;
//     setShippingMethod(selectedShipping);

//     // Set shipping cost based on selection
//     switch (selectedShipping) {
//       case 'Standard Shipping':
//         setShippingCost(5);
//         break;
//       case 'Express Shipping':
//         setShippingCost(15);
//         break;
//       case 'Same-Day Delivery':
//         setShippingCost(25);
//         break;
//       case 'Pickup':
//         setShippingCost(0);
//         break;
//       default:
//         setShippingCost(0);
//         break;
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!address || !paymentMethod || !phoneNumber || !shippingMethod) { // Check if shipping method is selected
//       toast.error('Please fill in all the fields.');
//       return;
//     }

//     try {
//       const user = JSON.parse(localStorage.getItem('user'));

//       const orderData = {
//         userId: user._id,  // Add userId here from localStorage
//         orderItems: products.map((item) => ({
//           quantity: item.quantity,
//           product: item._id, // Assuming 'product_id' is the ID of the product
//         })),
//         shippingInfo: {
//           address,
//           phoneNo: phoneNumber,
//         },
//         paymentInfo: {
//           id: 'payment-id', // Replace with the actual payment ID (e.g., from Stripe)
//           status: 'success', // Replace with actual payment status
//         },
//         shippingMethod,  // Include the shipping method here
//         shippingPrice: shippingCost,
//         totalPrice: total + shippingCost,
//       };

//       // Log the order data to verify if userId is being added
//       console.log(orderData);

//       // Send order data to backend API
//       const response = await axios.post('http://localhost:5000/api/orders/placeOrder', orderData);

//       // Handle successful order placement
//       if (response.status === 201) {
//         toast.success('Checkout successful!');
        
//         // Optionally, clear the checkoutData from localStorage
//         localStorage.removeItem('checkoutData');

//         // Redirect to the products page after checkout
//         navigate('/products');
//       }
//     } catch (err) {
//       setError('Failed to complete checkout.');
//       toast.error('Something went wrong with your order.');
//     }
//   };

//   if (error) return <div>Error: {error}</div>;

//   return (
//     <div className="bg-stone-300 min-h-screen">
//       <Header />
//       <div className="container mx-auto p-8 mt-16 flex flex-col lg:flex-row space-x-0 lg:space-x-8">
//         <div className="flex-1">
//           <h1 className="text-3xl font-bold mb-6 text-primary">Checkout</h1>

//           <div className="bg-white shadow-lg p-6 rounded-lg mb-6">
//             <h2 className="text-xl font-semibold text-primary">Cart Summary</h2>
//             <div className="mt-4 space-y-4">
//               {products.map((item, index) => (
//                 <div key={index} className="flex justify-between text-lg">
//                   <span>{item.product_name}</span>
//                   <span>₱{item.subtotal.toFixed(2)} ({item.quantity} x ₱{item.price.toFixed(2)})</span>
//                 </div>
//               ))}
//             </div>
//             <div className="mt-4 flex justify-between text-lg font-semibold">
//               <span>Subtotal:</span>
//               <span>₱{total.toFixed(2)}</span>
//             </div>
//           </div>

//           <form onSubmit={handleSubmit} className="bg-white shadow-lg p-6 rounded-lg">
//             <div className="mb-4">
//               <label htmlFor="shippingMethod" className="block text-lg font-semibold text-primary">
//                 Shipping Option
//               </label>
//               <select
//                 id="shippingMethod"
//                 className="w-full mt-2 p-2 border rounded-lg"
//                 value={shippingMethod}
//                 onChange={handleShippingChange}
//               >
//                 <option value="">Select Shipping Option</option>
//                 <option value="Standard Shipping">Standard Shipping - ₱5</option>
//                 <option value="Express Shipping">Express Shipping - ₱15</option>
//                 <option value="Same-Day Delivery">Same-Day Delivery - ₱25</option>
//                 <option value="Pickup">Pickup - Free</option>
//               </select>
//             </div>

//             <div className="mb-4">
//               <label htmlFor="paymentMethod" className="block text-lg font-semibold text-primary">
//                 Payment Method
//               </label>
//               <select
//                 id="paymentMethod"
//                 className="w-full mt-2 p-2 border rounded-lg"
//                 value={paymentMethod}
//                 onChange={(e) => setPaymentMethod(e.target.value)}
//               >
//                 <option value="Credit Card">Credit Card</option>
//                 <option value="PayPal">PayPal</option>
//                 <option value="Bank Transfer">Bank Transfer</option>
//                 <option value="Cash on Delivery">Cash on Delivery</option>
//                 <option value="Apple Pay">Apple Pay</option>
//               </select>
//             </div>

//             <div className="mb-4">
//               <label htmlFor="phoneNo" className="block text-lg font-semibold text-primary">
//                 Phone Number
//               </label>
//               <input
//                 type="text"
//                 id="phoneNo"
//                 className="w-full mt-2 p-2 border rounded-lg"
//                 placeholder="Enter your phone number"
//                 value={phoneNumber}
//                 onChange={(e) => setPhoneNumber(e.target.value)}
//               />
//             </div>

//             <div className="mb-4">
//               <label htmlFor="address" className="block text-lg font-semibold text-primary">
//                 Address
//               </label>
//               <input
//                 type="text"
//                 id="address"
//                 className="w-full mt-2 p-2 border rounded-lg"
//                 placeholder="Enter the destination address"
//                 value={address}
//                 onChange={(e) => setAddress(e.target.value)}  // Update address state here
//               />
//             </div>

//             <button
//               type="submit"
//               className="w-full px-6 py-3 bg-slate-900 text-white font-semibold rounded-lg hover:bg-primary-dark transition text-center"
//             >
//               Complete Checkout
//             </button>
//           </form>
//         </div>

//         <div className="w-full lg:w-1/3 space-y-6 mt-6 lg:mt-0">
//           <div className="bg-stone-100 p-6 rounded-lg shadow-lg">
//             <h2 className="text-xl font-semibold text-primary">Order Summary</h2>
//             <div className="mt-4 flex justify-between text-lg font-semibold">
//               <span>Subtotal:</span>
//               <span>₱{total.toFixed(2)}</span>
//             </div>
//             <div className="mt-4 flex justify-between text-lg font-semibold">
//               <span>Shipping:</span>
//               <span>₱{shippingCost.toFixed(2)}</span>
//             </div>
//             <div className="mt-4 flex justify-between text-lg font-semibold">
//               <span>Total:</span>
//               <span>₱{(total + shippingCost).toFixed(2)}</span>
//             </div>
//           </div>
//         </div>
//       </div>

//       <ToastContainer />
//     </div>
//   );
// };

// export default CheckoutPage;
import React, { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import Header from './Header';
import { useNavigate } from 'react-router-dom';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';

const CheckoutPage = () => {
  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [shippingMethod, setShippingMethod] = useState('');
  const [shippingCost, setShippingCost] = useState(0);
  const [error, setError] = useState(null);
  const navigate = useNavigate(); // Initialize the navigation function

  // Fetch checkoutData from localStorage
  useEffect(() => {
    try {
      const checkoutData = JSON.parse(localStorage.getItem('checkoutData'));
      if (!checkoutData || !checkoutData.products) {
        setError('Checkout data not found in local storage.');
        return;
      }

      setProducts(checkoutData.products);
      setTotal(checkoutData.total);
    } catch (err) {
      setError('Failed to load checkout data from local storage.');
    }

    // Fetch the user's phone number and address from localStorage if available
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      setShippingMethod(user.shippingMethod || '');
    }
  }, []);

  const handleShippingChange = (e) => {
    const selectedShipping = e.target.value;
    setShippingMethod(selectedShipping);

    // Set shipping cost based on selection
    switch (selectedShipping) {
      case 'Standard Shipping':
        setShippingCost(5);
        break;
      case 'Express Shipping':
        setShippingCost(15);
        break;
      case 'Same-Day Delivery':
        setShippingCost(25);
        break;
      case 'Pickup':
        setShippingCost(0);
        break;
      default:
        setShippingCost(0);
        break;
    }
  };

  const validationSchema = Yup.object({
    address: Yup.string().required('Address is required'),
    phoneNumber: Yup.string().required('Phone number is required').matches(/^[0-9]+$/, 'Phone number must be digits'),
    shippingMethod: Yup.string().required('Shipping method is required'),
    paymentMethod: Yup.string().required('Payment method is required'),
  });

  const handleSubmit = async (values) => {
    const { address, phoneNumber, paymentMethod, shippingMethod } = values;

    if (!address || !paymentMethod || !phoneNumber || !shippingMethod) { // Check if shipping method is selected
      toast.error('Please fill in all the fields.');
      return;
    }

    try {
      const user = JSON.parse(localStorage.getItem('user'));

      const orderData = {
        userId: user._id,  // Add userId here from localStorage
        orderItems: products.map((item) => ({
          quantity: item.quantity,
          product: item._id, // Assuming 'product_id' is the ID of the product
        })),
        shippingInfo: {
          address,
          phoneNo: phoneNumber,
        },
        paymentInfo: {
          id: 'payment-id', // Replace with the actual payment ID (e.g., from Stripe)
          status: 'success', // Replace with actual payment status
        },
        shippingMethod,  // Include the shipping method here
        shippingPrice: shippingCost,
        totalPrice: total + shippingCost,
      };

      // Log the order data to verify if userId is being added
      console.log(orderData);

      // Send order data to backend API
      const response = await axios.post('http://localhost:5000/api/orders/placeOrder', orderData);

      // Handle successful order placement
      if (response.status === 201) {
        toast.success('Checkout successful!');
        
        // Optionally, clear the checkoutData from localStorage
        localStorage.removeItem('checkoutData');

        // Redirect to the products page after checkout
        navigate('/products');
      }
    } catch (err) {
      setError('Failed to complete checkout.');
      toast.error('Something went wrong with your order.');
    }
  };

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
              {products.map((item, index) => (
                <div key={index} className="flex justify-between text-lg">
                  <span>{item.product_name}</span>
                  <span>₱{item.subtotal.toFixed(2)} ({item.quantity} x ₱{item.price.toFixed(2)})</span>
                </div>
              ))}
            </div>
            <div className="mt-4 flex justify-between text-lg font-semibold">
              <span>Subtotal:</span>
              <span>₱{total.toFixed(2)}</span>
            </div>
          </div>

          <Formik
  initialValues={{
    address: '',
    phoneNumber: '',
    shippingMethod: shippingMethod || '', // Set the shipping method from state
    paymentMethod: 'Credit Card',
  }}
  validationSchema={validationSchema}
  onSubmit={handleSubmit}
>
  {({ values, handleChange, handleBlur, errors, touched, setFieldValue }) => (
    <Form className="bg-white shadow-lg p-6 rounded-lg">
      <div className="mb-4">
        <label htmlFor="shippingMethod" className="block text-lg font-semibold text-primary">
          Shipping Option
        </label>
        <select
          id="shippingMethod"
          name="shippingMethod"
          className="w-full mt-2 p-2 border rounded-lg"
          value={values.shippingMethod}
          onChange={(e) => {
            const selectedShipping = e.target.value;
            setFieldValue("shippingMethod", selectedShipping); // Update Formik state
            setShippingMethod(selectedShipping); // Update local state
            // Set shipping cost based on the selected method
            let cost = 0;
            switch (selectedShipping) {
              case 'Standard Shipping':
                cost = 50;
                break;
              case 'Express Shipping':
                cost = 150;
                break;
              case 'Same-Day Delivery':
                cost = 250;
                break;
              case 'Pickup':
                cost = 0;
                break;
              default:
                cost = 0;
                break;
            }
            setShippingCost(cost); // Update local shipping cost state
          }}
        >
          <option value="">Select Shipping Option</option>
          <option value="Standard Shipping">Standard Shipping - ₱50</option>
          <option value="Express Shipping">Express Shipping - ₱150</option>
          <option value="Same-Day Delivery">Same-Day Delivery - ₱250</option>
          <option value="Pickup">Pickup - Free</option>
        </select>
        <ErrorMessage name="shippingMethod" component="div" className="text-red-500 text-sm mt-1" />
      </div>
                <div className="mb-4">
                  <label htmlFor="paymentMethod" className="block text-lg font-semibold text-primary">
                    Payment Method
                  </label>
                  <select
                    id="paymentMethod"
                    name="paymentMethod"
                    className="w-full mt-2 p-2 border rounded-lg"
                    value={values.paymentMethod}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  >
                    <option value="Credit Card">Credit Card</option>
                    <option value="PayPal">PayPal</option>
                    <option value="Bank Transfer">Bank Transfer</option>
                    <option value="Cash on Delivery">Cash on Delivery</option>
                    <option value="Apple Pay">Apple Pay</option>
                  </select>
                  <ErrorMessage name="paymentMethod" component="div" className="text-red-500 text-sm mt-1" />
                </div>

                <div className="mb-4">
                  <label htmlFor="phoneNumber" className="block text-lg font-semibold text-primary">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    id="phoneNumber"
                    name="phoneNumber"
                    className="w-full mt-2 p-2 border rounded-lg"
                    placeholder="Enter your phone number"
                    value={values.phoneNumber}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                  <ErrorMessage name="phoneNumber" component="div" className="text-red-500 text-sm mt-1" />
                </div>

                <div className="mb-4">
                  <label htmlFor="address" className="block text-lg font-semibold text-primary">
                    Address
                  </label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    className="w-full mt-2 p-2 border rounded-lg"
                    placeholder="Enter the destination address"
                    value={values.address}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                  <ErrorMessage name="address" component="div" className="text-red-500 text-sm mt-1" />
                </div>

                <button
                  type="submit"
                  className="w-full px-6 py-3 bg-slate-900 text-white font-semibold rounded-lg hover:bg-primary-dark transition text-center"
                >
                  Complete Checkout
                </button>
              </Form>
            )}
          </Formik>
        </div>

        <div className="w-full lg:w-1/3 space-y-6 mt-6 lg:mt-0">
          <div className="bg-stone-100 p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold text-primary">Order Summary</h2>
            <div className="mt-4 flex justify-between text-lg font-semibold">
              <span>Subtotal:</span>
              <span>₱{total.toFixed(2)}</span>
            </div>
            <div className="mt-4 flex justify-between text-lg font-semibold">
              <span>Shipping:</span>
              <span>₱{shippingCost.toFixed(2)}</span>
            </div>
            <div className="mt-4 flex justify-between text-lg font-semibold">
              <span>Total:</span>
              <span>₱{(total + shippingCost).toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>

      <ToastContainer />
    </div>
  );
};

export default CheckoutPage;
