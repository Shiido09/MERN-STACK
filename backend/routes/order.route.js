import express from 'express';
import { placeOrder, getUserOrders, getStats, getSalesData, getOrderById, getAllOrders, updateOrderStatus, cancelOrder,  createReview, getProductsWithReviews  } from '../controllers/order.controller.js';
import { isAuthenticatedUser, authorizeAdmin } from "../middleware/authUsers.js";

const router = express.Router();

router.post('/placeOrder', placeOrder);
router.get("/my-orders", isAuthenticatedUser, getUserOrders);
router.get("/stats", isAuthenticatedUser, authorizeAdmin, getStats);
router.get("/sales", isAuthenticatedUser, authorizeAdmin, getSalesData);
router.get('/:id', getOrderById);
router.get('/', getAllOrders);
router.put('/:id/status', isAuthenticatedUser, updateOrderStatus);

router.put('/cancel/:id', cancelOrder);

// reviews
router.post('/review/:id', createReview);
router.get('/getReviews', getProductsWithReviews);

export default router;
