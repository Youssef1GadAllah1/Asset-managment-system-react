import pool from './src/db/pool.js';

(async () => {
  try {
    console.log('\n=== Fixing Asset Quantities ===\n');
    
    // Get all assets with their total assigned quantities
    const result = await pool.query(`
      SELECT a.id, a.name, a.amount,
             COALESCE(SUM(aa.quantity), 0) as total_assigned
      FROM assets a
      LEFT JOIN asset_assignments aa ON a.id = aa.asset_id AND aa.status = 'active'
      GROUP BY a.id, a.name, a.amount
    `);
    
    let fixed = 0;
    
    for (const assetRow of result.rows) {
      const { id, name, amount, total_assigned } = assetRow;
      const correctAmount = amount - total_assigned;
      
      if (correctAmount < 0) {
        console.log(`⚠️  Asset ID ${id} - ${name}: Has more assignments than available!`);
        console.log(`   Current amount in inventory: ${amount}`);
        console.log(`   Total assigned: ${total_assigned}`);
        console.log(`   Cannot fix - would go negative`);
        continue;
      }
      
      if (correctAmount !== amount) {
        console.log(`✓ Fixing Asset ID ${id} - ${name}`);
        console.log(`  Before: ${amount} available`);
        console.log(`  Assigned: ${total_assigned}`);
        console.log(`  After: ${correctAmount} available`);
        
        await pool.query(
          'UPDATE assets SET amount = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2',
          [correctAmount, id]
        );
        fixed++;
      }
    }
    
    if (fixed === 0) {
      console.log('✓ All asset quantities are correct!');
    } else {
      console.log(`\n✓ Fixed ${fixed} asset(s)`);
    }
    
    // Show final state
    console.log('\n=== Final Asset Quantities ===');
    const finalState = await pool.query(`
      SELECT a.id, a.name, a.amount, 
             COALESCE(SUM(aa.quantity), 0) as total_assigned
      FROM assets a
      LEFT JOIN asset_assignments aa ON a.id = aa.asset_id AND aa.status = 'active'
      GROUP BY a.id, a.name, a.amount
      ORDER BY a.id
    `);
    console.table(finalState.rows);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    process.exit(0);
  }
})();
