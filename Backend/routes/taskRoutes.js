import express from 'express';
import { 
  getTasks, 
  createTask, 
  updateTask, 
  scheduleTask, 
  deleteTask 
} from '../controllers/taskController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

router.get('/', getTasks);
router.post('/', createTask);
router.put('/:id', updateTask);
router.delete('/:id', deleteTask); 

// Route for moving tasks from inbox to timeline
router.put('/:id/schedule', scheduleTask); 

export default router;
