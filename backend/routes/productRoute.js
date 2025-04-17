const express = require("express");
const router = express.Router();
const multer = require("multer");
const protect = require("../middleWare/authMiddleware");
const {
  createProduct,
  getProducts,
  getProduct,
  deleteProduct,
  updateProduct,
} = require("../controllers/productController");
const { upload } = require("../utils/fileUpload");

// Configure Multer to store file temporarily (Remove if you are using `upload` from `fileUpload.js`)
const storage = multer.diskStorage({});
const tempUpload = multer({ storage });

router.post("/create", tempUpload.single("image"), createProduct);
router.post("/", protect, upload.single("image"), createProduct);
router.patch("/:id", protect, upload.single("image"), updateProduct);
router.get("/", protect, getProducts);
router.get("/:id", protect, getProduct);
router.delete("/:id", protect, deleteProduct);

module.exports = router;
