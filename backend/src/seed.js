import pool from './db/pool.js';
import bcrypt from 'bcryptjs';

const seedDatabase = async () => {
  try {
    console.log('Seeding database with initial data...');

    await pool.query('DELETE FROM chat_messages');
    await pool.query('DELETE FROM notifications');
    await pool.query('DELETE FROM tasks');
    await pool.query('DELETE FROM reports');
    await pool.query('DELETE FROM products');
    await pool.query('DELETE FROM asset_assignments');
    await pool.query('DELETE FROM assets');
    await pool.query('DELETE FROM employees');
    await pool.query('DELETE FROM users');

    const hashedPassword = await bcrypt.hash('password123', 10);
    const users = [
      { name: 'Ahmed Hassan', email: 'user@eva.com', username: 'ahmed.hassan', password: hashedPassword, avatar: '👨‍💼', department: 'Marketing', role: 'user' },
      { name: 'Fatima Manager', email: 'manager@eva.com', username: 'fatima.mgr', password: hashedPassword, avatar: '👩‍💼', department: 'Operations', role: 'asset_manager' },
      { name: 'Admin User', email: 'admin@eva.com', username: 'admin', password: hashedPassword, avatar: '👨‍🔧', department: 'IT', role: 'admin' },
      { name: 'Layla Ibrahim', email: 'layla.ibrahim@eva.com', username: 'layla.ibrahim', password: hashedPassword, avatar: '👩‍💼', department: 'Sales', role: 'user' },
      { name: 'Karim Saleh', email: 'karim.saleh@eva.com', username: 'karim.saleh', password: hashedPassword, avatar: '👨‍💼', department: 'Marketing', role: 'user' },
      { name: 'Noor Ahmed', email: 'noor.ahmed@eva.com', username: 'noor.ahmed', password: hashedPassword, avatar: '👩‍💼', department: 'Operations', role: 'user' },
      { name: 'Hassan Mahmoud', email: 'hassan.mahmoud@eva.com', username: 'hassan.mahmoud', password: hashedPassword, avatar: '👨‍💼', department: 'Finance', role: 'user' }
    ];

    const userIds = {};
    for (const user of users) {
      const result = await pool.query(
        'INSERT INTO users (name, email, username, password, avatar, department, role) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id',
        [user.name, user.email, user.username, user.password, user.avatar, user.department, user.role]
      );
      userIds[user.name] = result.rows[0].id;
    }

    const assets = [
      { name: 'Dell XPS 15 Laptop', serial_number: 'SN-LAP-1001', category: 'Electronics', type: 'Laptop', price: 1500, amount: 3, date: '2024-01-15', location: 'Office Floor 3', status: 'in_use', color: 'Silver', image: '💻', assigned_to_id: userIds['Ahmed Hassan'], assigned_to_name: 'Ahmed Hassan' },
      { name: 'Canon EOS R5 Camera', serial_number: 'SN-CAM-1001', category: 'Photography', type: 'Camera', price: 3800, amount: 2, date: '2024-01-10', location: 'Photo Studio', status: 'available', color: 'Black', image: '📷', assigned_to_id: null, assigned_to_name: null },
      { name: 'iMac 27"', serial_number: 'SN-DESK-1001', category: 'Electronics', type: 'Desktop', price: 2200, amount: 4, date: '2024-01-20', location: 'Office Floor 2', status: 'in_use', color: 'Silver', image: '🖥️', assigned_to_id: userIds['Fatima Manager'], assigned_to_name: 'Fatima Manager' },
      { name: 'Sony A1 Camera', serial_number: 'SN-CAM-1002', category: 'Photography', type: 'Camera', price: 6500, amount: 1, date: '2024-02-01', location: 'Video Studio', status: 'maintenance', color: 'Black', image: '📷', assigned_to_id: null, assigned_to_name: null },
      { name: 'Apple iPhone 15 Pro', serial_number: 'SN-PHN-1001', category: 'Mobile', type: 'Smartphone', price: 1200, amount: 8, date: '2024-02-05', location: 'Office Reception', status: 'in_use', color: 'Titanium Blue', image: '📱', assigned_to_id: userIds['Ahmed Hassan'], assigned_to_name: 'Ahmed Hassan' }
    ];

    const assetIds = [];
    for (const asset of assets) {
      const result = await pool.query(
        'INSERT INTO assets (name, serial_number, category, type, price, amount, date, location, status, color, image, assigned_to_id, assigned_to_name) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) RETURNING id',
        [asset.name, asset.serial_number, asset.category, asset.type, asset.price, asset.amount, asset.date, asset.location, asset.status, asset.color, asset.image, asset.assigned_to_id, asset.assigned_to_name]
      );
      assetIds.push(result.rows[0].id);
    }

    const products = [
      { name: 'Foundation Kit', category: 'Cosmetics', description: 'Professional makeup foundation set', price: 45.99, quantity: 150, reorder_level: 50, supplier: 'Global Beauty Inc', sku: 'FOUND-001', image: '💄' },
      { name: 'Lipstick Collection', category: 'Cosmetics', description: 'Assorted lip colors', price: 25.99, quantity: 80, reorder_level: 30, supplier: 'Global Beauty Inc', sku: 'LIPS-001', image: '💋' },
      { name: 'Eye Shadow Palette', category: 'Cosmetics', description: 'Multi-color eye makeup palette', price: 35.99, quantity: 200, reorder_level: 75, supplier: 'Global Beauty Inc', sku: 'EYES-001', image: '👁️' },
      { name: 'Moisturizer Cream', category: 'Skincare', description: 'Daily facial moisturizer', price: 30.00, quantity: 120, reorder_level: 40, supplier: 'Skin Wellness Ltd', sku: 'MOIST-001', image: '💧' },
      { name: 'Hair Treatment', category: 'Hair Care', description: 'Deep conditioning hair mask', price: 20.00, quantity: 60, reorder_level: 25, supplier: 'Hair Pro Inc', sku: 'HAIR-001', image: '💇' }
    ];

    for (const product of products) {
      await pool.query(
        'INSERT INTO products (name, category, description, price, quantity, reorder_level, supplier, sku, image) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)',
        [product.name, product.category, product.description, product.price, product.quantity, product.reorder_level, product.supplier, product.sku, product.image]
      );
    }

    console.log('Seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
