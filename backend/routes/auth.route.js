import express from "express";
import { signup, login, googleLogin, logout, verifyEmail, forgotPassword, resetPassword, getUsers, getUserById, addToCart } from "../controllers/auth.controller.js";
import { isAuthenticatedUser, authorizeAdmin } from "../middleware/authUsers.js"; // Only use these two now

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post('/google-login', googleLogin);
router.post("/logout", logout);
router.post("/verify-email", verifyEmail);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);

// Updated routes
router.get("/users", isAuthenticatedUser, authorizeAdmin, getUsers); // Get all users
router.get("/user/:id", isAuthenticatedUser, getUserById); // Get user by ID
router.post("/signup", signup);

//cart
router.post('/add', addToCart);

export default router;
