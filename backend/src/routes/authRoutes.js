import express from 'express';
import { register, login, getCurrentUser, getAllUsers, changePassword } from '../controllers/authController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', authenticateToken, getCurrentUser);
router.get('/users/all', authenticateToken, getAllUsers);
router.post('/change-password', authenticateToken, changePassword);

export default router;
