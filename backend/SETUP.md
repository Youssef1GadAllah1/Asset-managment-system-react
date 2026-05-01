# Backend Setup Guide

## Quick Start Instructions

### Step 1: PostgreSQL Setup

First, you need to install and configure PostgreSQL:

1. **Download PostgreSQL** from https://www.postgresql.org/download/
2. **Install PostgreSQL** and note your password for the `postgres` user
3. **Create a database** for the project:
   ```sql
   createdb eva_ams
   ```

### Step 2: Backend Configuration

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Update `.env` file with your PostgreSQL credentials:
   ```env
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=eva_ams
   DB_USER=postgres
   DB_PASSWORD=your_postgres_password
   PORT=3001
   NODE_ENV=development
   JWT_SECRET=your_jwt_secret_key_change_this_in_production
   CORS_ORIGIN=http://localhost:5173
   ```

### Step 3: Database Setup

1. Create all tables:
   ```bash
   npm run migrate
   ```

2. Seed the database with initial data:
   ```bash
   npm run seed
   ```

### Step 4: Start the Server

Development mode (with hot reload):
```bash
npm run dev
```

Or production mode:
```bash
npm start
```

You should see: `🚀 Server running on http://localhost:3001`

## Testing the API

### Test Authentication
```bash
# Register
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "username": "testuser",
    "password": "password123",
    "department": "Test"
  }'

# Login
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@eva.com",
    "password": "password123"
  }'
```

### Default Test Users (after seeding)
- **User**: user@eva.com / password123
- **Manager**: manager@eva.com / password123
- **Admin**: admin@eva.com / password123

## Common Issues

### Database Connection Error
- Check PostgreSQL is running
- Verify `.env` file has correct credentials
- Ensure database `eva_ams` exists

### Port Already in Use
- Change `PORT` in `.env` file to an available port
- Or kill the process: `lsof -ti:3001 | xargs kill -9`

### JWT Token Issues
- Change `JWT_SECRET` in `.env` file
- Clear browser cookies and login again

## Troubleshooting

If you encounter any issues, check:
1. PostgreSQL is running
2. `.env` file is correctly configured
3. All dependencies are installed (`npm install`)
4. Port 3001 is not in use

## Database Schema

The database includes the following tables:
- **users** - System users
- **assets** - Company assets
- **products** - Inventory items
- **employees** - Employee records
- **tasks** - Work tasks
- **reports** - Generated reports
- **notifications** - User notifications
- **chat_messages** - Chat conversations

## API Documentation

For complete API endpoint documentation, see [API Endpoints](#api-endpoints) in the README.md file.
