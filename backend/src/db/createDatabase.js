import pkg from 'pg'
const { Client } = pkg
import dotenv from 'dotenv'

dotenv.config()

const dbName = process.env.DB_NAME || 'eva_ams'

const client = new Client({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 5432,
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || '',
  database: 'postgres'
})

const run = async () => {
  try {
    await client.connect()
    const res = await client.query('SELECT 1 FROM pg_database WHERE datname=$1', [dbName])
    if (res.rowCount === 0) {
      console.log(`Creating database '${dbName}'...`)
      await client.query(`CREATE DATABASE "${dbName}"`)
      console.log('Database created successfully')
    } else {
      console.log(`Database '${dbName}' already exists`)
    }
    process.exit(0)
  } catch (err) {
    console.error('Error creating database:', err.message || err)
    process.exit(1)
  } finally {
    try { await client.end() } catch (e) {}
  }
}

run()
