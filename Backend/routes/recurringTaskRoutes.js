import express from 'express';
import { createRecurringTask, getRecurringTasks, updateRecurringTask, deleteRecurringTask } from '../controllers/recurringTaskController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.use(authenticate); // all routes require auth

router.post('/', createRecurringTask);
router.get('/', getRecurringTasks);
router.put('/:id', updateRecurringTask);
router.delete('/:id', deleteRecurringTask);

export default router;
