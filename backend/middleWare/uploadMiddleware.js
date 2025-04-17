const multer = require("multer");
const path = require("path");

// Configure Storage Engine
const storage = multer.diskStorage({
  destination: "./uploads", // Ensure 'uploads' folder exists
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Rename file
  },
});

// File Upload Middleware
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB file size limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
    if (!allowedTypes.includes(file.mimetype)) {
      return cb(new Error("Only JPEG, JPG, and PNG files are allowed!"));
    }
    cb(null, true);
  },
});

module.exports = upload;
