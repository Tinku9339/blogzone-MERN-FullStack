import express from 'express'
import { authenticate } from '../middlewares/authMiddleware.js';
import {getMe,updateProfile,changePassword} from '../controllers/profileController.js'
const router = express.Router();

router.get('/getMe', authenticate , getMe)
router.put('/update', authenticate ,updateProfile)
router.put('/change-password', authenticate ,changePassword)

export default router;
