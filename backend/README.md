# EVA Cosmetics Asset Management System - Backend API

Backend API for the EVA Cosmetics Asset Management System built with Node.js, Express, and PostgreSQL.

## Prerequisites

- Node.js (v16+)
- PostgreSQL (v12+)
- npm or yarn

## Installation

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file with the following configuration:
   ```env
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=eva_ams
   DB_USER=postgres
   DB_PASSWORD=postgres
   PORT=3001
   NODE_ENV=development
   JWT_SECRET=your_jwt_secret_key_change_this_in_production
   CORS_ORIGIN=http://localhost:5173
   ```

## Database Setup

1. Create the database tables:
   ```bash
   npm run migrate
   ```

2. Seed the database with initial data:
   ```bash
   npm run seed
   ```

## Running the Server

### Development Mode (with auto-reload):
```bash
npm run dev
```

### Production Mode:
```bash
npm start
```

The server will start on `http://localhost:3001`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (requires authentication)

### Assets
- `GET /api/assets` - Get all assets
- `GET /api/assets/:id` - Get asset by ID
- `POST /api/assets` - Create new asset
- `PUT /api/assets/:id` - Update asset
- `DELETE /api/assets/:id` - Delete asset
- `GET /api/assets/user/:userId` - Get assets by user

### Employees
- `GET /api/employees` - Get all employees
- `GET /api/employees/:id` - Get employee by ID
- `POST /api/employees` - Create new employee
- `PUT /api/employees/:id` - Update employee
- `DELETE /api/employees/:id` - Delete employee

### Products (Inventory)
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get product by ID
- `POST /api/products` - Create new product
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product
- `GET /api/products/low-stock` - Get low stock products

### Reports
- `GET /api/reports` - Get all reports
- `GET /api/reports/:id` - Get report by ID
- `POST /api/reports` - Create new report
- `PUT /api/reports/:id` - Update report
- `DELETE /api/reports/:id` - Delete report
- `PUT /api/reports/:id/publish` - Publish report

### Tasks
- `GET /api/tasks` - Get all tasks
- `GET /api/tasks/:id` - Get task by ID
- `POST /api/tasks` - Create new task
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task
- `PUT /api/tasks/:id/complete` - Mark task as complete
- `GET /api/tasks/user/:userId` - Get user's tasks

### Notifications
- `GET /api/notifications` - Get all notifications
- `GET /api/notifications/user/:userId` - Get user notifications
- `POST /api/notifications` - Create notification
- `PUT /api/notifications/:id/read` - Mark as read
- `DELETE /api/notifications/:id` - Delete notification
- `GET /api/notifications/user/:userId/unread-count` - Get unread count

### Chat
- `GET /api/chat/conversations/:userId` - Get user conversations
- `GET /api/chat/messages/:userId/:otherId` - Get messages between users
- `POST /api/chat/messages` - Send message
- `PUT /api/chat/messages/read` - Mark messages as read

## Default Login Credentials

After seeding:

### User
- Email: `user@eva.com`
- Password: `password123`

### Manager
- Email: `manager@eva.com`
- Password: `password123`

### Admin
- Email: `admin@eva.com`
- Password: `password123`

## Project Structure

```
backend/
├── src/
│   ├── controllers/        # Business logic
│   ├── middleware/         # Custom middleware
│   ├── routes/            # API routes
│   ├── db/                # Database connection and migrations
│   ├── index.js           # Main server file
│   └── seed.js            # Database seeding script
├── .env                   # Environment variables
├── package.json           # Project dependencies
└── README.md              # This file
```

## Environment Variables

- `DB_HOST` - PostgreSQL host
- `DB_PORT` - PostgreSQL port
- `DB_NAME` - Database name
- `DB_USER` - Database user
- `DB_PASSWORD` - Database password
- `PORT` - Server port
- `NODE_ENV` - Environment (development/production)
- `JWT_SECRET` - JWT signing secret key
- `CORS_ORIGIN` - Frontend origin for CORS

## Error Handling

The API returns appropriate HTTP status codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

## Security

- Password hashing with bcryptjs
- JWT authentication for protected routes
- CORS enabled for frontend communication
- Helmet.js for security headers
- Input validation

## License

MIT
