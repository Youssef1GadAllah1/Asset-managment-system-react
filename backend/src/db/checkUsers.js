import pool from './pool.js'

const check = async () => {
  try {
    const res = await pool.query('SELECT id, name, email, password FROM users')
    console.log('Users with password field:')
    res.rows.forEach(u => {
      console.log(`ID: ${u.id}, Name: ${u.name}, Email: ${u.email}, Password exists: ${u.password ? 'YES' : 'NO'}, Password length: ${u.password ? u.password.length : 0}`)
    })

    process.exit(0)
  } catch (err) {
    console.error('Error:', err)
    process.exit(1)
  }
}

check()
