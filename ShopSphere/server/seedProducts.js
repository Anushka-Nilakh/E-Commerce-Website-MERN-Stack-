const mongoose = require("mongoose");
require("dotenv").config();

const Product = require("./models/Product");

const products = [
  {
    name: "Wireless Headphones",
    description: "High quality wireless headphones with clear sound.",
    price: 2499,
    category: "Electronics",
    image:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e",
    stock: 20,
    rating: 4.5,
  },
  {
    name: "Smart Watch",
    description: "Smart watch with fitness tracking and notifications.",
    price: 3999,
    category: "Electronics",
    image:
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30",
    stock: 15,
    rating: 4.3,
  },
  {
    name: "Running Shoes",
    description: "Comfortable running shoes for everyday workouts.",
    price: 2999,
    category: "Footwear",
    image:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff",
    stock: 25,
    rating: 4.7,
  },
  {
    name: "Backpack",
    description: "Durable backpack suitable for college and travel.",
    price: 1499,
    category: "Accessories",
    image:
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62",
    stock: 30,
    rating: 4.4,
  },
];

const seedProducts = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB connected");

    await Product.deleteMany();

    await Product.insertMany(products);

    console.log("Products seeded successfully");

    process.exit(0);
  } catch (error) {
    console.error("Seeding failed:", error.message);

    process.exit(1);
  }
};

seedProducts();