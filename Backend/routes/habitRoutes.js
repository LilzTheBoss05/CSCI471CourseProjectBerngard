import express from 'express';
import { 
  getHabits, 
  createHabit, 
  updateHabit, 
  deleteHabit, 
  toggleHabit 
} from '../controllers/habitController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Apply protection to all routes below
router.use(protect);

router.route('/')
  .get(getHabits)    // GET all habits for the logged-in user
  .post(createHabit); // CREATE a new habit

router.route('/:id')
  .put(updateHabit)    // UPDATE habit details
  .delete(deleteHabit); // DELETE a habit

router.route('/:id/toggle')
  .patch(toggleHabit); // TOGGLE completion status

export default router;
