// controllers/blog.controller.js
import Blog from "../models/blog.model.js";
import cloudinary from "../cloudinaryConfig.js"; // Include Cloudinary config
import multer from "multer"; // Include multer for image uploads
import ErrorHandler from '../utils/errorHandler.js'; // Import custom error handler

// CREATE a new blog
export const createBlog = async (req, res, next) => {
  try {
    const { event_name, event_details, event_date } = req.body; // Extract blog details
    const images = req.files; // Access uploaded files

    // Validate required fields
    if (!event_name || !event_details || !event_date) {
      return next(new ErrorHandler("All fields are required", 400));
    }

    let imageLinks = [];

    // Handle image uploads to Cloudinary
    if (images && images.length > 0) {
      for (let i = 0; i < images.length; i++) {
        const result = await cloudinary.uploader.upload(images[i].path, {
          folder: 'blogs' // Upload images to 'blogs' folder in Cloudinary
        });
        imageLinks.push({
          public_id: result.public_id,
          url: result.secure_url
        });
      }
    }

    // Create the blog with details and image links
    const blog = await Blog.create({
      event_name,
      event_details,
      event_date,
      event_images: imageLinks
    });

    res.status(201).json({
      success: true,
      blog,
    });
  } catch (error) {
    console.error(error);
    next(new ErrorHandler("Error creating blog", 500));
  }
};

// READ all blogs
export const getAllBlogs = async (req, res, next) => {
  try {
    const blogs = await Blog.find(); // Fetch all blogs
    res.status(200).json({
      success: true,
      count: blogs.length,
      blogs,
    });
  } catch (error) {
    next(new ErrorHandler("Error fetching blogs", 500));
  }
};

// READ a single blog by ID
export const getBlogById = async (req, res, next) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return next(new ErrorHandler('Blog not found', 404));
    }
    res.status(200).json({
      success: true,
      blog,
    });
  } catch (error) {
    next(new ErrorHandler("Error fetching blog", 500));
  }
};

// UPDATE a blog by ID
export const updateBlog = async (req, res, next) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return next(new ErrorHandler('Blog not found', 404));
    }

    let imageLinks = [];

    // Handle image uploads
    if (req.files && req.files.length > 0) {
      // Optionally delete existing images from Cloudinary
      await Promise.all(
        blog.event_images.map((image) =>
          cloudinary.uploader.destroy(image.public_id)
        )
      );

      for (let i = 0; i < req.files.length; i++) {
        const result = await cloudinary.uploader.upload(req.files[i].path, {
          folder: 'blogs'
        });
        imageLinks.push({
          public_id: result.public_id,
          url: result.secure_url
        });
      }
    }

    // Update the blog details
    const updatedBlog = await Blog.findByIdAndUpdate(
      req.params.id,
      {
        ...req.body,
        event_images: imageLinks.length > 0 ? imageLinks : blog.event_images // Retain existing images if none are uploaded
      },
      {
        new: true,
        runValidators: true,
        useFindAndModify: false
      }
    );

    res.status(200).json({
      success: true,
      updatedBlog
    });
  } catch (error) {
    next(new ErrorHandler("Error updating blog", 500));
  }
};

// DELETE a blog by ID
export const deleteBlog = async (req, res, next) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return next(new ErrorHandler('Blog not found', 404));
    }

    // Delete images from Cloudinary if needed
    await Promise.all(
      blog.event_images.map((image) =>
        cloudinary.uploader.destroy(image.public_id)
      )
    );

    await Blog.findByIdAndDelete(req.params.id);
    res.status(200).json({
      success: true,
      message: 'Blog deleted successfully',
    });
  } catch (error) {
    next(new ErrorHandler("Error deleting blog", 500));
  }
};
