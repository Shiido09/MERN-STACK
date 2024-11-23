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
    explanation: {
      type: String,
      required: true,
    },
    reviews: [
      {
        orderID: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Order',
          required: true, 
        },
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
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
    category: {
      type: String,
      enum: [
        'Smart Appliances',
        'Outdoor Appliances',
        'Personal Care Appliances',
        'Small Appliances',
        'Home Comfort Appliances',
        'Cleaning Appliances',
        'Laundry Appliances',
        'Kitchen Appliances',
      ],
      required: true,
    },
  },
  { timestamps: true }
);

const Product = mongoose.model('Product', ProductSchema);
export default Product;