import mongoose from 'mongoose';

const BrandSchema = new mongoose.Schema({
    brand_name: {
        type: String,
        required: true,
    },
    brand_images: [
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
}, { timestamps: true });

const Brand = mongoose.model('Brand', BrandSchema);
export default Brand; // Default export
