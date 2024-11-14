import express from 'express';
import { authenticate } from '../middleware/auth.middleware.js';
import { 
  getAllMeditations,
  getMeditationById
} from '../controllers/meditation.controller.js';

const router = express.Router();

router.use(authenticate);

router.get('/', getAllMeditations);
router.get('/:id', getMeditationById);

export default router;