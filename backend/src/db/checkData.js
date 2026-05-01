import pool from './pool.js'

const check = async () => {
  try {
    const tables = ['users','assets','products','employees','tasks','reports','notifications','chat_messages']
    for (const t of tables) {
      const res = await pool.query(`SELECT COUNT(*) AS cnt FROM ${t}`)
      console.log(`${t}:`, res.rows[0].cnt)
    }

    const users = await pool.query('SELECT id, name, email, username, role FROM users ORDER BY id LIMIT 5')
    console.log('\nSample users:')
    users.rows.forEach(u => console.log(u))

    process.exit(0)
  } catch (err) {
    console.error('Error checking data:', err)
    process.exit(1)
  }
}

check()
