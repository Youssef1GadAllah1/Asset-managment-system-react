import pool from '../db/pool.js';

export const getDashboardStats = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        (SELECT COUNT(*)::int FROM users)                                         AS total_users,
        (SELECT COUNT(*)::int FROM employees)                                     AS total_employees,
        (SELECT COUNT(*)::int FROM assets)                                        AS total_assets,
        (SELECT COUNT(*)::int FROM assets WHERE status = 'available')             AS available_assets,
        (SELECT COUNT(*)::int FROM assets WHERE status = 'in_use')                AS active_assets,
        (SELECT COUNT(*)::int FROM assets WHERE status = 'maintenance')           AS maintenance_assets,
        (SELECT COUNT(*)::int FROM assets WHERE status = 'retired')               AS retired_assets,
        (SELECT COUNT(*)::int FROM tasks)                                         AS total_tasks,
        (SELECT COUNT(*)::int FROM tasks WHERE status = 'pending')                AS pending_tasks,
        (SELECT COUNT(*)::int FROM tasks WHERE status = 'in_progress')            AS in_progress_tasks,
        (SELECT COUNT(*)::int FROM tasks WHERE status = 'completed')              AS completed_tasks,
        (SELECT COUNT(*)::int FROM reports)                                       AS total_reports
    `);

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Stats error:', error);
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
};
