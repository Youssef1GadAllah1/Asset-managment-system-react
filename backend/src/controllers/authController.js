import pool from '../db/pool.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const register = async (req, res) => {
  try {
    const { name, email, username, password, department } = req.body;

    if (!name || !email || !username || !password) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await pool.query(
      `INSERT INTO users (name, email, username, password, department, role, avatar)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING id, name, email, username, role, department, avatar`,
      [name, email, username, hashedPassword, department, 'user', '👤']
    );

    const user = result.rows[0];
    const token = jwt.sign(
      { id: user.id, name: user.name, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(201).json({ user, token });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ error: 'Failed to register user' });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }

    const result = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const user = result.rows[0];
    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user.id, name: user.name, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    const userData = {
      id: user.id,
      name: user.name,
      email: user.email,
      username: user.username,
      role: user.role,
      department: user.department,
      avatar: user.avatar
    };

    res.json({ user: userData, token });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Failed to login' });
  }
};

export const getCurrentUser = async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, name, email, username, role, department, avatar FROM users WHERE id = $1',
      [req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Get current user error:', error);
    res.status(500).json({ error: 'Failed to get user' });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, name, email, username, role, department, avatar FROM users ORDER BY name ASC'
    );

    res.json(result.rows);
  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({ error: 'Failed to get users' });
  }
};

export const changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const userId = req.user.id;

    if (!oldPassword || !newPassword) {
      return res.status(400).json({ error: 'Old and new passwords are required' });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({ error: 'Password must be at least 8 characters' });
    }

    // Get current user
    const userResult = await pool.query(
      'SELECT password FROM users WHERE id = $1',
      [userId]
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Verify old password
    const validPassword = await bcrypt.compare(oldPassword, userResult.rows[0].password);
    if (!validPassword) {
      return res.status(401).json({ error: 'Current password is incorrect' });
    }

    // Hash new password and update
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await pool.query(
      'UPDATE users SET password = $1 WHERE id = $2',
      [hashedPassword, userId]
    );

    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({ error: 'Failed to change password' });
  }
};

export const createUserAccount = async (req, res) => {
  try {
    const { name, email, username, password, department, role } = req.body;

    if (!name || !email || !username || !password) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await pool.query(
      `INSERT INTO users (name, email, username, password, department, role, avatar)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING id, name, email, username, role, department, avatar`,
      [name, email, username, hashedPassword, department || '', role || 'user', '👤']
    );

    res.status(201).json({ user: result.rows[0] });
  } catch (error) {
    console.error('Create user error:', error);
    if (error.code === '23505') {
      return res.status(400).json({ error: 'Email or username already exists' });
    }
    res.status(500).json({ error: 'Failed to create user' });
  }
};

export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      'SELECT id, name, email, username, role, department, avatar FROM users WHERE id = $1',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Failed to get user' });
  }
};

export const updateUserAccount = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, username, password, department, role } = req.body;

    if (!name || !email || !username) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    let query = `UPDATE users SET name = $1, email = $2, username = $3, department = $4, role = $5`;
    let params = [name, email, username, department || '', role || 'user'];

    // If password is provided, hash it
    if (password && password.length > 0) {
      if (password.length < 8) {
        return res.status(400).json({ error: 'Password must be at least 8 characters' });
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      query += `, password = $6`;
      params.push(hashedPassword);
      query += ` WHERE id = $7`;
      params.push(id);
    } else {
      query += ` WHERE id = $6`;
      params.push(id);
    }

    query += ` RETURNING id, name, email, username, role, department, avatar`;

    const result = await pool.query(query, params);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ user: result.rows[0] });
  } catch (error) {
    console.error('Update user error:', error);
    if (error.code === '23505') {
      return res.status(400).json({ error: 'Email or username already exists' });
    }
    res.status(500).json({ error: 'Failed to update user' });
  }
};

export const deleteUserAccount = async (req, res) => {
  try {
    const { id } = req.params;

    // Prevent deleting the current user
    if (req.user && req.user.id === parseInt(id)) {
      return res.status(400).json({ error: 'Cannot delete your own account' });
    }

    const result = await pool.query(
      'DELETE FROM users WHERE id = $1 RETURNING id',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ error: 'Failed to delete user' });
  }
};
