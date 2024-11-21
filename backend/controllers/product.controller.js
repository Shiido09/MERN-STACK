import Product from "../models/product.model.js";
import cloudinary from "../cloudinaryConfig.js";
import ErrorHandler from '../utils/errorHandler.js';

// Helper function to upload a buffer to Cloudinary
const uploadToCloudinary = (buffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream((error, result) => {
      if (error) {
        reject(error);
      } else {
        resolve(result);
      }
    });
    stream.end(buffer);
  });
};

// CREATE a new product
export const createProduct = async (req, res, next) => {
  try {
    const { product_name, price, stocks, category, explanation } = req.body;
    const images = req.files;

    if (!product_name || !price || !stocks || !category || !explanation) {
      return next(new ErrorHandler("All fields are required", 400));
    }

    let imageLinks = [];

    if (images && images.length > 0) {
      for (let i = 0; i < images.length; i++) {
        const result = await uploadToCloudinary(images[i].buffer);
        imageLinks.push({
          public_id: result.public_id,
          url: result.secure_url
        });
      }
    }

    const product = await Product.create({
      product_name,
      price,
      stocks,
      category,
      explanation,
      product_images: imageLinks
    });

    res.status(201).json({
      success: true,
      product,
    });
  } catch (error) {
    console.error("Error creating product:", error);
    next(new ErrorHandler("Error creating product", 500));
  }
};

// UPDATE a product by ID
export const updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return next(new ErrorHandler('Product not found', 404));
    }

    const { product_name, price, stocks, category, explanation } = req.body;
    const images = req.files;

    let imageLinks = [];

    if (images && images.length > 0) {
      // Optionally delete existing images from Cloudinary if needed
      await Promise.all(
        product.product_images.map((image) =>
          cloudinary.uploader.destroy(image.public_id)
        )
      );

      for (let i = 0; i < images.length; i++) {
        const result = await uploadToCloudinary(images[i].buffer);
        imageLinks.push({
          public_id: result.public_id,
          url: result.secure_url
        });
      }
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      {
        product_name,
        price,
        stocks,
        category,
        explanation,
        product_images: imageLinks.length > 0 ? imageLinks : product.product_images
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
    console.error("Error updating product:", error);
    next(new ErrorHandler("Error updating product", 500));
  }
};

// DELETE a product by ID
export const deleteProduct = async (req, res, next) => {
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
    console.error("Error deleting product:", error);
    next(new ErrorHandler("Error deleting product", 500));
  }
};

// READ all products

export const getAllProducts = async (req, res, next) => {
  try {
    const { categories, priceRange, searchQuery } = req.query;

    let filters = {};

    // Filter by category
    if (categories) {
      filters.category = { $in: categories.split(',') }; // Assume categories are passed as a comma-separated string
    }

    // Filter by price range
    if (priceRange) {
      if (priceRange === 'Under $5000') {
        filters.price = { $lt: 5000 };
      } else if (priceRange === '$5000 - $10000') {
        filters.price = { $gte: 5000, $lte: 10000 };
      } else if (priceRange === 'Above $10000') {
        filters.price = { $gt: 10000 };
      }
    }

    // Filter by search query (product name or description)
    if (searchQuery) {
      filters.$or = [
        { product_name: { $regex: searchQuery, $options: 'i' } },  // Case insensitive search
        { explanation: { $regex: searchQuery, $options: 'i' } }
      ];
    }

    // Fetch filtered products
    const products = await Product.find(filters);

    res.status(200).json({
      success: true,
      count: products.length,
      products,
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    next(new ErrorHandler("Error fetching products", 500));
  }
};

// READ a single product by ID
export const getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return next(new ErrorHandler('Product not found', 404));
    }
    res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    console.error("Error fetching product:", error);
    next(new ErrorHandler("Error fetching product", 500));
  }
};