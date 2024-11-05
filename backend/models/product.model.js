// models/product.model.js
import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema(
  {
    product_name: {
      type: String,
      required: true,
    },
    product_images: [
      {
        public_id: {
          type: String,
          required: false,
        },
        url: {
          type: String,
          required: false,
        },
      },
    ],
    price: {
      type: Number,
      required: true,
    },
    stocks: {
      type: Number,
      required: true,
      default: 0,
    },
    numOfReviews: {
      type: Number,
      default: 0,
    },
    reviews: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
          required: true,
        },
        name: {
          type: String,
          required: true,
        },
        rating: {
          type: Number,
          required: true,
        },
        comment: {
          type: String,
          required: true,
        },
      },
    ],
    brand: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Brand', // Reference to the Brand model
      required: true,
    },
  },
  { timestamps: true }
);

const Product = mongoose.model('Product', ProductSchema);
export default Product; // Default export
