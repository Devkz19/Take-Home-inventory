const asyncHandler = require("express-async-handler");
const Product = require("../models/productModel");
const { fileSizeFormatter } = require("../utils/fileUpload");
const cloudinary = require("cloudinary").v2;
const dotenv = require("dotenv");

dotenv.config();

// Cloudinary Configuration (Ensure it's set in .env)
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// 🔹 Helper function to handle image upload to Cloudinary
const uploadImage = async (file) => {
  try {
    const uploadedFile = await cloudinary.uploader.upload(file.path, {
      folder: "photos",
      resource_type: "image",
    });

    return {
      fileName: file.originalname,
      filePath: uploadedFile.secure_url,
      fileType: file.mimetype,
      fileSize: fileSizeFormatter(file.size, 2),
    };
  } catch (error) {
    console.error("Error uploading image to Cloudinary:", error);
    throw new Error("Image could not be uploaded");
  }
};

// ✅ **Create Product**
const createProduct = asyncHandler(async (req, res) => {
  const { name, sku, category, quantity, price, description } = req.body;

  if (!name || !category || !quantity || !price || !description) {
    res.status(400);
    throw new Error("Please fill in all fields");
  }

  let fileData = {};
  if (req.file) {
    try {
      fileData = await uploadImage(req.file);
    } catch (error) {
      res.status(500);
      throw new Error("Image upload failed");
    }
  }

  const product = await Product.create({
    user: req.user.id,
    name,
    sku,
    category,
    quantity,
    price,
    description,
    image: fileData,
  });

  res.status(201).json(product);
});

// ✅ **Get All Products**
const getProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({ user: req.user.id }).sort("-createdAt");
  res.status(200).json(products);
});

// ✅ **Get Single Product**
const getProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }
  if (product.user.toString() !== req.user.id) {
    res.status(401);
    throw new Error("User not authorized");
  }
  res.status(200).json(product);
});

// ✅ **Delete Product**
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }
  if (product.user.toString() !== req.user.id) {
    res.status(401);
    throw new Error("User not authorized");
  }

  // Delete image from Cloudinary (if exists)
  if (product.image?.filePath) {
    const publicId = product.image.filePath.split("/").pop().split(".")[0];
    await cloudinary.uploader.destroy(`photos/${publicId}`);
  }

  await product.deleteOne();
  res.status(200).json({ message: "Product deleted successfully" });
});

// ✅ **Update Product**
const updateProduct = asyncHandler(async (req, res) => {
  const { name, category, quantity, price, description } = req.body;
  const { id } = req.params;

  const product = await Product.findById(id);
  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }
  if (product.user.toString() !== req.user.id) {
    res.status(401);
    throw new Error("User not authorized");
  }

  let fileData = product.image; // Retain old image if not updating
  if (req.file) {
    if (product.image?.filePath) {
      // Delete old image from Cloudinary before uploading new one
      const publicId = product.image.filePath.split("/").pop().split(".")[0];
      await cloudinary.uploader.destroy(`photos/${publicId}`);
    }
    try {
      fileData = await uploadImage(req.file);
    } catch (error) {
      res.status(500);
      throw new Error("Image upload failed");
    }
  }

  // Update product details
  const updatedProduct = await Product.findByIdAndUpdate(
    id,
    { name, category, quantity, price, description, image: fileData },
    { new: true, runValidators: true }
  );

  res.status(200).json(updatedProduct);
});

module.exports = {
  createProduct,
  getProducts,
  getProduct,
  deleteProduct,
  updateProduct,
};