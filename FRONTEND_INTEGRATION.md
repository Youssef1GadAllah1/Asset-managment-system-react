# Frontend Integration Guide

This guide shows how to integrate the React frontend with the Node.js backend API.

## Backend Configuration

1. Backend runs on: `http://localhost:3001`
2. API routes are prefixed with: `/api`

## Update Frontend API Calls

Create a file `src/utils/api.js` with the following configuration:

```javascript
// src/utils/api.js
const API_URL = 'http://localhost:3001/api';

export async function apiCall(endpoint, options = {}) {
  const token = localStorage.getItem('token');
  
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers
  });
  
  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }
  
  return response.json();
}

// Example usage in components:
// const assets = await apiCall('/assets');
// const user = await apiCall('/auth/me');
```

## Authentication Flow

### 1. Update Login Component

```javascript
// src/features/auth/Login.jsx
import { apiCall } from '../../utils/api.js';

async function handleLogin(email, password) {
  try {
    const { user, token } = await apiCall('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
    
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    
    // Redirect to dashboard
    navigate('/dashboard');
  } catch (error) {
    console.error('Login failed:', error);
  }
}
```

### 2. Update Register Component

```javascript
// src/features/auth/Register.jsx
async function handleRegister(formData) {
  try {
    const { user, token } = await apiCall('/auth/register', {
      method: 'POST',
      body: JSON.stringify(formData)
    });
    
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
  } catch (error) {
    console.error('Registration failed:', error);
  }
}
```

## Update All Feature Components

### Assets
```javascript
// Get all assets
const assets = await apiCall('/assets');

// Create asset
await apiCall('/assets', {
  method: 'POST',
  body: JSON.stringify(assetData)
});

// Update asset
await apiCall(`/assets/${id}`, {
  method: 'PUT',
  body: JSON.stringify(updates)
});

// Delete asset
await apiCall(`/assets/${id}`, {
  method: 'DELETE'
});
```

### Employees
```javascript
// Get all employees
const employees = await apiCall('/employees');

// Create employee
await apiCall('/employees', {
  method: 'POST',
  body: JSON.stringify(employeeData)
});
```

### Products (Inventory)
```javascript
// Get all products
const products = await apiCall('/products');

// Get low stock products
const lowStock = await apiCall('/products/low-stock');

// Create product
await apiCall('/products', {
  method: 'POST',
  body: JSON.stringify(productData)
});
```

### Tasks
```javascript
// Get all tasks
const tasks = await apiCall('/tasks');

// Get user tasks
const userTasks = await apiCall(`/tasks/user/${userId}`);

// Create task
await apiCall('/tasks', {
  method: 'POST',
  body: JSON.stringify(taskData)
});

// Complete task
await apiCall(`/tasks/${id}/complete`, {
  method: 'PUT'
});
```

### Reports
```javascript
// Get all reports
const reports = await apiCall('/reports');

// Create report
await apiCall('/reports', {
  method: 'POST',
  body: JSON.stringify(reportData)
});

// Publish report
await apiCall(`/reports/${id}/publish`, {
  method: 'PUT'
});
```

### Notifications
```javascript
// Get user notifications
const notifications = await apiCall(`/notifications/user/${userId}`);

// Get unread count
const { count } = await apiCall(`/notifications/user/${userId}/unread-count`);

// Mark as read
await apiCall(`/notifications/${id}/read`, {
  method: 'PUT'
});

// Create notification
await apiCall('/notifications', {
  method: 'POST',
  body: JSON.stringify(notificationData)
});
```

### Chat
```javascript
// Get conversations
const conversations = await apiCall(`/chat/conversations/${userId}`);

// Get messages
const messages = await apiCall(`/chat/messages/${userId}/${otherId}`);

// Send message
await apiCall('/chat/messages', {
  method: 'POST',
  body: JSON.stringify({
    sender_id: currentUserId,
    receiver_id: recipientId,
    message: 'Hello!'
  })
});
```

## Update AuthContext

```javascript
// src/context/AuthContext.jsx
import { createContext, useState, useEffect } from 'react';
import { apiCall } from '../utils/api';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    
    if (savedToken) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
    }
  }, []);

  async function login(email, password) {
    try {
      const { user, token } = await apiCall('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password })
      });
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      setToken(token);
      setUser(user);
      
      return { user, token };
    } catch (error) {
      throw error;
    }
  }

  function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
```

## Running Both Frontend and Backend

### Terminal 1 (Backend):
```bash
cd backend
npm run dev
```

### Terminal 2 (Frontend):
```bash
npm run dev
```

Frontend will be at: `http://localhost:5173`
Backend will be at: `http://localhost:3001`

## Testing the Integration

1. Start backend: `npm run dev` (in backend folder)
2. Start frontend: `npm run dev` (in root folder)
3. Go to http://localhost:5173
4. Try logging in with:
   - Email: `user@eva.com`
   - Password: `password123`

## CORS Configuration

The backend is configured to accept requests from `http://localhost:5173`. If you change the frontend port, update the `.env` file:

```env
CORS_ORIGIN=http://localhost:YOUR_PORT
```

## Token Storage

The token is stored in `localStorage` as `token`. It's automatically sent with every API request in the Authorization header.

## Error Handling

Implement proper error handling in your components:

```javascript
try {
  const data = await apiCall('/assets');
  // Use data
} catch (error) {
  console.error('Error fetching assets:', error);
  // Show error message to user
}
```

## Production Notes

For production deployment:
1. Change `API_URL` to your production backend URL
2. Update `CORS_ORIGIN` in backend `.env`
3. Change `JWT_SECRET` to a secure secret
4. Use environment variables for sensitive data
5. Enable HTTPS for all API calls
