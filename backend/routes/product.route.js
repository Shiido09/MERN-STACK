import express from "express";
import { createProduct, updateProduct, deleteProduct, getAllProducts, getProductById } from "../controllers/product.controller.js";
import upload from "../utils/multer.js";
import { isAuthenticatedUser, authorizeAdmin } from "../middleware/authUsers.js";

const router = express.Router();

router.post("/", isAuthenticatedUser, authorizeAdmin, upload.array("product_images", 5), createProduct);
router.put("/:id", isAuthenticatedUser, authorizeAdmin, upload.array("product_images", 5), updateProduct);
router.delete("/:id", isAuthenticatedUser, authorizeAdmin, deleteProduct);
router.get("/", getAllProducts);
router.get("/:id", isAuthenticatedUser, authorizeAdmin, getProductById);

export default router;