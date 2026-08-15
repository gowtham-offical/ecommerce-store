// Run this script once to populate your database with sample products.
// Usage: npm run seed

require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./models/Product');

const sampleProducts = [
  {
    name: 'Wireless Headphones',
    description: 'Over-ear wireless headphones with noise cancellation and 30-hour battery life.',
    price: 79.99,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500',
    category: 'Electronics',
    stock: 25
  },
  {
    name: 'Smart Watch',
    description: 'Fitness tracking smart watch with heart rate monitor and sleep tracking.',
    price: 129.99,
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500',
    category: 'Electronics',
    stock: 15
  },
  {
    name: 'Canvas Backpack',
    description: 'Durable canvas backpack with laptop compartment, perfect for work or travel.',
    price: 45.5,
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500',
    category: 'Accessories',
    stock: 40
  },
  {
    name: 'Ceramic Coffee Mug',
    description: 'Handmade ceramic coffee mug, microwave and dishwasher safe, 12oz capacity.',
    price: 14.99,
    image: 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=500',
    category: 'Home',
    stock: 60
  },
  {
    name: 'Running Shoes',
    description: 'Lightweight running shoes with breathable mesh upper and cushioned sole.',
    price: 89.99,
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500',
    category: 'Footwear',
    stock: 30
  },
  {
    name: 'Desk Lamp',
    description: 'Adjustable LED desk lamp with three brightness settings and USB charging port.',
    price: 32.0,
    image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=500',
    category: 'Home',
    stock: 20
  },
  {
    name: 'Cotton T-Shirt',
    description: '100% organic cotton t-shirt, available in a relaxed unisex fit.',
    price: 19.99,
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500',
    category: 'Apparel',
    stock: 100
  },
  {
    name: 'Stainless Steel Water Bottle',
    description: 'Insulated stainless steel water bottle that keeps drinks cold for 24 hours.',
    price: 24.99,
    image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=500',
    category: 'Accessories',
    stock: 50
  }
];

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB for seeding...');

    await Product.deleteMany({});
    console.log('Existing products cleared.');

    await Product.insertMany(sampleProducts);
    console.log(`${sampleProducts.length} sample products added successfully.`);

    await mongoose.connection.close();
    console.log('Database connection closed.');
    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error.message);
    process.exit(1);
  }
};

seedDatabase();
