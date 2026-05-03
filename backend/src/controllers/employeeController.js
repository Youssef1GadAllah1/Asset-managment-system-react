import pool from '../db/pool.js';

export const getAllEmployees = async (req, res) => {
  try {
    const currentUserEmail = req.user?.email;

    // Get all employees except the logged-in user
    const result = await pool.query(
      `SELECT e.* FROM employees e 
       WHERE e.email != $1
       ORDER BY e.created_at DESC`,
      [currentUserEmail || '']
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Get employees error:', error);
    res.status(500).json({ error: 'Failed to fetch employees' });
  }
};

export const getEmployeeById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      'SELECT * FROM employees WHERE id = $1',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Employee not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Get employee error:', error);
    res.status(500).json({ error: 'Failed to fetch employee' });
  }
};

export const createEmployee = async (req, res) => {
  try {
    const { name, email, department, position, hire_date, status, phone, avatar } = req.body;

    if (!name || !email) {
      return res.status(400).json({ error: 'Name and email are required' });
    }

    const result = await pool.query(
      `INSERT INTO employees (name, email, department, position, hire_date, status, phone, avatar)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
      [name, email, department, position, hire_date, status || 'active', phone, avatar || '👤']
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Create employee error:', error);
    if (error.code === '23505') {
      return res.status(400).json({ error: 'Email already exists' });
    }
    res.status(500).json({ error: 'Failed to create employee' });
  }
};

export const updateEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, department, position, hire_date, status, phone, avatar } = req.body;

    const result = await pool.query(
      `UPDATE employees SET 
       name = COALESCE($2, name),
       email = COALESCE($3, email),
       department = COALESCE($4, department),
       position = COALESCE($5, position),
       hire_date = COALESCE($6, hire_date),
       status = COALESCE($7, status),
       phone = COALESCE($8, phone),
       avatar = COALESCE($9, avatar),
       updated_at = CURRENT_TIMESTAMP
       WHERE id = $1
       RETURNING *`,
      [id, name, email, department, position, hire_date, status, phone, avatar]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Employee not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Update employee error:', error);
    res.status(500).json({ error: 'Failed to update employee' });
  }
};

export const deleteEmployee = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      'DELETE FROM employees WHERE id = $1 RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Employee not found' });
    }

    res.json({ message: 'Employee deleted successfully' });
  } catch (error) {
    console.error('Delete employee error:', error);
    res.status(500).json({ error: 'Failed to delete employee' });
  }
};
