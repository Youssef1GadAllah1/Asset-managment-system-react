import pool from '../db/pool.js';

export const getNotifications = async (req, res) => {
  try {
    const { userId } = req.params;
    const result = await pool.query(
      'SELECT * FROM notifications WHERE user_id = $1 ORDER BY created_at DESC',
      [userId]
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Get notifications error:', error);
    res.status(500).json({ error: 'Failed to fetch notifications' });
  }
};

export const getAllNotifications = async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM notifications ORDER BY created_at DESC'
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Get all notifications error:', error);
    res.status(500).json({ error: 'Failed to fetch notifications' });
  }
};

export const createNotification = async (req, res) => {
  try {
    const { user_id, message, type, related_id } = req.body;

    if (!user_id || !message) {
      return res.status(400).json({ error: 'User ID and message are required' });
    }

    const result = await pool.query(
      `INSERT INTO notifications (user_id, message, type, related_id)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [user_id, message, type || 'info', related_id]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Create notification error:', error);
    res.status(500).json({ error: 'Failed to create notification' });
  }
};

export const markAsRead = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      'UPDATE notifications SET is_read = true, updated_at = CURRENT_TIMESTAMP WHERE id = $1 RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Notification not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Mark notification as read error:', error);
    res.status(500).json({ error: 'Failed to update notification' });
  }
};

export const deleteNotification = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      'DELETE FROM notifications WHERE id = $1 RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Notification not found' });
    }

    res.json({ message: 'Notification deleted successfully' });
  } catch (error) {
    console.error('Delete notification error:', error);
    res.status(500).json({ error: 'Failed to delete notification' });
  }
};

export const getUnreadCount = async (req, res) => {
  try {
    const { userId } = req.params;
    const result = await pool.query(
      'SELECT COUNT(*) as count FROM notifications WHERE user_id = $1 AND is_read = false',
      [userId]
    );
    res.json({ count: parseInt(result.rows[0].count) });
  } catch (error) {
    console.error('Get unread count error:', error);
    res.status(500).json({ error: 'Failed to fetch unread count' });
  }
};
