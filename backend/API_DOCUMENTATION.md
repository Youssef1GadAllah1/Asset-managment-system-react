# API Documentation

## Base URL
```
http://localhost:3001/api
```

## Authentication

All endpoints except `/auth/register` and `/auth/login` require a JWT token in the Authorization header:

```
Authorization: Bearer <token>
```

---

## Authentication Endpoints

### Register User
```
POST /auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "username": "johndoe",
  "password": "password123",
  "department": "Sales"
}

Response (201):
{
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "username": "johndoe",
    "role": "user",
    "department": "Sales",
    "avatar": "👤"
  },
  "token": "eyJhbGc..."
}
```

### Login User
```
POST /auth/login
Content-Type: application/json

{
  "email": "user@eva.com",
  "password": "password123"
}

Response (200):
{
  "user": {
    "id": 1,
    "name": "Ahmed Hassan",
    "email": "user@eva.com",
    "username": "ahmed.hassan",
    "role": "user",
    "department": "Marketing",
    "avatar": "👨‍💼"
  },
  "token": "eyJhbGc..."
}
```

### Get Current User
```
GET /auth/me
Authorization: Bearer <token>

Response (200):
{
  "id": 1,
  "name": "Ahmed Hassan",
  "email": "user@eva.com",
  "username": "ahmed.hassan",
  "role": "user",
  "department": "Marketing",
  "avatar": "👨‍💼"
}
```

---

## Assets Endpoints

### Get All Assets
```
GET /assets
Authorization: Bearer <token>

Response (200):
[
  {
    "id": 1,
    "name": "Dell XPS 15 Laptop",
    "category": "Electronics",
    "type": "Laptop",
    "price": 1500,
    "date": "2024-01-15",
    "location": "Office Floor 3",
    "status": "in_use",
    "color": "Silver",
    "image": "💻",
    "assigned_to_id": 1,
    "assigned_to_name": "Ahmed Hassan",
    "created_at": "2026-02-24T...",
    "updated_at": "2026-02-24T..."
  }
]
```

### Get Asset by ID
```
GET /assets/:id
Authorization: Bearer <token>

Response (200):
{
  "id": 1,
  "name": "Dell XPS 15 Laptop",
  ...
}
```

### Create Asset
```
POST /assets
Content-Type: application/json
Authorization: Bearer <token>

{
  "name": "MacBook Pro",
  "category": "Electronics",
  "type": "Laptop",
  "price": 2500,
  "date": "2026-02-24",
  "location": "Office Floor 1",
  "status": "available",
  "color": "Space Gray",
  "image": "💻",
  "assignedToId": null,
  "assignedToName": null
}

Response (201):
{
  "id": 6,
  "name": "MacBook Pro",
  ...
}
```

### Update Asset
```
PUT /assets/:id
Content-Type: application/json
Authorization: Bearer <token>

{
  "status": "in_use",
  "assignedToId": 2,
  "assignedToName": "Fatima Manager"
}

Response (200):
{
  "id": 6,
  "name": "MacBook Pro",
  "status": "in_use",
  ...
}
```

### Delete Asset
```
DELETE /assets/:id
Authorization: Bearer <token>

Response (200):
{
  "message": "Asset deleted successfully"
}
```

### Get Assets by User
```
GET /assets/user/:userId
Authorization: Bearer <token>

Response (200):
[
  {
    "id": 1,
    "name": "Dell XPS 15 Laptop",
    ...
  }
]
```

---

## Employees Endpoints

### Get All Employees
```
GET /employees
Authorization: Bearer <token>

Response (200):
[
  {
    "id": 1,
    "name": "Layla Ibrahim",
    "email": "layla.ibrahim@eva.com",
    "department": "Sales",
    "position": "Sales Executive",
    "hire_date": "2023-06-15",
    "status": "active",
    "phone": "+20-100-123-4567",
    "avatar": "👩‍💼",
    "created_at": "2026-02-24T...",
    "updated_at": "2026-02-24T..."
  }
]
```

### Get Employee by ID
```
GET /employees/:id
Authorization: Bearer <token>

Response (200):
{
  "id": 1,
  "name": "Layla Ibrahim",
  ...
}
```

### Create Employee
```
POST /employees
Content-Type: application/json
Authorization: Bearer <token>

{
  "name": "Sara Mohamed",
  "email": "sara.mohamed@eva.com",
  "department": "HR",
  "position": "HR Manager",
  "hire_date": "2026-02-24",
  "status": "active",
  "phone": "+20-100-999-8888",
  "avatar": "👩‍💼"
}

Response (201):
{
  "id": 5,
  "name": "Sara Mohamed",
  ...
}
```

### Update Employee
```
PUT /employees/:id
Content-Type: application/json
Authorization: Bearer <token>

{
  "position": "Senior HR Manager",
  "department": "Human Resources"
}

Response (200):
{
  "id": 5,
  "name": "Sara Mohamed",
  ...
}
```

### Delete Employee
```
DELETE /employees/:id
Authorization: Bearer <token>

Response (200):
{
  "message": "Employee deleted successfully"
}
```

---

## Products (Inventory) Endpoints

### Get All Products
```
GET /products
Authorization: Bearer <token>

Response (200):
[
  {
    "id": 1,
    "name": "Foundation Kit",
    "category": "Cosmetics",
    "description": "Professional makeup foundation set",
    "price": 45.99,
    "quantity": 150,
    "reorder_level": 50,
    "supplier": "Global Beauty Inc",
    "sku": "FOUND-001",
    "image": "💄",
    "status": "active",
    "created_at": "2026-02-24T...",
    "updated_at": "2026-02-24T..."
  }
]
```

### Get Product by ID
```
GET /products/:id
Authorization: Bearer <token>

Response (200):
{
  "id": 1,
  "name": "Foundation Kit",
  ...
}
```

### Get Low Stock Products
```
GET /products/low-stock
Authorization: Bearer <token>

Response (200):
[
  {
    "id": 5,
    "name": "Hair Treatment",
    "quantity": 10,
    "reorder_level": 25,
    ...
  }
]
```

### Create Product
```
POST /products
Content-Type: application/json
Authorization: Bearer <token>

{
  "name": "Perfume",
  "category": "Fragrances",
  "description": "Designer perfume",
  "price": 85.00,
  "quantity": 50,
  "reorder_level": 20,
  "supplier": "Fragrance Corp",
  "sku": "PERF-001",
  "image": "💐",
  "status": "active"
}

Response (201):
{
  "id": 6,
  "name": "Perfume",
  ...
}
```

### Update Product
```
PUT /products/:id
Content-Type: application/json
Authorization: Bearer <token>

{
  "quantity": 45,
  "reorder_level": 15
}

Response (200):
{
  "id": 6,
  "name": "Perfume",
  ...
}
```

### Delete Product
```
DELETE /products/:id
Authorization: Bearer <token>

Response (200):
{
  "message": "Product deleted successfully"
}
```

---

## Tasks Endpoints

### Get All Tasks
```
GET /tasks
Authorization: Bearer <token>

Response (200):
[
  {
    "id": 1,
    "title": "Audit asset inventory",
    "description": "Complete quarterly asset audit",
    "assigned_to_id": 2,
    "assigned_to_name": "Fatima Manager",
    "asset_id": 1,
    "status": "in_progress",
    "priority": "high",
    "due_date": "2024-03-15",
    "completed_at": null,
    "created_at": "2026-02-24T...",
    "updated_at": "2026-02-24T..."
  }
]
```

### Get Task by ID
```
GET /tasks/:id
Authorization: Bearer <token>

Response (200):
{
  "id": 1,
  "title": "Audit asset inventory",
  ...
}
```

### Create Task
```
POST /tasks
Content-Type: application/json
Authorization: Bearer <token>

{
  "title": "Update inventory",
  "description": "Update all inventory counts",
  "assigned_to_id": 1,
  "assigned_to_name": "Ahmed Hassan",
  "asset_id": null,
  "status": "pending",
  "priority": "normal",
  "due_date": "2026-03-10"
}

Response (201):
{
  "id": 4,
  "title": "Update inventory",
  ...
}
```

### Update Task
```
PUT /tasks/:id
Content-Type: application/json
Authorization: Bearer <token>

{
  "status": "in_progress",
  "priority": "high"
}

Response (200):
{
  "id": 4,
  "title": "Update inventory",
  ...
}
```

### Complete Task
```
PUT /tasks/:id/complete
Authorization: Bearer <token>

Response (200):
{
  "id": 4,
  "title": "Update inventory",
  "status": "completed",
  "completed_at": "2026-02-24T...",
  ...
}
```

### Delete Task
```
DELETE /tasks/:id
Authorization: Bearer <token>

Response (200):
{
  "message": "Task deleted successfully"
}
```

### Get User's Tasks
```
GET /tasks/user/:userId
Authorization: Bearer <token>

Response (200):
[
  {
    "id": 1,
    "title": "Audit asset inventory",
    ...
  }
]
```

---

## Reports Endpoints

### Get All Reports
```
GET /reports
Authorization: Bearer <token>

Response (200):
[
  {
    "id": 1,
    "title": "Monthly Asset Report",
    "description": "Summary of all company assets",
    "type": "asset",
    "generated_by_id": 3,
    "generated_by_name": "Admin User",
    "date_generated": "2026-02-24T...",
    "data": null,
    "status": "published",
    "created_at": "2026-02-24T...",
    "updated_at": "2026-02-24T..."
  }
]
```

### Get Report by ID
```
GET /reports/:id
Authorization: Bearer <token>

Response (200):
{
  "id": 1,
  "title": "Monthly Asset Report",
  ...
}
```

### Create Report
```
POST /reports
Content-Type: application/json
Authorization: Bearer <token>

{
  "title": "Quarterly Audit",
  "description": "Q1 2026 audit report",
  "type": "audit",
  "generated_by_id": 1,
  "generated_by_name": "Ahmed Hassan",
  "status": "draft",
  "data": {
    "total_assets": 100,
    "total_value": 500000
  }
}

Response (201):
{
  "id": 3,
  "title": "Quarterly Audit",
  ...
}
```

### Update Report
```
PUT /reports/:id
Content-Type: application/json
Authorization: Bearer <token>

{
  "status": "draft",
  "data": {
    "total_assets": 105,
    "total_value": 510000
  }
}

Response (200):
{
  "id": 3,
  "title": "Quarterly Audit",
  ...
}
```

### Publish Report
```
PUT /reports/:id/publish
Authorization: Bearer <token>

Response (200):
{
  "id": 3,
  "title": "Quarterly Audit",
  "status": "published",
  ...
}
```

### Delete Report
```
DELETE /reports/:id
Authorization: Bearer <token>

Response (200):
{
  "message": "Report deleted successfully"
}
```

---

## Notifications Endpoints

### Get All Notifications
```
GET /notifications
Authorization: Bearer <token>

Response (200):
[
  {
    "id": 1,
    "user_id": 1,
    "message": "Your assigned asset needs maintenance",
    "type": "warning",
    "related_id": 1,
    "is_read": false,
    "created_at": "2026-02-24T...",
    "updated_at": "2026-02-24T..."
  }
]
```

### Get User Notifications
```
GET /notifications/user/:userId
Authorization: Bearer <token>

Response (200):
[
  {
    "id": 1,
    "user_id": 1,
    "message": "Your assigned asset needs maintenance",
    ...
  }
]
```

### Get Unread Count
```
GET /notifications/user/:userId/unread-count
Authorization: Bearer <token>

Response (200):
{
  "count": 3
}
```

### Create Notification
```
POST /notifications
Content-Type: application/json
Authorization: Bearer <token>

{
  "user_id": 1,
  "message": "New asset assigned to you",
  "type": "info",
  "related_id": 10
}

Response (201):
{
  "id": 4,
  "user_id": 1,
  "message": "New asset assigned to you",
  ...
}
```

### Mark as Read
```
PUT /notifications/:id/read
Authorization: Bearer <token>

Response (200):
{
  "id": 1,
  "user_id": 1,
  "message": "Your assigned asset needs maintenance",
  "is_read": true,
  ...
}
```

### Delete Notification
```
DELETE /notifications/:id
Authorization: Bearer <token>

Response (200):
{
  "message": "Notification deleted successfully"
}
```

---

## Chat Endpoints

### Get Conversations
```
GET /chat/conversations/:userId
Authorization: Bearer <token>

Response (200):
[
  {
    "other_user_id": 2
  },
  {
    "other_user_id": 3
  }
]
```

### Get Messages
```
GET /chat/messages/:userId/:otherId
Authorization: Bearer <token>

Response (200):
[
  {
    "id": 1,
    "sender_id": 1,
    "receiver_id": 2,
    "message": "Hello, how are you?",
    "is_read": true,
    "created_at": "2026-02-24T..."
  }
]
```

### Send Message
```
POST /chat/messages
Content-Type: application/json
Authorization: Bearer <token>

{
  "sender_id": 1,
  "receiver_id": 2,
  "message": "Hello, I wanted to catch up"
}

Response (201):
{
  "id": 2,
  "sender_id": 1,
  "receiver_id": 2,
  "message": "Hello, I wanted to catch up",
  "is_read": false,
  "created_at": "2026-02-24T..."
}
```

### Mark Messages as Read
```
PUT /chat/messages/read
Content-Type: application/json
Authorization: Bearer <token>

{
  "senderId": 2,
  "receiverId": 1
}

Response (200):
[
  {
    "id": 1,
    "sender_id": 2,
    "receiver_id": 1,
    "message": "Hey!",
    "is_read": true,
    "created_at": "2026-02-24T..."
  }
]
```

---

## Error Responses

All error responses follow this format:

```json
{
  "error": "Error message describing what went wrong"
}
```

### HTTP Status Codes
- `200` - OK
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error
