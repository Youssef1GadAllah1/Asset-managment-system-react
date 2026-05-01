import express from 'express';
import { register, login, getCurrentUser, getAllUsers } from '../controllers/authController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', authenticateToken, getCurrentUser);
router.get('/users/all', authenticateToken, getAllUsers);

export default router;
