import pool from '../db/pool.js';

// Helper function to create notifications
const createNotification = async (userId, message, type = 'info', relatedId = null) => {
  try {
    await pool.query(
      `INSERT INTO notifications (user_id, message, type, related_id)
       VALUES ($1, $2, $3, $4)`,
      [userId, message, type, relatedId]
    );
  } catch (error) {
    console.error('Failed to create notification:', error);
  }
};

export const getAllTasks = async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM tasks ORDER BY created_at DESC'
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Get tasks error:', error);
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
};

export const getTaskById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      'SELECT * FROM tasks WHERE id = $1',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Task not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Get task error:', error);
    res.status(500).json({ error: 'Failed to fetch task' });
  }
};

export const createTask = async (req, res) => {
  try {
    const { title, description, assigned_to_id, assigned_to_name, assigned_from_id, assigned_from_name, asset_id, status, priority, due_date } = req.body;
    const finalAssignedFromId = assigned_from_id || req.user?.id;
    const finalAssignedFromName = assigned_from_name || req.user?.name;

    if (!title) {
      return res.status(400).json({ error: 'Title is required' });
    }

    const result = await pool.query(
      `INSERT INTO tasks (title, description, assigned_to_id, assigned_to_name, assigned_from_id, assigned_from_name, asset_id, status, priority, due_date)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
       RETURNING *`,
      [title, description, assigned_to_id, assigned_to_name, finalAssignedFromId, finalAssignedFromName, asset_id, status || 'pending', priority || 'normal', due_date]
    );

    const newTask = result.rows[0];

    // Send notification to assigned employee
    if (assigned_to_id) {
      await createNotification(
        assigned_to_id,
        `New task "${title}" has been assigned to you by ${finalAssignedFromName}`,
        'task_assigned',
        newTask.id
      );
    }

    res.status(201).json(newTask);
  } catch (error) {
    console.error('Create task error:', error);
    res.status(500).json({ error: 'Failed to create task' });
  }
};

export const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, assigned_to_id, assigned_to_name, assigned_from_id, assigned_from_name, asset_id, status, priority, due_date, completed_at } = req.body;

    // Get current task to check for changes
    const currentTask = await pool.query('SELECT * FROM tasks WHERE id = $1', [id]);
    if (currentTask.rows.length === 0) {
      return res.status(404).json({ error: 'Task not found' });
    }

    const oldTask = currentTask.rows[0];

    const result = await pool.query(
      `UPDATE tasks SET 
       title = COALESCE($2, title),
       description = COALESCE($3, description),
       assigned_to_id = COALESCE($4, assigned_to_id),
       assigned_to_name = COALESCE($5, assigned_to_name),
       assigned_from_id = COALESCE($6, assigned_from_id),
       assigned_from_name = COALESCE($7, assigned_from_name),
       asset_id = COALESCE($8, asset_id),
       status = COALESCE($9, status),
       priority = COALESCE($10, priority),
       due_date = COALESCE($11, due_date),
       completed_at = CASE WHEN $9 = 'completed' AND completed_at IS NULL THEN CURRENT_TIMESTAMP ELSE COALESCE($12, completed_at) END,
       updated_at = CURRENT_TIMESTAMP
       WHERE id = $1
       RETURNING *`,
      [id, title, description, assigned_to_id, assigned_to_name, assigned_from_id || null, assigned_from_name || null, asset_id, status, priority, due_date, completed_at]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Task not found' });
    }

    const updatedTask = result.rows[0];

    // Send notifications for task assignment changes
    if (assigned_to_id && !oldTask.assigned_to_id) {
      await createNotification(
        assigned_to_id,
        `Task "${updatedTask.title}" has been assigned to you`,
        'task_assigned',
        updatedTask.id
      );
    }

    if (assigned_to_id && oldTask.assigned_to_id && oldTask.assigned_to_id !== assigned_to_id) {
      await createNotification(
        assigned_to_id,
        `Task "${updatedTask.title}" has been reassigned to you`,
        'task_assigned',
        updatedTask.id
      );
      await createNotification(
        oldTask.assigned_to_id,
        `Task "${updatedTask.title}" has been reassigned from you`,
        'task_removed',
        updatedTask.id
      );
    }

    if (!assigned_to_id && oldTask.assigned_to_id) {
      await createNotification(
        oldTask.assigned_to_id,
        `Task "${updatedTask.title}" has been unassigned from you`,
        'task_removed',
        updatedTask.id
      );
    }

    res.json(updatedTask);
  } catch (error) {
    console.error('Update task error:', error);
    res.status(500).json({ error: 'Failed to update task' });
  }
};

export const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      'DELETE FROM tasks WHERE id = $1 RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Task not found' });
    }

    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    console.error('Delete task error:', error);
    res.status(500).json({ error: 'Failed to delete task' });
  }
};

export const getTasksByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const result = await pool.query(
      'SELECT * FROM tasks WHERE assigned_to_id = $1 ORDER BY created_at DESC',
      [userId]
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Get user tasks error:', error);
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
};

export const completeTask = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `UPDATE tasks SET 
       status = 'completed',
       completed_at = CURRENT_TIMESTAMP,
       updated_at = CURRENT_TIMESTAMP
       WHERE id = $1
       RETURNING *`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Task not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Complete task error:', error);
    res.status(500).json({ error: 'Failed to complete task' });
  }
};
