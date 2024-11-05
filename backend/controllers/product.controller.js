// controllers/product.controller.js
import Product from "../models/product.model.js";
import cloudinary from "../cloudinaryConfig.js"; // Include this for image uploads
import upload from "../utils/multer.js"; // Import multer configuration
import ErrorHandler from '../utils/errorHandler.js'; // Import custom error handler

// CREATE a new product
export const createProduct = async (req, res, next) => {
  try {
    const { product_name, price, stocks, brand } = req.body; // Extract product details from request body
    const images = req.files; // Access uploaded files from req.files

    // Validate required fields
    if (!product_name || !price || !stocks || !brand) {
      return next(new ErrorHandler("All fields are required", 400));
    }

    let imageLinks = [];

    // Handle image uploads to Cloudinary
    if (images && images.length > 0) {
      for (let i = 0; i < images.length; i++) {
        const result = await cloudinary.uploader.upload(images[i].path, {
          folder: 'products' // Upload images to 'products' folder in Cloudinary
        });
        imageLinks.push({
          public_id: result.public_id,
          url: result.secure_url
        });
      }
    }

    // Create the product with details and image links
    const product = await Product.create({
      product_name,
      price,
      stocks,
      brand,
      product_images: imageLinks // Save the image links
    });

    res.status(201).json({
      success: true,
      product,
    });
  } catch (error) {
    console.error("Error creating product:", error); // Log the error for debugging
    next(new ErrorHandler("Error creating product", 500));
  }
};

// READ all products
export const getAllProducts = async (req, res, next) => {
  try {
    const products = await Product.find().populate('brand'); // Populate brand details
    res.status(200).json({
      success: true,
      count: products.length,
      products,
    });
  } catch (error) {
    console.error("Error fetching products:", error); // Log the error for debugging
    next(new ErrorHandler("Error fetching products", 500));
  }
};

// READ a single product by ID
export const getProductById = async (req, res, next) => {
  console.log("Request received for product ID:", req.params.id); // Log incoming request
  try {
    const product = await Product.findById(req.params.id).populate('brand');
    if (!product) {
      return next(new ErrorHandler('Product not found', 404));
    }
    res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    console.error("Error fetching product:", error); // Log the error for debugging
    next(new ErrorHandler("Error fetching product", 500));
  }
};

// UPDATE a product by ID
export const updateProduct = async (req, res, next) => {
  console.log("Request to update product ID:", req.params.id); // Log incoming request
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return next(new ErrorHandler('Product not found', 404));
    }

    let imageLinks = [];

    // Handle image uploads
    if (req.files && req.files.length > 0) {
      // Optionally, delete existing images from Cloudinary if needed
      await Promise.all(
        product.product_images.map((image) =>
          cloudinary.uploader.destroy(image.public_id)
        )
      );

      for (let i = 0; i < req.files.length; i++) {
        const result = await cloudinary.uploader.upload(req.files[i].path, {
          folder: 'products'
        });
        imageLinks.push({
          public_id: result.public_id,
          url: result.secure_url
        });
      }
    }

    // Update the product details
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      {
        ...req.body,
        product_images: imageLinks.length > 0 ? imageLinks : product.product_images // Retain existing images if none are uploaded
      },
      {
        new: true,
        runValidators: true,
        useFindAndModify: false
      }
    );

    res.status(200).json({
      success: true,
      updatedProduct
    });
  } catch (error) {
    console.error("Error updating product:", error); // Log the error for debugging
    next(new ErrorHandler("Error updating product", 500));
  }
};

// DELETE a product by ID
export const deleteProduct = async (req, res, next) => {
  console.log("Request to delete product ID:", req.params.id); // Log incoming request
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return next(new ErrorHandler('Product not found', 404));
    }

    // Delete images from Cloudinary if needed
    await Promise.all(
      product.product_images.map((image) =>
        cloudinary.uploader.destroy(image.public_id)
      )
    );

    await Product.findByIdAndDelete(req.params.id);
    res.status(200).json({
      success: true,
      message: 'Product deleted successfully',
    });
  } catch (error) {
    console.error("Error deleting product:", error); // Log the error for debugging
    next(new ErrorHandler("Error deleting product", 500));
  }
};
