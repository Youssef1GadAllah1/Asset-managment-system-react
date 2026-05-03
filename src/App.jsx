import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { ThemeProvider } from './context/ThemeContext'
import { ProtectedRoute } from './components/ProtectedRoute'

// Pages
import { Login } from './features/auth/Login'
import { Dashboard } from './features/dashboard/Dashboard'
import { Assets } from './features/assets/Assets'
import { AddEditAsset } from './features/assets/AddEditAsset'
import { AssignAsset } from './features/assets/AssignAsset'
import { Employees } from './features/employees/Employees'
import { AddEditEmployee } from './features/employees/AddEditEmployee'
import { Users } from './features/users/Users'
import { AddEditUser } from './features/users/AddEditUser'
import { Reports } from './features/reports/Reports'
import { AddReport } from './features/reports/AddReport'
import { Tasks } from './features/tasks/Tasks'
import { AddEditTask } from './features/tasks/AddEditTask'
import { Inventory } from './features/inventory/Inventory'
import { AddEditProduct } from './features/inventory/AddEditProduct'
import { Profile } from './features/profile/Profile'
import { Notifications } from './features/notifications/Notifications'
import { Chat } from './features/chat/Chat'

function App() {
  return (
    <Router>
      <AuthProvider>
        <ThemeProvider>
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />

            {/* Protected Routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />

            {/* Assets Routes */}
            <Route
              path="/assets"
              element={
                <ProtectedRoute>
                  <Assets />
                </ProtectedRoute>
              }
            />
            <Route
              path="/assets/add"
              element={
                <ProtectedRoute>
                  <AddEditAsset />
                </ProtectedRoute>
              }
            />
            <Route
              path="/assets/assign"
              element={
                <ProtectedRoute>
                  <AssignAsset />
                </ProtectedRoute>
              }
            />
            <Route
              path="/assets/edit/:id"
              element={
                <ProtectedRoute>
                  <AddEditAsset />
                </ProtectedRoute>
              }
            />

            {/* Employees Routes */}
            <Route
              path="/employees"
              element={
                <ProtectedRoute>
                  <Employees />
                </ProtectedRoute>
              }
            />
            <Route
              path="/employees/add"
              element={
                <ProtectedRoute>
                  <AddEditEmployee />
                </ProtectedRoute>
              }
            />
            <Route
              path="/employees/edit/:id"
              element={
                <ProtectedRoute>
                  <AddEditEmployee />
                </ProtectedRoute>
              }
            />

            {/* Users Routes */}
            <Route
              path="/users"
              element={
                <ProtectedRoute>
                  <Users />
                </ProtectedRoute>
              }
            />
            <Route
              path="/users/add"
              element={
                <ProtectedRoute>
                  <AddEditUser />
                </ProtectedRoute>
              }
            />
            <Route
              path="/users/edit/:id"
              element={
                <ProtectedRoute>
                  <AddEditUser />
                </ProtectedRoute>
              }
            />

            {/* Reports Routes */}
            <Route
              path="/reports"
              element={
                <ProtectedRoute>
                  <Reports />
                </ProtectedRoute>
              }
            />
            <Route
              path="/reports/add"
              element={
                <ProtectedRoute>
                  <AddReport />
                </ProtectedRoute>
              }
            />

            {/* Tasks Routes */}
            <Route
              path="/tasks"
              element={
                <ProtectedRoute>
                  <Tasks />
                </ProtectedRoute>
              }
            />
            <Route
              path="/tasks/add"
              element={
                <ProtectedRoute>
                  <AddEditTask />
                </ProtectedRoute>
              }
            />
            <Route
              path="/tasks/edit/:id"
              element={
                <ProtectedRoute>
                  <AddEditTask />
                </ProtectedRoute>
              }
            />

            {/* Inventory Routes */}
            <Route
              path="/inventory"
              element={
                <ProtectedRoute>
                  <Inventory />
                </ProtectedRoute>
              }
            />
            <Route
              path="/inventory/add"
              element={
                <ProtectedRoute>
                  <AddEditProduct />
                </ProtectedRoute>
              }
            />
            <Route
              path="/inventory/edit/:id"
              element={
                <ProtectedRoute>
                  <AddEditProduct />
                </ProtectedRoute>
              }
            />

            {/* Other Routes */}
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/notifications"
              element={
                <ProtectedRoute>
                  <Notifications />
                </ProtectedRoute>
              }
            />
            <Route
              path="/chat"
              element={
                <ProtectedRoute>
                  <Chat />
                </ProtectedRoute>
              }
            />

            {/* Catch all */}
            <Route path="/" element={<Navigate to="/dashboard" />} />
            <Route path="*" element={<Navigate to="/dashboard" />} />
          </Routes>
        </ThemeProvider>
      </AuthProvider>
    </Router>
  )
}

export default App
