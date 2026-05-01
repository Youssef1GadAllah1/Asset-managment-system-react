import pool from './db/pool.js';
import bcrypt from 'bcryptjs';

const seedDatabase = async () => {
  try {
    console.log('Seeding database with initial data...');

    // Clear existing data
    await pool.query('DELETE FROM chat_messages');
    await pool.query('DELETE FROM notifications');
    await pool.query('DELETE FROM tasks');
    await pool.query('DELETE FROM reports');
    await pool.query('DELETE FROM products');
    await pool.query('DELETE FROM assets');
    await pool.query('DELETE FROM employees');
    await pool.query('DELETE FROM users');

    // Seed users
    const hashedPassword = await bcrypt.hash('password123', 10);
    const users = [
      {
        name: 'Ahmed Hassan',
        email: 'user@eva.com',
        username: 'ahmed.hassan',
        password: hashedPassword,
        avatar: '👨‍💼',
        department: 'Marketing',
        role: 'user'
      },
      {
        name: 'Fatima Manager',
        email: 'manager@eva.com',
        username: 'fatima.mgr',
        password: hashedPassword,
        avatar: '👩‍💼',
        department: 'Operations',
        role: 'asset_manager'
      },
      {
        name: 'Admin User',
        email: 'admin@eva.com',
        username: 'admin',
        password: hashedPassword,
        avatar: '👨‍🔧',
        department: 'IT',
        role: 'admin'
      },
      {
        name: 'Layla Ibrahim',
        email: 'layla.ibrahim@eva.com',
        username: 'layla.ibrahim',
        password: hashedPassword,
        avatar: '👩‍💼',
        department: 'Sales',
        role: 'user'
      },
      {
        name: 'Karim Saleh',
        email: 'karim.saleh@eva.com',
        username: 'karim.saleh',
        password: hashedPassword,
        avatar: '👨‍💼',
        department: 'Marketing',
        role: 'user'
      },
      {
        name: 'Noor Ahmed',
        email: 'noor.ahmed@eva.com',
        username: 'noor.ahmed',
        password: hashedPassword,
        avatar: '👩‍💼',
        department: 'Operations',
        role: 'user'
      },
      {
        name: 'Hassan Mahmoud',
        email: 'hassan.mahmoud@eva.com',
        username: 'hassan.mahmoud',
        password: hashedPassword,
        avatar: '👨‍💼',
        department: 'Finance',
        role: 'user'
      }
    ];

    const userIds = {};
    for (const user of users) {
      const result = await pool.query(
        'INSERT INTO users (name, email, username, password, avatar, department, role) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id',
        [user.name, user.email, user.username, user.password, user.avatar, user.department, user.role]
      );
      userIds[user.name] = result.rows[0].id;
    }

    // Seed assets (use actual user IDs)
    const assets = [
      {
        name: 'Dell XPS 15 Laptop',
        category: 'Electronics',
        type: 'Laptop',
        price: 1500,
        amount: 3,
        date: '2024-01-15',
        location: 'Office Floor 3',
        status: 'in_use',
        color: 'Silver',
        image: '💻',
        assigned_to_id: userIds['Ahmed Hassan'],
        assigned_to_name: 'Ahmed Hassan'
      },
      {
        name: 'Canon EOS R5 Camera',
        category: 'Photography',
        type: 'Camera',
        price: 3800,
        amount: 2,
        date: '2024-01-10',
        location: 'Photo Studio',
        status: 'available',
        color: 'Black',
        image: '📷',
        assigned_to_id: null,
        assigned_to_name: null
      },
      {
        name: 'iMac 27"',
        category: 'Electronics',
        type: 'Desktop',
        price: 2200,
        amount: 4,
        date: '2024-01-20',
        location: 'Office Floor 2',
        status: 'in_use',
        color: 'Silver',
        image: '🖥️',
        assigned_to_id: userIds['Fatima Manager'],
        assigned_to_name: 'Fatima Manager'
      },
      {
        name: 'Sony A1 Camera',
        category: 'Photography',
        type: 'Camera',
        price: 6500,
        amount: 1,
        date: '2024-02-01',
        location: 'Video Studio',
        status: 'maintenance',
        color: 'Black',
        image: '📷',
        assigned_to_id: null,
        assigned_to_name: null
      },
      {
        name: 'Apple iPhone 15 Pro',
        category: 'Mobile',
        type: 'Smartphone',
        price: 1200,
        amount: 8,
        date: '2024-02-05',
        location: 'Office Reception',
        status: 'in_use',
        color: 'Titanium Blue',
        image: '📱',
        assigned_to_id: userIds['Ahmed Hassan'],
        assigned_to_name: 'Ahmed Hassan'
      }
    ];

    const assetIds = [];
    for (const asset of assets) {
      const result = await pool.query(
        'INSERT INTO assets (name, category, type, price, amount, date, location, status, color, image, assigned_to_id, assigned_to_name) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) RETURNING id',
        [asset.name, asset.category, asset.type, asset.price, asset.amount, asset.date, asset.location, asset.status, asset.color, asset.image, asset.assigned_to_id, asset.assigned_to_name]
      );
      assetIds.push(result.rows[0].id);
    }

    // Seed products
    const products = [
      {
        name: 'Foundation Kit',
        category: 'Cosmetics',
        description: 'Professional makeup foundation set',
        price: 45.99,
        quantity: 150,
        reorder_level: 50,
        supplier: 'Global Beauty Inc',
        sku: 'FOUND-001',
        image: '💄'
      },
      {
        name: 'Lipstick Collection',
        category: 'Cosmetics',
        description: 'Assorted lip colors',
        price: 25.99,
        quantity: 80,
        reorder_level: 30,
        supplier: 'Global Beauty Inc',
        sku: 'LIPS-001',
        image: '💋'
      },
      {
        name: 'Eye Shadow Palette',
        category: 'Cosmetics',
        description: 'Multi-color eye makeup palette',
        price: 35.99,
        quantity: 200,
        reorder_level: 75,
        supplier: 'Global Beauty Inc',
        sku: 'EYES-001',
        image: '👁️'
      },
      {
        name: 'Moisturizer Cream',
        category: 'Skincare',
        description: 'Daily facial moisturizer',
        price: 30.00,
        quantity: 120,
        reorder_level: 40,
        supplier: 'Skin Wellness Ltd',
        sku: 'MOIST-001',
        image: '💧'
      },
      {
        name: 'Hair Treatment',
        category: 'Hair Care',
        description: 'Deep conditioning hair mask',
        price: 20.00,
        quantity: 60,
        reorder_level: 25,
        supplier: 'Hair Pro Inc',
        sku: 'HAIR-001',
        image: '💇'
      }
    ];

    for (const product of products) {
      await pool.query(
        'INSERT INTO products (name, category, description, price, quantity, reorder_level, supplier, sku, image) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)',
        [product.name, product.category, product.description, product.price, product.quantity, product.reorder_level, product.supplier, product.sku, product.image]
      );
    }

    // Seed employees
    const employees = [
      {
        name: 'Ahmed Hassan',
        email: 'user@eva.com',
        department: 'Marketing',
        position: 'Marketing Specialist',
        hire_date: '2023-01-10',
        status: 'active',
        phone: '+20-100-111-1111',
        avatar: '👨‍💼'
      },
      {
        name: 'Fatima Manager',
        email: 'manager@eva.com',
        department: 'Operations',
        position: 'Asset Manager',
        hire_date: '2023-01-05',
        status: 'active',
        phone: '+20-100-222-2222',
        avatar: '👩‍💼'
      },
      {
        name: 'Admin User',
        email: 'admin@eva.com',
        department: 'IT',
        position: 'System Administrator',
        hire_date: '2023-01-01',
        status: 'active',
        phone: '+20-100-333-3333',
        avatar: '👨‍🔧'
      },
      {
        name: 'Layla Ibrahim',
        email: 'layla.ibrahim@eva.com',
        department: 'Sales',
        position: 'Sales Executive',
        hire_date: '2023-06-15',
        status: 'active',
        phone: '+20-100-123-4567',
        avatar: '👩‍💼'
      },
      {
        name: 'Karim Saleh',
        email: 'karim.saleh@eva.com',
        department: 'Marketing',
        position: 'Marketing Manager',
        hire_date: '2023-03-10',
        status: 'active',
        phone: '+20-100-234-5678',
        avatar: '👨‍💼'
      },
      {
        name: 'Noor Ahmed',
        email: 'noor.ahmed@eva.com',
        department: 'Operations',
        position: 'Operations Coordinator',
        hire_date: '2023-09-20',
        status: 'active',
        phone: '+20-100-345-6789',
        avatar: '👩‍💼'
      },
      {
        name: 'Hassan Mahmoud',
        email: 'hassan.mahmoud@eva.com',
        department: 'Finance',
        position: 'Financial Analyst',
        hire_date: '2023-02-14',
        status: 'active',
        phone: '+20-100-456-7890',
        avatar: '👨‍💼'
      }
    ];

    for (const employee of employees) {
      await pool.query(
        'INSERT INTO employees (name, email, department, position, hire_date, status, phone, avatar) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)',
        [employee.name, employee.email, employee.department, employee.position, employee.hire_date, employee.status, employee.phone, employee.avatar]
      );
    }

    // Seed tasks (use actual user and asset IDs)
    const tasks = [
      {
        title: 'Audit asset inventory',
        description: 'Complete quarterly asset audit',
        assigned_to_id: userIds['Fatima Manager'],
        assigned_to_name: 'Fatima Manager',
        assigned_from_id: userIds['Admin User'],
        assigned_from_name: 'Admin User',
        asset_id: assetIds[0],
        status: 'in_progress',
        priority: 'high',
        due_date: '2024-03-15'
      },
      {
        title: 'Update product catalog',
        description: 'Add new cosmetic products to inventory',
        assigned_to_id: userIds['Ahmed Hassan'],
        assigned_to_name: 'Ahmed Hassan',
        assigned_from_id: userIds['Fatima Manager'],
        assigned_from_name: 'Fatima Manager',
        asset_id: null,
        status: 'pending',
        priority: 'normal',
        due_date: '2024-03-10'
      },
      {
        title: 'Equipment maintenance',
        description: 'Service cameras and equipment',
        assigned_to_id: userIds['Admin User'],
        assigned_to_name: 'Admin User',
        assigned_from_id: userIds['Admin User'],
        assigned_from_name: 'Admin User',
        asset_id: assetIds[1],
        status: 'pending',
        priority: 'high',
        due_date: '2024-03-05'
      }
    ];

    for (const task of tasks) {
      await pool.query(
        'INSERT INTO tasks (title, description, assigned_to_id, assigned_to_name, assigned_from_id, assigned_from_name, asset_id, status, priority, due_date) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)',
        [task.title, task.description, task.assigned_to_id, task.assigned_to_name, task.assigned_from_id, task.assigned_from_name, task.asset_id, task.status, task.priority, task.due_date]
      );
    }

    // Seed reports (use actual user IDs)
    const reports = [
      {
        title: 'Monthly Asset Report',
        description: 'Summary of all company assets',
        type: 'asset',
        generated_by_id: userIds['Admin User'],
        generated_by_name: 'Admin User',
        directed_to_id: userIds['Fatima Manager'],
        directed_to_name: 'Fatima Manager',
        status: 'pending',
        date_generated: new Date().toISOString()
      },
      {
        title: 'Inventory Status Report',
        description: 'Current stock levels and reorder requirements',
        type: 'inventory',
        generated_by_id: userIds['Fatima Manager'],
        generated_by_name: 'Fatima Manager',
        directed_to_id: userIds['Admin User'],
        directed_to_name: 'Admin User',
        status: 'in_progress',
        date_generated: new Date().toISOString()
      },
      {
        title: 'Equipment Audit Report',
        description: 'Quarterly audit of all equipment',
        type: 'audit',
        generated_by_id: userIds['Admin User'],
        generated_by_name: 'Admin User',
        directed_to_id: null,
        directed_to_name: null,
        status: 'completed',
        date_generated: new Date().toISOString()
      }
    ];

    for (const report of reports) {
      await pool.query(
        'INSERT INTO reports (title, description, type, generated_by_id, generated_by_name, directed_to_id, directed_to_name, status, date_generated) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)',
        [report.title, report.description, report.type, report.generated_by_id, report.generated_by_name, report.directed_to_id, report.directed_to_name, report.status, report.date_generated]
      );
    }

    // Seed notifications (use actual user IDs)
    const notifications = [
      {
        user_id: userIds['Ahmed Hassan'],
        message: 'Your assigned asset needs maintenance',
        type: 'warning',
        related_id: 1
      },
      {
        user_id: userIds['Fatima Manager'],
        message: 'New inventory items have arrived',
        type: 'info',
        related_id: null
      },
      {
        user_id: userIds['Admin User'],
        message: 'System update scheduled for tomorrow',
        type: 'warning',
        related_id: null
      }
    ];

    for (const notification of notifications) {
      await pool.query(
        'INSERT INTO notifications (user_id, message, type, related_id) VALUES ($1, $2, $3, $4)',
        [notification.user_id, notification.message, notification.type, notification.related_id]
      );
    }

    console.log('✅ Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
