import pool from '../db/pool.js';

export const getAllProducts = async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM products ORDER BY created_at DESC'
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
};

export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      'SELECT * FROM products WHERE id = $1',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({ error: 'Failed to fetch product' });
  }
};

export const createProduct = async (req, res) => {
  try {
    const { name, category, description, price, quantity, reorder_level, supplier, sku, image, status } = req.body;

    if (!name || !category) {
      return res.status(400).json({ error: 'Name and category are required' });
    }

    const result = await pool.query(
      `INSERT INTO products (name, category, description, price, quantity, reorder_level, supplier, sku, image, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
       RETURNING *`,
      [name, category, description, price, quantity || 0, reorder_level || 10, supplier, sku, image || '📦', status || 'active']
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({ error: 'Failed to create product' });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, category, description, price, quantity, reorder_level, supplier, sku, image, status } = req.body;

    const result = await pool.query(
      `UPDATE products SET 
       name = COALESCE($2, name),
       category = COALESCE($3, category),
       description = COALESCE($4, description),
       price = COALESCE($5, price),
       quantity = COALESCE($6, quantity),
       reorder_level = COALESCE($7, reorder_level),
       supplier = COALESCE($8, supplier),
       sku = COALESCE($9, sku),
       image = COALESCE($10, image),
       status = COALESCE($11, status),
       updated_at = CURRENT_TIMESTAMP
       WHERE id = $1
       RETURNING *`,
      [id, name, category, description, price, quantity, reorder_level, supplier, sku, image, status]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({ error: 'Failed to update product' });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      'DELETE FROM products WHERE id = $1 RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({ error: 'Failed to delete product' });
  }
};

export const getLowStockProducts = async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM products WHERE quantity <= reorder_level ORDER BY quantity ASC'
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Get low stock products error:', error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
};
