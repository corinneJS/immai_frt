import express from 'express';
import { authenticate } from '../middleware/auth.middleware.js';
import { 
  getUserProfile,
  updateUserProfile,
  updateUserSettings
} from '../controllers/user.controller.js';

const router = express.Router();

router.use(authenticate);

router.get('/profile', getUserProfile);
router.patch('/profile', updateUserProfile);
router.patch('/settings', updateUserSettings);

export default router;