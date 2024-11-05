// routes/brand.route.js
import express from "express";
import { createBrand, getAllBrands, getBrandById, updateBrand, deleteBrand } from "../controllers/brand.controller.js";
import upload from "../utils/multer.js"; // Import the multer configuration
import { isAuthenticatedUser, authorizeAdmin } from "../middleware/authUsers.js";
const router = express.Router();

// Create a brand (requires file upload)
router.post("/", isAuthenticatedUser, authorizeAdmin,upload.array("brand_images", 5), createBrand);

// Get all brands
router.get("/", isAuthenticatedUser, authorizeAdmin,getAllBrands);

// Get a brand by ID
router.get("/:id", isAuthenticatedUser, authorizeAdmin,getBrandById);

// Update a brand by ID (requires file upload)
router.put("/:id",isAuthenticatedUser,authorizeAdmin ,upload.array("brand_images", 5),updateBrand);

// Delete a brand by ID
router.delete("/:id",isAuthenticatedUser,authorizeAdmin ,deleteBrand);

export default router;
