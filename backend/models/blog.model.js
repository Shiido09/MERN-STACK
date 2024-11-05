import mongoose from 'mongoose';

const BlogSchema = new mongoose.Schema(
  {
    event_name: {
      type: String,
      required: true,
    },
    event_details: {
      type: String,
      required: true,
    },
    event_date: {
      type: Date,
      required: true,
    },
    event_images: [
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
  },
  { timestamps: true } // Automatically add createdAt and updatedAt fields
);

const Blog = mongoose.model('Blog', BlogSchema);
export default Blog;
