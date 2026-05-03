import pool from '../db/pool.js';

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

const normalizeAsset = (asset) => ({
  ...asset,
  serial_number: asset.serial_number ?? null,
  serialNumber: asset.serial_number ?? null,
});

export const getAllAssets = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM assets ORDER BY created_at DESC');
    res.json(result.rows.map(normalizeAsset));
  } catch (error) {
    console.error('Get assets error:', error);
    res.status(500).json({ error: 'Failed to fetch assets' });
  }
};

export const getAssetById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM assets WHERE id = $1', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Asset not found' });
    }

    res.json(normalizeAsset(result.rows[0]));
  } catch (error) {
    console.error('Get asset error:', error);
    res.status(500).json({ error: 'Failed to fetch asset' });
  }
};

export const createAsset = async (req, res) => {
  try {
    const { name, category, type, price, date, location, status, color, image, assignedToId, assignedToName, serialNumber } = req.body;

    if (!name || !category) {
      return res.status(400).json({ error: 'Name and category are required' });
    }

    if (serialNumber) {
      const duplicate = await pool.query('SELECT id FROM assets WHERE serial_number = $1', [serialNumber.trim()]);
      if (duplicate.rows.length > 0) {
        return res.status(400).json({ error: 'Serial number must be unique' });
      }
    }

    const result = await pool.query(
      `INSERT INTO assets (name, category, type, price, date, location, status, color, image, serial_number, assigned_to_id, assigned_to_name)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
       RETURNING *`,
      [name, category, type, price, date, location, status || 'available', color, image, serialNumber?.trim() || null, assignedToId, assignedToName]
    );

    res.status(201).json(normalizeAsset(result.rows[0]));
  } catch (error) {
    console.error('Create asset error:', error);
    res.status(500).json({ error: 'Failed to create asset' });
  }
};

export const updateAsset = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, category, type, price, date, location, status, color, image, assignedToId, assignedToName, serialNumber } = req.body;

    const currentAsset = await pool.query('SELECT * FROM assets WHERE id = $1', [id]);
    if (currentAsset.rows.length === 0) {
      return res.status(404).json({ error: 'Asset not found' });
    }

    const oldAsset = currentAsset.rows[0];

    if (serialNumber) {
      const normalizedSerial = serialNumber.trim();
      const duplicate = await pool.query('SELECT id FROM assets WHERE serial_number = $1 AND id <> $2', [normalizedSerial, id]);
      if (duplicate.rows.length > 0) {
        return res.status(400).json({ error: 'Serial number must be unique' });
      }
    }

    const result = await pool.query(
      `UPDATE assets SET 
       name = COALESCE($2, name),
       category = COALESCE($3, category),
       type = COALESCE($4, type),
       price = COALESCE($5, price),
       date = COALESCE($6, date),
       location = COALESCE($7, location),
       status = COALESCE($8, status),
       color = COALESCE($9, color),
       image = COALESCE($10, image),
       serial_number = COALESCE($11, serial_number),
       assigned_to_id = COALESCE($12, assigned_to_id),
       assigned_to_name = COALESCE($13, assigned_to_name),
       updated_at = CURRENT_TIMESTAMP
       WHERE id = $1
       RETURNING *`,
      [id, name, category, type, price, date, location, status, color, image, serialNumber?.trim() || null, assignedToId, assignedToName]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Asset not found' });
    }

    const updatedAsset = result.rows[0];

    if (assignedToId && !oldAsset.assigned_to_id) {
      await createNotification(assignedToId, `Asset "${updatedAsset.name}" has been assigned to you`, 'asset_assigned', updatedAsset.id);
    }

    if (assignedToId && oldAsset.assigned_to_id && oldAsset.assigned_to_id !== assignedToId) {
      await createNotification(assignedToId, `Asset "${updatedAsset.name}" has been assigned to you`, 'asset_assigned', updatedAsset.id);
      await createNotification(oldAsset.assigned_to_id, `Asset "${updatedAsset.name}" has been reassigned from you`, 'asset_removed', updatedAsset.id);
    }

    if (!assignedToId && oldAsset.assigned_to_id) {
      await createNotification(oldAsset.assigned_to_id, `Asset "${updatedAsset.name}" has been removed from your assignment`, 'asset_removed', updatedAsset.id);
    }

    res.json(normalizeAsset(updatedAsset));
  } catch (error) {
    console.error('Update asset error:', error);
    res.status(500).json({ error: 'Failed to update asset' });
  }
};

export const deleteAsset = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query('DELETE FROM assets WHERE id = $1 RETURNING *', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Asset not found' });
    }

    res.json({ message: 'Asset deleted successfully' });
  } catch (error) {
    console.error('Delete asset error:', error);
    res.status(500).json({ error: 'Failed to delete asset' });
  }
};

export const getAssetsByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const result = await pool.query('SELECT * FROM assets WHERE assigned_to_id = $1 ORDER BY created_at DESC', [userId]);
    res.json(result.rows.map(normalizeAsset));
  } catch (error) {
    console.error('Get user assets error:', error);
    res.status(500).json({ error: 'Failed to fetch assets' });
  }
};
