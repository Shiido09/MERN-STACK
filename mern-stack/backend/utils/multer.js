// utils/multer.js
import multer from 'multer'; // Change to ES module import
import path from 'path'; // Change to ES module import

const storage = multer.diskStorage({
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // Rename file with timestamp to prevent conflicts
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Limit file size to 5MB
});

export default upload; // Use ES module export
