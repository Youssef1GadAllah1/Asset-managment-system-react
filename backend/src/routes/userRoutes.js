import express from 'express';
import { 
  createUserAccount,
  getUserById,
  updateUserAccount,
  deleteUserAccount,
  getAllUsers,
  updateProfileImage
} from '../controllers/authController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.get('/', authenticateToken, getAllUsers);
router.post('/', authenticateToken, createUserAccount);
router.get('/:id', authenticateToken, getUserById);
router.put('/:id', authenticateToken, updateUserAccount);
router.put('/:id/profile-image', authenticateToken, updateProfileImage);
router.delete('/:id', authenticateToken, deleteUserAccount);

export default router;
