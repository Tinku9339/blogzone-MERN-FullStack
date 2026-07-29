import express from 'express';
import { authenticate } from '../middlewares/authMiddleware.js';
import { upload, uploadToCloudinary } from '../middlewares/uploadMiddleware.js';

const router = express.Router();

// POST /api/upload  — auth-protected image upload
router.post('/', authenticate, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No image file provided' });
    }
    const url = await uploadToCloudinary(req.file.buffer, 'blogzone/blogs');
    res.status(200).json({ success: true, url });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
