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
    next(new ErrorHandler("Error deleting product", 500));d
  }
};

// READ all products
export const getAllProducts = async (req, res, next) => {
  try {
    const products = await Product.find();

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


// product.controller.js

// export const filterProduct = async (req, res) => {
//   const { categories, priceRange, searchQuery } = req.query;

//   let filters = {};

//   // Logging the query parameters to check them
//   console.log('Request filters:', { categories, priceRange, searchQuery });

//   if (categories) {
//     filters.category = { $in: categories.split(',') };
//   }

//   if (priceRange) {
//     const priceRanges = priceRange.split(',');
//     filters.price = {
//       $gte: parseInt(priceRanges[0].replace('$', '').replace('Under ', '').replace('Above ', '').trim()),
//       $lte: parseInt(priceRanges[1]?.replace('$', '').trim()) || Infinity,
//     };
//   }

//   if (searchQuery) {
//     filters.product_name = { $regex: searchQuery, $options: 'i' };
//   }

//   // Log the filters object before querying the database
//   console.log('Applied filters:', filters);

//   try {
//     const products = await Product.find(filters);

//     // Log the resulting products
//     console.log('Filtered products:', products);

//     res.json({ products });
//   } catch (error) {
//     console.error('Error fetching products:', error.message);
//     res.status(500).json({ message: error.message });
//   }
// };

export const filterProduct = async (req, res) => {
  const { categories, priceRange, searchQuery, minRating } = req.query;

  let filters = {};

  // Logging query parameters
  console.log('Request filters:', { categories, priceRange, searchQuery, minRating });

  // Category filtering
  if (categories) {
    filters.category = { $in: categories.split(',') };
  }

  // Price range filtering
  if (priceRange) {
    const priceRanges = priceRange.split(',');

    // Handle different price ranges
    filters.price = {};

    priceRanges.forEach((range) => {
      if (range.includes('Under')) {
        // Example: Under $5000
        filters.price.$lte = parseInt(range.replace('$', '').replace('Under ', '').trim());
      } else if (range.includes('Above')) {
        // Example: Above $10000
        filters.price.$gte = parseInt(range.replace('$', '').replace('Above ', '').trim());
      } else if (range.includes('-')) {
        // Example: $5000 - $10000
        const [min, max] = range.split('-').map((r) => parseInt(r.replace('$', '').trim()));
        filters.price.$gte = min;
        filters.price.$lte = max;
      }
    });
  }

  // Search query filtering
  if (searchQuery) {
    filters.product_name = { $regex: searchQuery, $options: 'i' };
  }

  try {
    if (minRating) {
      filters.reviews = { 
        $elemMatch: { 
          rating: { $gte: parseFloat(minRating) } 
        } 
      };
    }

    // Regular filtering with or without rating
    const products = await Product.find(filters).populate('reviews.user'); // Populate the user information for reviews

    console.log('Filtered products:', products);
    res.json({ products });
  } catch (error) {
    console.error('Error fetching products:', error.message);
    res.status(500).json({ message: error.message });
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

export const getProductReviews = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id).populate('reviews.user', 'name');
    if (!product) {
      return next(new ErrorHandler('Product not found', 404));
    }
    res.status(200).json({
      success: true,
      reviews: product.reviews,
    });
  } catch (error) {
    console.error('Error fetching product reviews:', error);
    next(new ErrorHandler('Error fetching product reviews', 500));
  }
};

// demo review lang yan para mapagana ko delete, pwede mo naman gawin reference 
// export const createProductReview = async (req, res, next) => {
//   try {
//     const { rating, comment } = req.body;
//     const productId = req.params.id;
//     const userId = req.user._id;

//     const product = await Product.findById(productId);

//     if (!product) {
//       return next(new ErrorHandler('Product not found', 404));
//     }

//     const alreadyReviewed = product.reviews.find(
//       (review) => review.user.toString() === userId.toString()
//     );

//     if (alreadyReviewed) {
//       return next(new ErrorHandler('Product already reviewed', 400));
//     }

//     const review = {
//       user: userId,
//       rating: Number(rating),
//       comment,
//     };

//     product.reviews.push(review);
//     product.numOfReviews = product.reviews.length;

//     product.ratings =
//       product.reviews.reduce((acc, item) => item.rating + acc, 0) /
//       product.reviews.length;

//     await product.save({ validateBeforeSave: false });

//     res.status(201).json({
//       success: true,
//       message: 'Review added successfully',
//     });
//   } catch (error) {
//     console.error('Error creating review:', error);
//     next(new ErrorHandler('Error creating review', 500));
//   }
// };

export const deleteProductReview = async (req, res, next) => {
  try {
    const { productId, reviewId } = req.params;

    const product = await Product.findById(productId);
    if (!product) {
      return next(new ErrorHandler('Product not found', 404));
    }

    const reviewIndex = product.reviews.findIndex(
      (review) => review._id.toString() === reviewId.toString()
    );

    if (reviewIndex === -1) {
      return next(new ErrorHandler('Review not found', 404));
    }

    product.reviews.splice(reviewIndex, 1);
    product.numOfReviews = product.reviews.length;

    product.ratings =
      product.reviews.reduce((acc, item) => item.rating + acc, 0) /
      (product.reviews.length || 1);

    await product.save({ validateBeforeSave: false });

    res.status(200).json({
      success: true,
      message: 'Review deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting review:', error);
    next(new ErrorHandler('Error deleting review', 500));
  }
};