import express from 'express';
import { authenticate } from '../middleware/auth.middleware.js';
import { 
  getUserExercises, 
  createExercise, 
  completeExercise 
} from '../controllers/exercise.controller.js';

const router = express.Router();

router.use(authenticate);

router.get('/', getUserExercises);
router.post('/', createExercise);
router.patch('/:id/complete', completeExercise);

export default router;