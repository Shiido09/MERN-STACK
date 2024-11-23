import Order from '../models/order.model.js';  // Import the Order model
import Product from '../models/product.model.js';  // Import the Product model to check product availability
import { User } from '../models/user.model.js';  // Import the User model to get user details (if needed)
import { Filter } from 'bad-words';
import {
  sendOrderConfirmationEmail
} from "../mailtrap/emails.js";
// export const placeOrder = async (req, res) => {
//   try {
//     const {
//       userId,
//       orderItems,
//       shippingInfo,
//       paymentInfo,
//       shippingPrice,
//       totalPrice,
//     } = req.body;

//     // Validate incoming data
//     if (!userId || !orderItems || orderItems.length === 0) {
//       return res.status(400).json({ message: 'No order items or user ID provided.' });
//     }

//     // Check if the user exists in the database
//     const user = await User.findById(userId);
//     if (!user) {
//       return res.status(404).json({ message: 'User not found.' });
//     }

//     // Validate each product in the orderItems array
//     const productIds = orderItems.map(item => item.product);
//     const products = await Product.find({ _id: { $in: productIds } });

//     if (products.length !== orderItems.length) {
//       return res.status(404).json({ message: 'One or more products not found.' });
//     }

//     // Check if quantities are available for each product
//     for (let i = 0; i < orderItems.length; i++) {
//       const product = products.find(p => p._id.toString() === orderItems[i].product);
//       if (product.stocks < orderItems[i].quantity) {
//         return res.status(400).json({
//           message: `Insufficient stock for product: ${product.product_name}`,
//         });
//       }
//     }

//     // Create a new order
//     const newOrder = new Order({
//       user: user._id,
//       orderItems,
//       shippingInfo,
//       paymentInfo,
//       shippingPrice,
//       totalPrice,
//     });

//     // Save the order to the database
//     const order = await newOrder.save();

//     // Update product stock after saving the order
//     for (let i = 0; i < orderItems.length; i++) {
//       const product = await Product.findById(orderItems[i].product);

//       // Ensure there's enough stock before reducing the quantity
//       if (product.stocks >= orderItems[i].quantity) {
//         product.stocks -= orderItems[i].quantity;
//         await product.save();  // Save the updated product stock
//       } else {
//         return res.status(400).json({
//           message: `Not enough stock for product: ${product.name}`,
//         });
//       }
//     }

//     // Remove the ordered items from the user's cart
//     await User.findByIdAndUpdate(userId, {
//       $pull: {
//         cart: { product: { $in: productIds } }, // Remove the ordered products from the cart
//       },
//     });

//     res.status(201).json({
//       message: 'Order placed successfully.',
//       order,
//     });
//   } catch (error) {
//     console.error('Error placing order:', error);
//     res.status(500).json({ message: 'Error placing the order. Please try again.' });
//   }
// };


export const placeOrder = async (req, res) => {
  try {
    const {
      userId,
      orderItems,
      shippingInfo,
      paymentInfo,
      shippingPrice,
      totalPrice,
    } = req.body;

    // Validate incoming data
    if (!userId || !orderItems || orderItems.length === 0) {
      return res.status(400).json({ message: 'No order items or user ID provided.' });
    }

    // Check if the user exists in the database
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // Validate each product in the orderItems array
    const productIds = orderItems.map((item) => item.product);
    const products = await Product.find({ _id: { $in: productIds } });

    if (products.length !== orderItems.length) {
      return res.status(404).json({ message: 'One or more products not found.' });
    }

    // Check if quantities are available for each product
    for (let i = 0; i < orderItems.length; i++) {
      const product = products.find((p) => p._id.toString() === orderItems[i].product);
      if (product.stocks < orderItems[i].quantity) {
        return res.status(400).json({
          message: `Insufficient stock for product: ${product.product_name}`,
        });
      }
    }

    // Create a new order
    const newOrder = new Order({
      user: user._id,
      orderItems,
      shippingInfo,
      paymentInfo,
      shippingPrice,
      totalPrice,
    });

    // Save the order to the database
    const order = await newOrder.save();

    // Update product stock after saving the order
    for (let i = 0; i < orderItems.length; i++) {
      const product = await Product.findById(orderItems[i].product);

      // Ensure there's enough stock before reducing the quantity
      if (product.stocks >= orderItems[i].quantity) {
        product.stocks -= orderItems[i].quantity;
        await product.save(); // Save the updated product stock
      } else {
        return res.status(400).json({
          message: `Not enough stock for product: ${product.name}`,
        });
      }
    }

    // Remove the ordered items from the user's cart
    await User.findByIdAndUpdate(userId, {
      $pull: {
        cart: { product: { $in: productIds } }, // Remove the ordered products from the cart
      },
    });

    // Prepare email details
    const formattedOrderItems = orderItems.map((item) => {
      const product = products.find((p) => p._id.toString() === item.product);
      return {
        productName: product.product_name,
        quantity: item.quantity,
        price: product.price, // Assuming `price` exists in your Product model
      };
    });

    const grandTotal = totalPrice;
    const shippingAddress = shippingInfo.address;
    const shippingFee = shippingPrice;
    // Send order confirmation email
    try {
      await sendOrderConfirmationEmail(
        user.email,
        user.name,
        order._id.toString(),
        formattedOrderItems,
        grandTotal,
        shippingAddress,
        shippingFee
      );
    } catch (emailError) {
      console.error("Error sending order confirmation email:", emailError);
      // Proceed with the order even if the email fails
    }

    res.status(201).json({
      message: "Order placed successfully.",
      order,
    });
  } catch (error) {
    console.error("Error placing order:", error);
    res.status(500).json({ message: "Error placing the order. Please try again." });
  }
};


// export const getUserOrders = async (req, res) => {
//   try {
//     const orders = await Order.find({ user: req.user._id }).populate(
//       "orderItems.product",
//       "product_name price"
//     ); // Populates product details if needed
//     res.status(200).json(orders);
//   } catch (error) {
//     res.status(500).json({ message: "Failed to fetch orders", error: error.message });
//   }

// };


export const getUserOrders = async (req, res) => {
  try {
    // Find orders for the user
    const orders = await Order.find({ user: req.user._id })
      .populate("orderItems.product", "product_name price reviews") // Populate product details and reviews
      .exec();

    // Check if the user has reviewed the product in each order
    const ordersWithReviewStatus = orders.map(order => {
      order.orderItems = order.orderItems.map(item => {
        // Check if a review already exists for this product and order
        const hasReviewed = item.product.reviews.some(
          (review) =>
            review.user.toString() === req.user._id.toString() &&
            review.orderID.toString() === order._id.toString()
        );

        return {
          ...item._doc,
          hasReviewed,  // Add a flag for already reviewed
        };
      });

      return order;
    });

    // Send the orders with the review status
    res.status(200).json(ordersWithReviewStatus);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch orders", error: error.message });
  }
};


export const getStats = async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments();
    const totalProducts = await Product.countDocuments();
    const totalUsers = await User.countDocuments();

    res.status(200).json({
      totalOrders,
      totalProducts,
      totalUsers,
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ message: 'Error fetching stats' });
  }
};

export const getSalesData = async (req, res) => {
  const { startDate, endDate } = req.query;

  try {
    const orders = await Order.find({
      createdAt: {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      },
    });

    const salesData = orders.map(order => ({
      date: order.createdAt,
      total: order.totalPrice,
    }));

    res.status(200).json(salesData);
  } catch (error) {
    console.error('Error fetching sales data:', error);
    res.status(500).json({ message: 'Error fetching sales data' });
  }
};

export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('orderItems.product');
    if (!order) return res.status(404).json({ message: 'Order not found' });

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate('user').populate('orderItems.product');
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    order.orderStatus = status;
    if (status === 'Delivered') {
      order.deliveredAt = Date.now();
    }
    await order.save();
    res.status(200).json({ success: true, message: 'Order status updated successfully', order });
  } catch (error) {
    res.status(500).json({ message: 'Error updating order status', error: error.message });
  }
};


export const cancelOrder = async (req, res) => {
  const { id } = req.params;

  try {
    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (order.orderStatus === 'Delivered') {
      return res.status(400).json({ message: 'Delivered orders cannot be cancelled.' });
    }

    order.orderStatus = 'Cancelled';
    await order.save();

    res.status(200).json({ message: 'Order cancelled successfully', order });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};



// // reviews
export const createReview = async (req, res) => {
  const { review, rating, userId, orderID } = req.body;  // Include orderID in the body
  const productId = req.params.id;  // Capture productId from the URL parameter

  if (!review || !rating || !userId || !orderID) {  // Check if all required fields are provided
    return res.status(400).json({ message: 'Review, rating, userId, and orderID are required' });
  }

  try {
    // Find the product by ID
    const product = await Product.findById(productId);
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Create a new instance of the bad-words filter
    const filter = new Filter();
    const cleanReview = filter.clean(review);

    // Create a new review object including orderID
    const newReview = {
      orderID,  // Add orderID here
      user: userId,
      rating,
      comment: cleanReview,
    };

    // Add the new review to the product's reviews array
    product.reviews.push(newReview);
    product.numOfReviews = product.reviews.length;

    // Recalculate the average rating of the product
    product.rating = product.reviews.reduce((acc, review) => acc + review.rating, 0) / product.reviews.length;

    // Save the updated product document
    await product.save();

    return res.status(201).json({ message: 'Review submitted successfully' });
  } catch (error) {
    console.error('Error creating review:', error);
    return res.status(500).json({ message: 'Error creating review' });
  }
};



export const getProductsWithReviews = async (req, res) => {
  try {
    // Fetch all products and populate reviews with user name
    const products = await Product.find({})
      .populate({
        path: 'reviews.user', // Populate user details in the reviews
        select: 'name', // Only fetch the user's name
      });

    res.status(200).json({
      success: true,
      products,
    });
  } catch (error) {
    console.error('Error fetching products with reviews:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch products',
    });
  }
};