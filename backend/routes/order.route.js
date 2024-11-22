import express from 'express';
import { placeOrder } from '../controllers/order.controller.js';

const router = express.Router();

// Route to place an order
router.post('/placeOrder', placeOrder);

export default router;
