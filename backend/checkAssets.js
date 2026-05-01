import pool from './src/db/pool.js';

(async () => {
  try {
    // Check assets and their assignments
    const assets = await pool.query(`
      SELECT a.id, a.name, a.amount, 
       COUNT(DISTINCT aa.id) as assignment_count,
       SUM(aa.quantity) as total_assigned
      FROM assets a
      LEFT JOIN asset_assignments aa ON a.id = aa.asset_id AND aa.status = 'active'
      GROUP BY a.id, a.name, a.amount
      ORDER BY a.id
    `);
    
    console.log('\n=== Assets Summary ===');
    console.table(assets.rows);
    
    // Check Ahmed's assignments
    const ahmed = await pool.query(`
      SELECT u.id, u.name 
      FROM users u WHERE u.name LIKE '%Ahmed%' OR u.name LIKE '%Ahmed Hassan%'
    `);
    
    if (ahmed.rows.length > 0) {
      const ahmedId = ahmed.rows[0].id;
      console.log(`\n=== User Found: ${ahmed.rows[0].name} (ID: ${ahmedId}) ===`);
      
      const assignments = await pool.query(`
        SELECT aa.id, aa.asset_id, a.name as asset_name, aa.quantity, a.amount, aa.assigned_date, aa.status
        FROM asset_assignments aa
        JOIN assets a ON aa.asset_id = a.id
        WHERE aa.user_id = $1 AND aa.status = 'active'
      `, [ahmedId]);
      
      console.log(`\n=== ${ahmed.rows[0].name}'s Active Assignments ===`);
      if (assignments.rows.length > 0) {
        console.table(assignments.rows);
      } else {
        console.log('No active assignments found');
      }
    } else {
      console.log('Ahmed Hassan not found');
    }
    
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    process.exit(0);
  }
})();
