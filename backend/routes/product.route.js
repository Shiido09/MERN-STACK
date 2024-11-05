// routes/product.route.js
import express from "express";
import { createProduct, getAllProducts, getProductById, updateProduct, deleteProduct } from "../controllers/product.controller.js";
import multer from "multer";
import { isAuthenticatedUser, authorizeAdmin } from "../middleware/authUsers.js";
const router = express.Router();
const upload = multer({ dest: "uploads/" }); // Adjust if you have a specific multer config

// Create a product (can be done without images)
router.post("/", isAuthenticatedUser, authorizeAdmin,upload.array("product_images", 5), createProduct);

// Get all products
router.get("/",isAuthenticatedUser, authorizeAdmin ,getAllProducts);

// Get a product by ID
router.get("/:id",isAuthenticatedUser, authorizeAdmin ,getProductById);

// Update a product by ID (can be done with images)
router.put("/:id",isAuthenticatedUser, authorizeAdmin, upload.array("product_images", 5), updateProduct);

// Delete a product by ID
router.delete("/:id",isAuthenticatedUser, authorizeAdmin,deleteProduct);

export default router;
