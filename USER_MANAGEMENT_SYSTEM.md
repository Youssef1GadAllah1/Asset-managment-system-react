# User Management System

A complete user management module separate from employees, allowing administrators to create and manage system users with different access levels and roles.

## Features

### User Management
- Create new users with email, username, and password
- Edit existing user information
- Delete users from the system
- Assign different roles (User, Asset Manager, Administrator)
- View all users with role badges and contact information

### User Roles

1. **User** - Basic access to dashboard, profile, chat, and notifications
2. **Asset Manager** - Extended access including assets, employees, tasks, and reports
3. **Administrator** - Full system access including user management

### Credentials Management

When creating a new user:
- Automatic credentials are displayed after creation
- Email, username, and password shown with copy-to-clipboard
- Secure password generation with mixed case, numbers, and special characters
- Optional password change on first login

## Frontend Components

### Users List (`/users`)
- Display all system users in a card-based layout
- Show user avatar, name, email, department, and role
- Edit and delete buttons for each user
- Color-coded role badges (Red for Admin, Blue for Manager, Gray for User)
- Delete confirmation prompt for safety

### Add/Edit User (`/users/add`, `/users/edit/:id`)
- Form fields for name, email, username, department
- Password fields (required for new users, optional for editing)
- Role selection dropdown
- Password confirmation matching
- Input validation with error messages
- Credentials display modal after creation

## Backend Endpoints

### User Management Routes (`/api/users`)

#### GET `/api/users`
Get all users in the system
- **Authentication**: Required
- **Response**: Array of user objects

#### POST `/api/users`
Create a new user
- **Authentication**: Required
- **Body**:
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "username": "johndoe",
    "password": "SecurePassword123!",
    "department": "IT",
    "role": "user"
  }
  ```
- **Response**: Created user object

#### GET `/api/users/:id`
Get user by ID
- **Authentication**: Required
- **Response**: User object

#### PUT `/api/users/:id`
Update user information
- **Authentication**: Required
- **Body**: Any updatable fields (password optional)
- **Response**: Updated user object

#### DELETE `/api/users/:id`
Delete a user
- **Authentication**: Required
- **Validation**: Cannot delete own account
- **Response**: Success message

## Database Schema

### Users Table
```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  username VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  department VARCHAR(100),
  role VARCHAR(50) DEFAULT 'user',
  avatar VARCHAR(100) DEFAULT '👤',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Navigation

Users section is only visible to administrators. Find it in:
1. Left sidebar under "Users" (admin only)
2. Or navigate directly to `/users`

## Usage Example

### Creating a New User
1. Go to `/users` or click "Users" in sidebar (admin only)
2. Click "Add User" button
3. Fill in user information:
   - Name: John Doe
   - Email: john@example.com
   - Username: johndoe
   - Password: Create a strong password
   - Department: Sales
   - Role: Asset Manager
4. Click "Create User"
5. Copy and share credentials with the new user
6. New user can login with email and password

### Editing User Information
1. Go to Users list
2. Click Edit button on user card
3. Update desired fields
4. Optionally change password (leave blank to keep current)
5. Click "Update User"

### Deleting a User
1. Go to Users list
2. Click Delete button on user card
3. Confirm deletion in the prompt
4. User is permanently removed from system

## Security Features

- Passwords are hashed using bcryptjs (10 rounds)
- JWT token authentication for all endpoints
- Role-based access control
- Prevention of self-deletion
- Password validation (minimum 8 characters)
- Unique email and username constraints

## API Response Examples

### Create User Success
```json
{
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "username": "johndoe",
    "role": "user",
    "department": "IT",
    "avatar": "👤"
  }
}
```

### Error Response
```json
{
  "error": "Email or username already exists"
}
```

## Integration with System

The User Management system is fully integrated with:
- Authentication and authorization
- Dashboard role-based access
- Sidebar navigation
- API client utilities
- Supabase PostgreSQL database

All user accounts created here are separate from Employee records and can have independent access control.
