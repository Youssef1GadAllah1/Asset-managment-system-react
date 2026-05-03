import express from 'express';
import { 
  register, 
  login, 
  getCurrentUser, 
  getAllUsers, 
  changePassword,
  createUserAccount,
  getUserById,
  updateUserAccount,
  deleteUserAccount
} from '../controllers/authController.js';
import {
  forgotPassword,
  verifyOtp,
  resetPassword,
} from '../controllers/passwordResetController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Auth endpoints
router.post('/register', register);
router.post('/login', login);
router.get('/me', authenticateToken, getCurrentUser);
router.get('/users/all', authenticateToken, getAllUsers);
router.post('/change-password', authenticateToken, changePassword);

// Password reset (public — no auth required)
router.post('/forgot-password', forgotPassword);
router.post('/verify-otp', verifyOtp);
router.post('/reset-password', resetPassword);

export default router;
