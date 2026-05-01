import express from 'express';
import {
  getAllTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  getTasksByUser,
  completeTask
} from '../controllers/taskController.js';

const router = express.Router();

router.get('/', getAllTasks);
router.post('/', createTask);
router.get('/user/:userId', getTasksByUser);
router.get('/:id', getTaskById);
router.put('/:id', updateTask);
router.delete('/:id', deleteTask);
router.put('/:id/complete', completeTask);

export default router;
