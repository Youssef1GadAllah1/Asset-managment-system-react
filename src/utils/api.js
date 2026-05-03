// API Helper - All requests go to Backend
// Use relative path that will be proxied by Vite in development
const API_URL = '/api';

/**
 * Generic API call function with auto token handling
 */
export async function apiCall(endpoint, options = {}) {
  const token = localStorage.getItem('token');
  
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers
    });
    
    // Handle non-OK responses
    if (!response.ok) {
      // Try to parse error as JSON, fallback to status text
      let errorMessage = `API Error: ${response.status}`;
      try {
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          const errorData = await response.json();
          errorMessage = errorData.error || errorMessage;
        } else {
          errorMessage = await response.text() || errorMessage;
        }
      } catch (parseError) {
        console.warn('Could not parse error response:', parseError);
      }
      throw new Error(errorMessage);
    }
    
    // Handle successful responses
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return await response.json();
    } else {
      // Return empty object for non-JSON responses
      return {};
    }
  } catch (error) {
    console.error('API Error:', error.message || error);
    throw error;
  }
}

// ============ AUTH ENDPOINTS ============
export async function register(data) {
  return apiCall('/auth/register', {
    method: 'POST',
    body: JSON.stringify(data)
  });
}

export async function login(email, password) {
  return apiCall('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password })
  });
}

export async function getCurrentUser() {
  return apiCall('/auth/me');
}

export async function getAllUsers() {
  return apiCall('/auth/users/all');
}

// ============ USER MANAGEMENT ENDPOINTS ============
export async function createUser(data) {
  return apiCall('/users', {
    method: 'POST',
    body: JSON.stringify(data)
  });
}

export async function getUserById(id) {
  return apiCall(`/users/${id}`);
}

export async function updateUser(id, data) {
  return apiCall(`/users/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data)
  });
}

export async function deleteUser(id) {
  return apiCall(`/users/${id}`, {
    method: 'DELETE'
  });
}

export async function changePassword(oldPassword, newPassword) {
  return apiCall('/auth/change-password', {
    method: 'POST',
    body: JSON.stringify({ oldPassword, newPassword })
  });
}

// ============ ASSETS ENDPOINTS ============
export async function getAllAssets() {
  return apiCall('/assets');
}

export async function getAssetById(id) {
  return apiCall(`/assets/${id}`);
}

export async function createAsset(data) {
  return apiCall('/assets', {
    method: 'POST',
    body: JSON.stringify(data)
  });
}

export async function updateAsset(id, data) {
  return apiCall(`/assets/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data)
  });
}

export async function deleteAsset(id) {
  return apiCall(`/assets/${id}`, {
    method: 'DELETE'
  });
}

export async function getAssetsByUser(userId) {
  return apiCall(`/assets/user/${userId}`);
}

// ============ ASSET ASSIGNMENT ENDPOINTS ============
export async function getAssetAssignments() {
  return apiCall('/asset-assignments');
}

export async function getAssetAssignmentsByUser(userId) {
  return apiCall(`/asset-assignments/user/${userId}`);
}

export async function getAssetAssignmentsByAsset(assetId) {
  return apiCall(`/asset-assignments/asset/${assetId}`);
}

export async function assignAssets(data) {
  return apiCall('/asset-assignments', {
    method: 'POST',
    body: JSON.stringify(data)
  });
}

export async function updateAssetAssignment(id, data) {
  return apiCall(`/asset-assignments/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data)
  });
}

export async function returnAsset(id) {
  return apiCall(`/asset-assignments/${id}/return`, {
    method: 'PUT'
  });
}

export async function deleteAssetAssignment(id) {
  return apiCall(`/asset-assignments/${id}`, {
    method: 'DELETE'
  });
}

// ============ EMPLOYEES ENDPOINTS ============
export async function getAllEmployees() {
  return apiCall('/employees');
}

export async function getEmployeeById(id) {
  return apiCall(`/employees/${id}`);
}

export async function createEmployee(data) {
  return apiCall('/employees', {
    method: 'POST',
    body: JSON.stringify(data)
  });
}

export async function updateEmployee(id, data) {
  return apiCall(`/employees/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data)
  });
}

export async function deleteEmployee(id) {
  return apiCall(`/employees/${id}`, {
    method: 'DELETE'
  });
}

// ============ PRODUCTS ENDPOINTS ============
export async function getAllProducts() {
  return apiCall('/products');
}

export async function getProductById(id) {
  return apiCall(`/products/${id}`);
}

export async function createProduct(data) {
  return apiCall('/products', {
    method: 'POST',
    body: JSON.stringify(data)
  });
}

export async function updateProduct(id, data) {
  return apiCall(`/products/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data)
  });
}

export async function deleteProduct(id) {
  return apiCall(`/products/${id}`, {
    method: 'DELETE'
  });
}

export async function getLowStockProducts() {
  return apiCall('/products/low-stock');
}

// ============ TASKS ENDPOINTS ============
export async function getAllTasks() {
  return apiCall('/tasks');
}

export async function getTaskById(id) {
  return apiCall(`/tasks/${id}`);
}

export async function createTask(data) {
  return apiCall('/tasks', {
    method: 'POST',
    body: JSON.stringify(data)
  });
}

export async function updateTask(id, data) {
  return apiCall(`/tasks/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data)
  });
}

export async function deleteTask(id) {
  return apiCall(`/tasks/${id}`, {
    method: 'DELETE'
  });
}

export async function getTasksByUser(userId) {
  return apiCall(`/tasks/user/${userId}`);
}

export async function completeTask(id) {
  return apiCall(`/tasks/${id}/complete`, {
    method: 'PUT'
  });
}

// ============ REPORTS ENDPOINTS ============
export async function getAllReports() {
  return apiCall('/reports');
}

export async function getReportById(id) {
  return apiCall(`/reports/${id}`);
}

export async function createReport(data) {
  return apiCall('/reports', {
    method: 'POST',
    body: JSON.stringify(data)
  });
}

export async function updateReport(id, data) {
  return apiCall(`/reports/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data)
  });
}

export async function deleteReport(id) {
  return apiCall(`/reports/${id}`, {
    method: 'DELETE'
  });
}

export async function publishReport(id) {
  return apiCall(`/reports/${id}/publish`, {
    method: 'PUT'
  });
}

// ============ NOTIFICATIONS ENDPOINTS ============
export async function getNotifications(userId) {
  return apiCall(`/notifications/user/${userId}`);
}

export async function getAllNotifications() {
  return apiCall('/notifications');
}

export async function createNotification(data) {
  return apiCall('/notifications', {
    method: 'POST',
    body: JSON.stringify(data)
  });
}

export async function markNotificationAsRead(id) {
  return apiCall(`/notifications/${id}/read`, {
    method: 'PUT'
  });
}

export async function deleteNotification(id) {
  return apiCall(`/notifications/${id}`, {
    method: 'DELETE'
  });
}

export async function getUnreadNotificationCount(userId) {
  return apiCall(`/notifications/user/${userId}/unread-count`);
}

// ============ CHAT ENDPOINTS ============
export async function getConversations(userId) {
  return apiCall(`/chat/conversations/${userId}`);
}

export async function getMessages(userId, otherId) {
  return apiCall(`/chat/messages/${userId}/${otherId}`);
}

export async function sendMessage(data) {
  return apiCall('/chat/messages', {
    method: 'POST',
    body: JSON.stringify(data)
  });
}

export async function markMessagesAsRead(senderId, receiverId) {
  return apiCall('/chat/messages/read', {
    method: 'PUT',
    body: JSON.stringify({ senderId, receiverId })
  });
}
