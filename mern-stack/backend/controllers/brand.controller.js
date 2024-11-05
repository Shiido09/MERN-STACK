// controllers/brand.controller.js
import Brand from "../models/brand.model.js";
import cloudinary from "../cloudinaryConfig.js";
import upload from "../utils/multer.js"; // Import multer configuration
import ErrorHandler from '../utils/errorHandler.js'; // Import custom error handler

// CREATE a new brand
export const createBrand = async (req, res, next) => {
    try {
        const { brand_name } = req.body; // Extract brand_name from request body
        const images = req.files; // Access uploaded files from req.files

        // Check if brand_name is provided
        if (!brand_name) {
            return next(new ErrorHandler("Brand name is required", 400));
        }

        let imageLinks = [];

        // Handle image uploads to Cloudinary
        if (images && images.length > 0) {
            for (let i = 0; i < images.length; i++) {
                const result = await cloudinary.uploader.upload(images[i].path, {
                    folder: 'brands' // Upload images to 'brands' folder in Cloudinary
                });
                imageLinks.push({
                    public_id: result.public_id,
                    url: result.secure_url
                });
            }
        }

        // Create the brand with brand_name and image links
        const brand = await Brand.create({
            brand_name,
            brand_images: imageLinks // Save the image links (or empty array)
        });

        res.status(201).json({
            success: true,
            brand
        });
    } catch (error) {
        console.error(error); // Log any errors for debugging
        next(new ErrorHandler("Error creating brand", 500));
    }
};

// READ all brands
export const getAllBrands = async (req, res, next) => {
  try {
    const brands = await Brand.find();
    res.status(200).json({
      success: true,
      count: brands.length,
      brands
    });
  } catch (error) {
    next(new ErrorHandler("Error fetching brands", 500));
  }
};

// READ a single brand by ID
export const getBrandById = async (req, res, next) => {
  try {
    const brand = await Brand.findById(req.params.id);
    if (!brand) {
      return next(new ErrorHandler('Brand not found', 404));
    }
    res.status(200).json({
      success: true,
      brand
    });
  } catch (error) {
    next(new ErrorHandler("Error fetching brand", 500));
  }
};

// UPDATE a brand by ID
export const updateBrand = async (req, res, next) => {
  try {
    const brand = await Brand.findById(req.params.id);
    if (!brand) {
      return next(new ErrorHandler('Brand not found', 404));
    }

    // Handle image uploads
    let imageLinks = [];

    if (req.files && req.files.length > 0) {
      // Delete existing images from Cloudinary
      await Promise.all(
        brand.brand_images.map((image) =>
          cloudinary.uploader.destroy(image.public_id)
        )
      );

      for (let i = 0; i < req.files.length; i++) {
        const result = await cloudinary.uploader.upload(req.files[i].path, {
          folder: 'brands'
        });
        imageLinks.push({
          public_id: result.public_id,
          url: result.secure_url
        });
      }
    }

    // Update the brand details
    const updatedBrand = await Brand.findByIdAndUpdate(
      req.params.id,
      {
        ...req.body,
        brand_images: imageLinks.length > 0 ? imageLinks : brand.brand_images // Retain existing images if none are uploaded
      },
      {
        new: true,
        runValidators: true,
        useFindAndModify: false
      }
    );

    res.status(200).json({
      success: true,
      updatedBrand
    });
  } catch (error) {
    next(new ErrorHandler("Error updating brand", 500));
  }
};

// DELETE a brand by ID
export const deleteBrand = async (req, res, next) => {
  try {
    const brand = await Brand.findById(req.params.id);
    if (!brand) {
      return next(new ErrorHandler('Brand not found', 404));
    }

    // Delete each image from Cloudinary
    await Promise.all(
      brand.brand_images.map((image) =>
        cloudinary.uploader.destroy(image.public_id)
      )
    );

    await Brand.findByIdAndDelete(req.params.id);
    res.status(200).json({
      success: true,
      message: 'Brand deleted successfully'
    });
  } catch (error) {
    next(new ErrorHandler("Error deleting brand", 500));
  }
};
