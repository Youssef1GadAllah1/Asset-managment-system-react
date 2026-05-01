import express from 'express';
import {
  getNotifications,
  getAllNotifications,
  createNotification,
  markAsRead,
  deleteNotification,
  getUnreadCount
} from '../controllers/notificationController.js';

const router = express.Router();

router.get('/', getAllNotifications);
router.get('/user/:userId', getNotifications);
router.post('/', createNotification);
router.put('/:id/read', markAsRead);
router.delete('/:id', deleteNotification);
router.get('/user/:userId/unread-count', getUnreadCount);

export default router;
