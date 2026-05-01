import pool from '../db/pool.js';

export const getMessages = async (req, res) => {
  try {
    const { userId, otherId } = req.params;
    const result = await pool.query(
      `SELECT * FROM chat_messages 
       WHERE (sender_id = $1 AND receiver_id = $2) OR (sender_id = $2 AND receiver_id = $1)
       ORDER BY created_at ASC`,
      [userId, otherId]
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Get messages error:', error);
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { sender_id, receiver_id, message } = req.body;

    if (!sender_id || !receiver_id || !message) {
      return res.status(400).json({ error: 'Sender, receiver, and message are required' });
    }

    const result = await pool.query(
      `INSERT INTO chat_messages (sender_id, receiver_id, message)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [sender_id, receiver_id, message]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({ error: 'Failed to send message' });
  }
};

export const markMessagesAsRead = async (req, res) => {
  try {
    const { senderId, receiverId } = req.body;

    const result = await pool.query(
      `UPDATE chat_messages 
       SET is_read = true 
       WHERE sender_id = $1 AND receiver_id = $2 AND is_read = false
       RETURNING *`,
      [senderId, receiverId]
    );

    res.json(result.rows);
  } catch (error) {
    console.error('Mark messages as read error:', error);
    res.status(500).json({ error: 'Failed to update messages' });
  }
};

export const getConversations = async (req, res) => {
  try {
    const { userId } = req.params;
    const result = await pool.query(
      `SELECT DISTINCT 
        CASE 
          WHEN sender_id = $1 THEN receiver_id 
          ELSE sender_id 
        END as other_user_id
       FROM chat_messages 
       WHERE sender_id = $1 OR receiver_id = $1`,
      [userId]
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Get conversations error:', error);
    res.status(500).json({ error: 'Failed to fetch conversations' });
  }
};
