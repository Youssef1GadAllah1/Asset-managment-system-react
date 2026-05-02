import express from 'express';
import { 
  createUserAccount,
  getUserById,
  updateUserAccount,
  deleteUserAccount,
  getAllUsers
} from '../controllers/authController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Get all users
router.get('/', authenticateToken, getAllUsers);

// Create a new user
router.post('/', authenticateToken, createUserAccount);

// Get user by ID
router.get('/:id', authenticateToken, getUserById);

// Update user
router.put('/:id', authenticateToken, updateUserAccount);

// Delete user
router.delete('/:id', authenticateToken, deleteUserAccount);

export default router;
