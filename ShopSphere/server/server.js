const express = require("express");
const cors = require("cors");
require("dotenv").config();
const productRoutes = require("./routes/productRoutes");
const authRoutes = require("./routes/authRoutes");
const orderRoutes = require("./routes/orderRoutes");
const userRoutes = require("./routes/userRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
const paymentRoutes = require("./routes/paymentRoutes");

const connectDB = require("./config/db");

const app = express();

const PORT = process.env.PORT || 5000;

// Connect MongoDB

connectDB();

// Middleware
app.use(express.json());

app.use(cors());
app.use(
  "/api/products",
  productRoutes
);


app.use("/api/auth", authRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/users", userRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/payment", paymentRoutes);

// Test route

app.get("/", (req, res) => {
  res.json({
    message: "ShopSphere API is running",
  });
});

// Start server

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});