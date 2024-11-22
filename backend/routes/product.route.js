import express from "express";
import { createProduct, updateProduct, deleteProduct, getAllProducts, getProductById, filterProduct, getProductReviews, deleteProductReview } from "../controllers/product.controller.js";
import upload from "../utils/multer.js";
import { isAuthenticatedUser, authorizeAdmin } from "../middleware/authUsers.js";

const router = express.Router();


router.get("/filter", filterProduct);

router.post("/", isAuthenticatedUser, authorizeAdmin, upload.array("product_images", 5), createProduct);
router.put("/:id", isAuthenticatedUser, authorizeAdmin, upload.array("product_images", 5), updateProduct);
router.delete("/:id", isAuthenticatedUser, authorizeAdmin, deleteProduct);
router.get("/", getAllProducts);
router.get("/:id", isAuthenticatedUser, authorizeAdmin, getProductById);
router.get('/:id/reviews', getProductReviews);
// router.post('/:id/review', isAuthenticatedUser, createProductReview);
router.delete('/:productId/review/:reviewId', isAuthenticatedUser, authorizeAdmin, deleteProductReview);


export default router;