import express from "express";
import { signup, login, logout, verifyEmail, forgotPassword, resetPassword, getUsers, getUserById } from "../controllers/auth.controller.js";
import { isAuthenticatedUser, authorizeAdmin } from "../middleware/authUsers.js"; // Only use these two now

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.post("/verify-email", verifyEmail);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);

// Updated routes
router.get("/users", isAuthenticatedUser, authorizeAdmin, getUsers); // Get all users
router.get("/user/:id", isAuthenticatedUser, getUserById); // Get user by ID

export default router;
