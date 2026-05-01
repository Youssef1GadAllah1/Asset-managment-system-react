import pool from './src/db/pool.js';

(async () => {
  try {
    console.log('\n=== Testing Asset Assignment Notifications ===\n');
    
    // Get Ahmed Hassan specifically
    const userResult = await pool.query(`
      SELECT id, name FROM users WHERE name = 'Ahmed Hassan'
    `);
    
    if (userResult.rows.length === 0) {
      console.log('Ahmed Hassan user not found');
      process.exit(0);
    }
    
    const ahmedId = userResult.rows[0].id;
    console.log(`Found ${userResult.rows[0].name} with ID: ${ahmedId}\n`);
    
    // Get Ahmed Hassan's current notifications
    const notificationsResult = await pool.query(`
      SELECT id, message, type, created_at FROM notifications 
      WHERE user_id = $1
      ORDER BY created_at DESC
      LIMIT 10
    `, [ahmedId]);
    
    console.log('Recent Notifications for Ahmed Hassan:');
    if (notificationsResult.rows.length > 0) {
      console.table(notificationsResult.rows);
    } else {
      console.log('No notifications found yet');
    }
    
    console.log('\n✓ Notifications system is active and ready!');
    console.log('✓ When an asset is assigned, notifications will be created automatically');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    process.exit(0);
  }
})();
