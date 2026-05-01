import express from 'express';
import {
  getMessages,
  sendMessage,
  markMessagesAsRead,
  getConversations
} from '../controllers/chatController.js';

const router = express.Router();

router.get('/conversations/:userId', getConversations);
router.get('/messages/:userId/:otherId', getMessages);
router.post('/messages', sendMessage);
router.put('/messages/read', markMessagesAsRead);

export default router;
