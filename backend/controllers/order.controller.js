import Order from '../models/order.model.js';  // Import the Order model
import Product from '../models/product.model.js';  // Import the Product model to check product availability
import { User } from '../models/user.model.js';  // Import the User model to get user details (if needed)

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
    const productIds = orderItems.map(item => item.product);
    const products = await Product.find({ _id: { $in: productIds } });

    if (products.length !== orderItems.length) {
      return res.status(404).json({ message: 'One or more products not found.' });
    }

    // Check if quantities are available for each product
    for (let i = 0; i < orderItems.length; i++) {
      const product = products.find(p => p._id.toString() === orderItems[i].product);
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
        await product.save();  // Save the updated product stock
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

    res.status(201).json({
      message: 'Order placed successfully.',
      order,
    });
  } catch (error) {
    console.error('Error placing order:', error);
    res.status(500).json({ message: 'Error placing the order. Please try again.' });
  }
};




export const getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).populate(
      "orderItems.product",
      "product_name price"
    ); // Populates product details if needed
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch orders", error: error.message });
  }

};