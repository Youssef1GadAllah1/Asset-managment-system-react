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

    console.log('[v0] Attempting login for:', email);
    const result = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );

    console.log('[v0] Query result rows:', result.rows.length);

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const user = result.rows[0];
    console.log('[v0] User found, comparing password...');
    const validPassword = await bcrypt.compare(password, user.password);

    console.log('[v0] Password valid:', validPassword);

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
    console.error('[v0] Login error:', error.message, error);
    res.status(500).json({ error: 'Failed to login', details: error.message });
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
