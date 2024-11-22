import express from 'express';
import { placeOrder, getUserOrders, getStats, getSalesData } from '../controllers/order.controller.js';
import { isAuthenticatedUser, authorizeAdmin } from "../middleware/authUsers.js";

const router = express.Router();

// Route to place an order
router.post('/placeOrder', placeOrder);
router.get("/my-orders", isAuthenticatedUser, getUserOrders);
router.get("/stats", isAuthenticatedUser, authorizeAdmin, getStats);
router.get("/sales", isAuthenticatedUser, authorizeAdmin, getSalesData);

export default router;
