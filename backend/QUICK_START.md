# 🚀 Quick Reference Card

## Start Backend
```bash
cd backend
npm run migrate  # First time only
npm run seed     # First time only
npm run dev
```

## Connection
- **Backend**: http://localhost:3001
- **API**: http://localhost:3001/api
- **Frontend**: http://localhost:5173

## Login Credentials
```
Email: user@eva.com
Password: password123

Email: manager@eva.com
Password: password123

Email: admin@eva.com
Password: password123
```

## Common API Calls

### Authentication
```bash
# Login
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@eva.com","password":"password123"}'

# Get Current User
curl -X GET http://localhost:3001/api/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Assets
```bash
# Get all assets
GET /api/assets

# Create asset
POST /api/assets
{
  "name": "Laptop",
  "category": "Electronics",
  "price": 1000
}

# Update asset
PUT /api/assets/1
{
  "status": "in_use"
}

# Delete asset
DELETE /api/assets/1
```

### Products
```bash
# Get all products
GET /api/products

# Get low stock
GET /api/products/low-stock

# Create product
POST /api/products
{
  "name": "Lipstick",
  "category": "Cosmetics",
  "quantity": 100
}
```

### Tasks
```bash
# Get all tasks
GET /api/tasks

# Get user tasks
GET /api/tasks/user/1

# Create task
POST /api/tasks
{
  "title": "Audit assets",
  "assigned_to_id": 1
}

# Complete task
PUT /api/tasks/1/complete
```

### Employees
```bash
# Get all
GET /api/employees

# Create
POST /api/employees
{
  "name": "John",
  "email": "john@eva.com",
  "department": "Sales"
}
```

### Reports
```bash
# Get all
GET /api/reports

# Create
POST /api/reports
{
  "title": "Monthly Report",
  "type": "asset"
}

# Publish
PUT /api/reports/1/publish
```

### Notifications
```bash
# Get user notifications
GET /api/notifications/user/1

# Get unread count
GET /api/notifications/user/1/unread-count

# Mark as read
PUT /api/notifications/1/read
```

### Chat
```bash
# Get conversations
GET /api/chat/conversations/1

# Get messages
GET /api/chat/messages/1/2

# Send message
POST /api/chat/messages
{
  "sender_id": 1,
  "receiver_id": 2,
  "message": "Hello!"
}
```

## Database Commands

```bash
# Create tables
npm run migrate

# Seed sample data
npm run seed
```

## Environment Configuration
Edit `backend/.env`:
```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=eva_ams
DB_USER=postgres
DB_PASSWORD=postgres
PORT=3001
JWT_SECRET=your_secret_key
CORS_ORIGIN=http://localhost:5173
```

## Frontend Integration
Create `src/utils/api.js`:
```javascript
const API_URL = 'http://localhost:3001/api';

export async function apiCall(endpoint, options = {}) {
  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers
  };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  
  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers
  });
  return response.json();
}
```

## File Checklist
- [ ] backend/.env (configured with DB credentials)
- [ ] backend/node_modules (installed)
- [ ] PostgreSQL running
- [ ] Database created (eva_ams)
- [ ] Tables migrated (npm run migrate)
- [ ] Database seeded (npm run seed)
- [ ] Backend running (npm run dev)
- [ ] Frontend updated with API integration

## Errors & Solutions

| Error | Solution |
|-------|----------|
| ECONNREFUSED (PostgreSQL) | Start PostgreSQL server |
| Port already in use | Change PORT in .env or kill process |
| JWT error | Clear cookies, login again |
| CORS error | Check CORS_ORIGIN in .env |
| Table not found | Run `npm run migrate` |

---

For complete documentation, see backend/README.md, backend/SETUP.md, backend/API_DOCUMENTATION.md
