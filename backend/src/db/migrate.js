import pool from './pool.js';

const createDatabase = async () => {
  try {
    console.log('Creating database schema...');

    // Drop existing tables if they exist (for fresh setup)
    await pool.query('DROP TABLE IF EXISTS chat_messages CASCADE');
    await pool.query('DROP TABLE IF EXISTS notifications CASCADE');
    await pool.query('DROP TABLE IF EXISTS tasks CASCADE');
    await pool.query('DROP TABLE IF EXISTS reports CASCADE');
    await pool.query('DROP TABLE IF EXISTS products CASCADE');
    await pool.query('DROP TABLE IF EXISTS assets CASCADE');
    await pool.query('DROP TABLE IF EXISTS employees CASCADE');
    await pool.query('DROP TABLE IF EXISTS users CASCADE');

    // Create users table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        username VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        avatar VARCHAR(50),
        department VARCHAR(100),
        role VARCHAR(50) DEFAULT 'user',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create assets table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS assets (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        category VARCHAR(100),
        type VARCHAR(100),
        price DECIMAL(12, 2),
        amount INTEGER DEFAULT 1,
        date DATE,
        location VARCHAR(255),
        status VARCHAR(50) DEFAULT 'available',
        color VARCHAR(100),
        image VARCHAR(50),
        assigned_to_id INTEGER REFERENCES users(id),
        assigned_to_name VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create products (inventory) table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS products (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        category VARCHAR(100),
        description TEXT,
        price DECIMAL(12, 2),
        quantity INTEGER DEFAULT 0,
        reorder_level INTEGER DEFAULT 10,
        supplier VARCHAR(255),
        sku VARCHAR(100),
        image VARCHAR(50),
        status VARCHAR(50) DEFAULT 'active',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create employees table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS employees (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        department VARCHAR(100),
        position VARCHAR(100),
        hire_date DATE,
        status VARCHAR(50) DEFAULT 'active',
        phone VARCHAR(20),
        avatar VARCHAR(50),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create reports table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS reports (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        type VARCHAR(100),
        generated_by_id INTEGER REFERENCES users(id),
        generated_by_name VARCHAR(255),
        directed_to_id INTEGER REFERENCES users(id),
        directed_to_name VARCHAR(255),
        date_generated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        data JSONB,
        status VARCHAR(50) DEFAULT 'draft',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create tasks table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS tasks (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        assigned_to_id INTEGER REFERENCES users(id),
        assigned_to_name VARCHAR(255),
        assigned_from_id INTEGER REFERENCES users(id),
        assigned_from_name VARCHAR(255),
        asset_id INTEGER REFERENCES assets(id),
        status VARCHAR(50) DEFAULT 'pending',
        priority VARCHAR(50) DEFAULT 'normal',
        due_date DATE,
        completed_at TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create notifications table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS notifications (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id),
        message VARCHAR(500) NOT NULL,
        type VARCHAR(100),
        related_id INTEGER,
        is_read BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create chat messages table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS chat_messages (
        id SERIAL PRIMARY KEY,
        sender_id INTEGER REFERENCES users(id),
        receiver_id INTEGER REFERENCES users(id),
        message TEXT NOT NULL,
        is_read BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create asset assignments table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS asset_assignments (
        id SERIAL PRIMARY KEY,
        asset_id INTEGER NOT NULL REFERENCES assets(id) ON DELETE CASCADE,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        quantity INTEGER NOT NULL DEFAULT 1,
        assigned_by_id INTEGER REFERENCES users(id),
        assigned_by_name VARCHAR(255),
        assigned_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        return_date TIMESTAMP,
        status VARCHAR(50) DEFAULT 'active',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(asset_id, user_id)
      )
    `);

    console.log('Database schema created successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error creating database schema:', error);
    process.exit(1);
  }
};

createDatabase();
