const dotenv = require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const path = require("path");

// Routes
const userRoute = require("./routes/userRoute");
const productRoute = require("./routes/productRoute");
const contactRoute = require("./routes/contactRoute");
const errorHandler = require("./middleWare/errorMiddleware");

const app = express();

// ---------------------
// Middleware
// ---------------------
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());

// ✅ CORS Configuration
app.use(
  cors({
    origin: [
      "http://localhost:3000", // for local dev
      "https://take-home-inventory.netlify.app" // ✅ for deployed frontend
    ],
    credentials: true,
  })
);

// ✅ Serve static files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ---------------------
// Routes
// ---------------------
app.use("/api/users", userRoute);
app.use("/api/products", productRoute);
app.use("/api/contactus", contactRoute);

// ✅ Simple test route (optional)
app.get("/api/test", (req, res) => {
  res.json({ message: "Backend is working ✅" });
});

// ✅ Default home route
app.get("/", (req, res) => {
  res.send("Home Page");
});

// ---------------------
// Error Handling Middleware
// ---------------------
app.use(errorHandler);

// ---------------------
// Connect to MongoDB and Start Server
// ---------------------
const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`✅ Server Running on port ${PORT}`);
    });
  })
  .catch((err) => console.log("❌ DB Connection Error:", err));
