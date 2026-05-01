import pool from '../db/pool.js';

export const getAssetAssignments = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT aa.*, a.name as asset_name, u.name as user_name 
       FROM asset_assignments aa
       JOIN assets a ON aa.asset_id = a.id
       JOIN users u ON aa.user_id = u.id
       ORDER BY aa.assigned_date DESC`
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Get asset assignments error:', error);
    res.status(500).json({ error: 'Failed to fetch asset assignments' });
  }
};

export const getAssetAssignmentsByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const result = await pool.query(
      `SELECT aa.*, a.name as asset_name, a.image, u.name as user_name
       FROM asset_assignments aa
       JOIN assets a ON aa.asset_id = a.id
       JOIN users u ON aa.user_id = u.id
       WHERE aa.user_id = $1 AND aa.status = 'active'
       ORDER BY aa.assigned_date DESC`,
      [userId]
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Get user asset assignments error:', error);
    res.status(500).json({ error: 'Failed to fetch asset assignments' });
  }
};

export const getAssetAssignmentsByAsset = async (req, res) => {
  try {
    const { assetId } = req.params;
    const result = await pool.query(
      `SELECT aa.id, aa.user_id, u.name as user_name, u.role, aa.quantity, 
              aa.assigned_date, aa.return_date, aa.status, aa.assigned_by_name
       FROM asset_assignments aa
       JOIN users u ON aa.user_id = u.id
       WHERE aa.asset_id = $1 AND aa.status = 'active'
       ORDER BY aa.assigned_date DESC`,
      [assetId]
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Get asset assignments error:', error);
    res.status(500).json({ error: 'Failed to fetch asset assignments' });
  }
};

export const assignAssets = async (req, res) => {
  try {
    const { asset_id, user_ids, quantities, assigned_by_id, assigned_by_name, return_date } = req.body;

    if (!asset_id || !user_ids || !Array.isArray(user_ids) || user_ids.length === 0) {
      return res.status(400).json({ error: 'Asset ID and user IDs are required' });
    }

    // Check if asset exists and validate total quantity
    const assetResult = await pool.query(
      'SELECT name, image, amount FROM assets WHERE id = $1',
      [asset_id]
    );

    if (assetResult.rows.length === 0) {
      return res.status(404).json({ error: 'Asset not found' });
    }

    const assetName = assetResult.rows[0].name;
    const assetImage = assetResult.rows[0].image;
    const totalAssetAmount = assetResult.rows[0].amount;
    const totalRequested = user_ids.reduce((sum, _, idx) => sum + (quantities[idx] || 1), 0);

    if (totalRequested > totalAssetAmount) {
      return res.status(400).json({ 
        error: `Total quantity (${totalRequested}) exceeds available amount (${totalAssetAmount})` 
      });
    }

    const assignments = [];
    for (let i = 0; i < user_ids.length; i++) {
      const userId = user_ids[i];
      const quantity = quantities[i] || 1;

      // Check if assignment already exists for this user
      const existingResult = await pool.query(
        'SELECT id, quantity FROM asset_assignments WHERE asset_id = $1 AND user_id = $2',
        [asset_id, userId]
      );

      let result;
      if (existingResult.rows.length > 0) {
        // Update existing assignment
        const newQuantity = existingResult.rows[0].quantity + quantity;
        result = await pool.query(
          `UPDATE asset_assignments 
           SET quantity = $1, return_date = $2, updated_at = CURRENT_TIMESTAMP
           WHERE asset_id = $3 AND user_id = $4
           RETURNING *`,
          [newQuantity, return_date || null, asset_id, userId]
        );
      } else {
        // Create new assignment
        result = await pool.query(
          `INSERT INTO asset_assignments (asset_id, user_id, quantity, assigned_by_id, assigned_by_name, return_date, status)
           VALUES ($1, $2, $3, $4, $5, $6, 'active')
           RETURNING *`,
          [asset_id, userId, quantity, assigned_by_id, assigned_by_name, return_date || null]
        );
      }
      assignments.push(result.rows[0]);

      // Create notification for the user
      const notificationMessage = `You have been assigned ${quantity} unit(s) of ${assetName} ${assetImage}`;
      await pool.query(
        `INSERT INTO notifications (user_id, message, type, related_id)
         VALUES ($1, $2, $3, $4)`,
        [userId, notificationMessage, 'asset_assignment', asset_id]
      );
    }

    // Decrement the asset amount
    const newAmount = totalAssetAmount - totalRequested;
    await pool.query(
      'UPDATE assets SET amount = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2',
      [newAmount, asset_id]
    );

    res.status(201).json({ assignments, message: `Assets assigned to ${user_ids.length} user(s)` });
  } catch (error) {
    console.error('Assign assets error:', error);
    res.status(500).json({ error: error.message || 'Failed to assign assets' });
  }
};

export const updateAssignment = async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity, status, return_date } = req.body;

    const result = await pool.query(
      `UPDATE asset_assignments 
       SET quantity = COALESCE($1, quantity), 
           status = COALESCE($2, status),
           return_date = COALESCE($3, return_date),
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $4
       RETURNING *`,
      [quantity, status, return_date, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Assignment not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Update assignment error:', error);
    res.status(500).json({ error: 'Failed to update assignment' });
  }
};

export const returnAsset = async (req, res) => {
  try {
    const { id } = req.params;

    // Get the assignment to find the quantity, asset_id, and user_id
    const assignmentResult = await pool.query(
      'SELECT quantity, asset_id, user_id FROM asset_assignments WHERE id = $1',
      [id]
    );

    if (assignmentResult.rows.length === 0) {
      return res.status(404).json({ error: 'Assignment not found' });
    }

    const { quantity, asset_id, user_id } = assignmentResult.rows[0];

    // Get asset name for notification
    const assetResult = await pool.query(
      'SELECT name, image FROM assets WHERE id = $1',
      [asset_id]
    );
    const assetName = assetResult.rows[0]?.name;
    const assetImage = assetResult.rows[0]?.image;

    // Update assignment status
    const result = await pool.query(
      `UPDATE asset_assignments 
       SET status = 'returned', return_date = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP
       WHERE id = $1
       RETURNING *`,
      [id]
    );

    // Increment asset amount
    await pool.query(
      `UPDATE assets SET amount = amount + $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2`,
      [quantity, asset_id]
    );

    // Create notification for the user
    const notificationMessage = `${quantity} unit(s) of ${assetName} ${assetImage} has been returned`;
    await pool.query(
      `INSERT INTO notifications (user_id, message, type, related_id)
       VALUES ($1, $2, $3, $4)`,
      [user_id, notificationMessage, 'asset_returned', asset_id]
    );

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Return asset error:', error);
    res.status(500).json({ error: 'Failed to return asset' });
  }
};

export const deleteAssignment = async (req, res) => {
  try {
    const { id } = req.params;

    // Get the assignment to find the quantity, asset_id, and user_id
    const assignmentResult = await pool.query(
      'SELECT quantity, asset_id, user_id FROM asset_assignments WHERE id = $1',
      [id]
    );

    if (assignmentResult.rows.length === 0) {
      return res.status(404).json({ error: 'Assignment not found' });
    }

    const { quantity, asset_id, user_id } = assignmentResult.rows[0];

    // Get asset name for notification
    const assetResult = await pool.query(
      'SELECT name, image FROM assets WHERE id = $1',
      [asset_id]
    );
    const assetName = assetResult.rows[0]?.name;
    const assetImage = assetResult.rows[0]?.image;

    // Delete the assignment
    await pool.query(
      'DELETE FROM asset_assignments WHERE id = $1',
      [id]
    );

    // Increment asset amount back
    await pool.query(
      `UPDATE assets SET amount = amount + $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2`,
      [quantity, asset_id]
    );

    // Create notification for the user
    const notificationMessage = `Your assignment of ${quantity} unit(s) of ${assetName} ${assetImage} has been deleted`;
    await pool.query(
      `INSERT INTO notifications (user_id, message, type, related_id)
       VALUES ($1, $2, $3, $4)`,
      [user_id, notificationMessage, 'asset_assignment_deleted', asset_id]
    );

    res.json({ message: 'Assignment deleted successfully' });
  } catch (error) {
    console.error('Delete assignment error:', error);
    res.status(500).json({ error: 'Failed to delete assignment' });
  }
};
