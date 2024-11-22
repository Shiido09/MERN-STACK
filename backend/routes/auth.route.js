import express from "express";
import { signup, login, googleLogin, logout, verifyEmail, forgotPassword, resetPassword, getUsers, getUserById, addToCart, getCart, updateCartItemQuantity, removeCartItem, updateProfile } from "../controllers/auth.controller.js";
import { isAuthenticatedUser, authorizeAdmin } from "../middleware/authUsers.js"; // Only use these two now
import upload from "../utils/multer.js"; // Import the multer configuration

const router = express.Router();

router.post('/signup', upload.single('profilePicture'), signup);
router.post("/login", login);
router.post('/google-login', googleLogin);
router.post("/logout", logout);
router.post("/verify-email", verifyEmail);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);

// Updated routes
router.get("/users", isAuthenticatedUser, authorizeAdmin, getUsers); // Get all users
router.get("/user/:id", isAuthenticatedUser, getUserById); // Get user by ID


//profile
router.put("/update", upload.single("avatar"), updateProfile);


//cart  
router.post('/add', addToCart);
router.get('/:userId/cart', getCart);
router.put('/:userId/cart/:productId', updateCartItemQuantity);
router.delete('/:userId/cart/:productId', removeCartItem);

export default router;