import bcryptjs from "bcryptjs";
import crypto from "crypto";
import { generateTokenAndSetCookie } from "../utils/generateTokenAndSetCookie.js";
import {
    sendVerificationEmail,
    sendWelcomeEmail,
    sendPasswordResetEmail,
    sendResetSuccessEmail,
} from "../mailtrap/emails.js";
import { User } from "../models/user.model.js";
import { auth } from "../firebase.js"; // Import Firebase auth
import Product from "../models/product.model.js";

export const signup = async (req, res) => {
    const { name, email, password } = req.body;
  
    try {
      if (!email || !password || !name) {
        throw new Error("All fields are required");
      }
  
      // Check if user already exists in MongoDB
      const userAlreadyExists = await User.findOne({ email });
      if (userAlreadyExists) {
        return res.status(400).json({ success: false, message: "User already exists" });
      }
  
      // Create user in Firebase
      let firebaseUser;
      try {
        firebaseUser = await auth.createUser({
          email,
          password,
        });
        console.log("Firebase user created:", firebaseUser);
      } catch (firebaseError) {
        console.error("Error creating Firebase user:", firebaseError);
        throw new Error(`Firebase Error: ${firebaseError.message}`);
      }
  
      // Hash the password and generate a verification token
      const hashedPassword = await bcryptjs.hash(password, 10);
      const verificationToken = Math.floor(100000 + Math.random() * 900000).toString();
  
      // Create user in MongoDB
      const user = new User({
        email,
        password: hashedPassword,
        name,
        firebaseUid: firebaseUser.uid, // Store Firebase UID
        verificationToken,
        verificationTokenExpiresAt: Date.now() + 24 * 60 * 60 * 1000, // Expires in 24 hours
      });
  
      await user.save();
  
      // Generate JWT and set it in a cookie
      generateTokenAndSetCookie(res, user._id);
  
      // Send verification email
      await sendVerificationEmail(user.email, user.verificationToken);
  
      res.status(201).json({
        success: true,
        message: "User created successfully. Please verify your email.",
        user: {
          ...user._doc,
          password: undefined,
        },
      });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  };

export const login = async (req, res) => {
    const { email, password } = req.body;
    try {
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ success: false, message: "Invalid credentials" });
      }
      const isPasswordValid = await bcryptjs.compare(password, user.password);
  
      if (!isPasswordValid) {
        return res.status(400).json({ success: false, message: "Invalid credentials" });
      }
  
      if (!user.isVerified) {
        return res.status(400).json({ success: false, message: "Email not verified" });
      }
  
      // Verify user in Firebase
      const firebaseUser = await auth.getUserByEmail(email);
      if (!firebaseUser) {
        return res.status(400).json({ success: false, message: "Invalid credentials" });
      }
  
      generateTokenAndSetCookie(res, user._id);
      await user.save();
  
      res.status(200).json({
        success: true,
        message: user.isAdmin ? "Logged in successfully as admin" : "Logged in successfully as user",
        user: {
          ...user._doc,
          password: undefined,
        },
      });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  };
  
  export const googleLogin = async (req, res) => {
    const { idToken } = req.body;
    try {
      const decodedToken = await auth.verifyIdToken(idToken);
      const email = decodedToken.email;
  
      let user = await User.findOne({ email });
      if (!user) {
        // Create a new user if not found
        user = new User({
          email,
          name: decodedToken.name,
          isVerified: true,
        });
        await user.save();
      }
  
      generateTokenAndSetCookie(res, user._id);
      await user.save();
  
      res.status(200).json({
        success: true,
        message: user.isAdmin ? "Logged in successfully as admin" : "Logged in successfully as user",
        user: {
          ...user._doc,
          password: undefined,
        },
      });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  };

export const verifyEmail = async (req, res) => {
    const { code } = req.body;
    try {
        const user = await User.findOne({
            verificationToken: code,
            verificationTokenExpiresAt: { $gt: Date.now() },
        });
        if (!user) {
            throw new Error("Invalid or expired verification code");
        }

        user.isVerified = true;
        user.verificationToken = undefined;
        user.verificationTokenExpiresAt = undefined;
        await user.save();
        await sendWelcomeEmail(user.email, user.name);
        res.status(200).json({
            success: true,
            message: "Email verified successfully",
            user: {
                ...user._doc,
                password: undefined,
            },
        });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

export const logout = async (req, res) => {
    res.clearCookie('token');
    res.status(200).json({
        success: true,
        message: "Logged out successfully"
    });
};

export const forgotPassword = async (req, res) => {
    const { email } = req.body;
    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ success: false, message: "User not found" });
        }

        // Generate reset token
        const resetToken = crypto.randomBytes(20).toString("hex");
        const resetTokenExpiresAt = Date.now() + 1 * 60 * 60 * 1000; // 1 hour

        user.resetPasswordToken = resetToken;
        user.resetPasswordExpiresAt = resetTokenExpiresAt;

        await user.save();

        // Send email
        await sendPasswordResetEmail(user.email, `${process.env.CLIENT_URL}/reset-password/${resetToken}`);

        res.status(200).json({ success: true, message: "Password reset link sent to your email" });
    } catch (error) {
        console.log("Error in forgotPassword ", error);
        res.status(400).json({ success: false, message: error.message });
    }
};

export const resetPassword = async (req, res) => {
    try {
        const { token } = req.params;
        const { password } = req.body;

        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpiresAt: { $gt: Date.now() },
        });

        if (!user) {
            return res.status(400).json({ success: false, message: "Invalid or expired reset token" });
        }

        // Update password
        const hashedPassword = await bcryptjs.hash(password, 10);
        user.password = hashedPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpiresAt = undefined;
        await user.save();

        await sendResetSuccessEmail(user.email);

        res.status(200).json({ success: true, message: "Password reset successful" });
    } catch (error) {
        console.log("Error in resetPassword ", error);
        res.status(400).json({ success: false, message: error.message });
    }
};

// Get all users
export const getUsers = async (req, res, next) => {
    try {
        const users = await User.find(); // Fetch all users
        res.status(200).json({
            success: true,
            count: users.length, // Count the fetched users
            users, // Return the list of users
        });
    } catch (error) {
        console.error("Error fetching users:", error);
        next(new ErrorHandler("Error fetching users", 500)); // Use the ErrorHandler
    }
};

// Get user by ID
export const getUserById = async (req, res) => {
    const { id } = req.params;
    try {
        const user = await User.findById(id).select("-password"); // Exclude password from the result
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        res.status(200).json({
            success: true,
            user,
        });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

export const addToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const userId = req.headers.authorization?.replace('Bearer ', ''); // Extract user ID from the Authorization header

    // Ensure quantity is an integer
    const parsedQuantity = parseInt(quantity, 10);

    if (!productId || isNaN(parsedQuantity) || parsedQuantity < 1) {
      return res.status(400).json({ message: "Valid product ID and quantity are required" });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (parsedQuantity > product.stocks) {
      return res.status(400).json({ message: `Not enough stock. Only ${product.stocks} available` });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if the product already exists in the user's cart
    const productIndex = user.cart.findIndex(item => item.product.toString() === productId);

    if (productIndex !== -1) {
      // If product already exists in the cart, update the quantity
      user.cart[productIndex].quantity += parsedQuantity;

      // Ensure the updated quantity does not exceed the available stock
      if (user.cart[productIndex].quantity > product.stocks) {
        return res.status(400).json({ message: `Cannot add more. Only ${product.stocks} in stock` });
      }
    } else {
      // If product is not in the cart, add it
      user.cart.push({ product: productId, quantity: parsedQuantity });
    }

    // Save the updated user cart
    await user.save();

    // Respond with a success message and the updated cart
    res.status(200).json({ message: "Product added to cart", cart: user.cart });
  } catch (error) {
    console.error("Error adding to cart:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getCart = async (req, res) => {
  const userId = req.params.userId;

  try {
      const user = await User.findById(userId).populate('cart.product'); // Populate product details
      if (!user) {
          return res.status(404).json({ message: "User not found" });
      }
      res.status(200).json(user.cart);
  } catch (error) {
      res.status(500).json({ message: "Server error", error });
  }
};

export const updateCartItemQuantity = async (req, res) => {
  const { userId, productId } = req.params;
  const { quantity } = req.body;

  if (quantity <= 0) {
    return res.status(400).json({ message: 'Quantity must be greater than zero.' });
  }

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found.' });

    const cartItem = user.cart.find(
      (item) => item.product.toString() === productId
    );

    if (!cartItem) {
      return res.status(404).json({ message: 'Product not found in cart.' });
    }

    cartItem.quantity = quantity;
    await user.save();

    res.status(200).json({ message: 'Cart updated successfully.', cart: user.cart });
  } catch (err) {
    res.status(500).json({ message: 'Server error.', error: err.message });
  }
};

// Remove item from cart
export const removeCartItem = async (req, res) => {
  const { userId, productId } = req.params;

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found.' });

    user.cart = user.cart.filter(
      (item) => item.product.toString() !== productId
    );

    await user.save();

    res.status(200).json({ message: 'Item removed successfully.', cart: user.cart });
  } catch (err) {
    res.status(500).json({ message: 'Server error.', error: err.message });
  }
};