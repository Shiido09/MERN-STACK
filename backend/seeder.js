import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from './models/product.model.js'; // Adjust the path if necessary

dotenv.config(); // Load environment variables from .env file

const categories = [
  'Smart Appliances',
  'Outdoor Appliances',
  'Personal Care Appliances',
  'Small Appliances',
  'Home Comfort Appliances',
  'Cleaning Appliances',
  'Laundry Appliances',
  'Kitchen Appliances',
];

const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);

const generateProducts = (numProducts) => {
  const products = [];

  for (let i = 1; i <= numProducts; i++) {
    const randomCategory = categories[getRandomInt(0, categories.length - 1)];

    products.push({
      product_name: `Product ${i}`,
      product_images: [
        {
          public_id: `product_${i}_image`,
          url: `https://example.com/images/product_${i}.jpg`,
        },
      ],
      price: getRandomInt(900, 20000),
      stocks: getRandomInt(10, 100),
      numOfReviews: getRandomInt(0, 5),
      explanation: `This is a description for Product ${i}.`,
      category: randomCategory,
      reviews: [],
    });
  }

  return products;
};
// JOSH PALITAN MO YUNG MONGODB URI, GALING SA ENV MO!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! TINGNAAAAN MO TOOO
const seedProducts = async () => {
  try {  
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://jasergalang:jbgsaseng1017@galangcluster.x3gnr.mongodb.net/?retryWrites=true&w=majority&appName=galangCluster');
    
    // Generate 10 sample products
    const sampleProducts = generateProducts(10);
    await Product.insertMany(sampleProducts);

    console.log('Sample products inserted successfully');
    mongoose.connection.close();
    console.log('Database connection closed');
  } catch (error) {
    console.error('Error during seeding:', error);
    process.exit(1);
  }
};

seedProducts();
