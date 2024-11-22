import express from 'express';
import { placeOrder, getUserOrders } from '../controllers/order.controller.js';
import { isAuthenticatedUser } from "../middleware/authUsers.js";

const router = express.Router();

// Route to place an order
router.post('/placeOrder', placeOrder);
router.get("/my-orders", isAuthenticatedUser, getUserOrders);

export default router;
