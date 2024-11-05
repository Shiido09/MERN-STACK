import express from "express";
import { createBlog, getAllBlogs, getBlogById, updateBlog, deleteBlog } from "../controllers/blog.controller.js";
import multer from "multer";
import { isAuthenticatedUser, authorizeAdmin } from "../middleware/authUsers.js";

const router = express.Router();
const upload = multer({ dest: "uploads/" });

// Create a blog (requires authentication and admin authorization)
router.post("/", isAuthenticatedUser, authorizeAdmin, upload.array("event_images", 5), createBlog);

// Get all blogs (requires authentication)
router.get("/", isAuthenticatedUser, authorizeAdmin ,getAllBlogs);

// Get a blog by ID
router.get("/:id", isAuthenticatedUser,authorizeAdmin, getBlogById);

// Update a blog by ID (requires authentication and admin authorization)
router.put("/:id", isAuthenticatedUser, authorizeAdmin, upload.array("event_images", 5), updateBlog);

// Delete a blog by ID (requires authentication and admin authorization)
router.delete("/:id", isAuthenticatedUser, authorizeAdmin, deleteBlog);

export default router;
