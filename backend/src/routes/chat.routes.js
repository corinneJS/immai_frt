import express from 'express';
import { authenticate } from '../middleware/auth.middleware.js';
import { 
  getChatHistory, 
  sendMessage 
} from '../controllers/chat.controller.js';

const router = express.Router();

router.use(authenticate);

router.get('/history', getChatHistory);
router.post('/message', sendMessage);

export default router;