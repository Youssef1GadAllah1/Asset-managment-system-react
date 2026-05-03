import { lazy, Suspense } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { ThemeProvider } from './context/ThemeContext'
import { ProtectedRoute } from './components/ProtectedRoute'

const Login = lazy(() => import('./features/auth/Login').then(m => ({ default: m.Login })))
const Dashboard = lazy(() => import('./features/dashboard/Dashboard').then(m => ({ default: m.Dashboard })))
const Assets = lazy(() => import('./features/assets/Assets').then(m => ({ default: m.Assets })))
const AddEditAsset = lazy(() => import('./features/assets/AddEditAsset').then(m => ({ default: m.AddEditAsset })))
const AssignAsset = lazy(() => import('./features/assets/AssignAsset').then(m => ({ default: m.AssignAsset })))
const Employees = lazy(() => import('./features/employees/Employees').then(m => ({ default: m.Employees })))
const AddEditEmployee = lazy(() => import('./features/employees/AddEditEmployee').then(m => ({ default: m.AddEditEmployee })))
const Users = lazy(() => import('./features/users/Users').then(m => ({ default: m.Users })))
const AddEditUser = lazy(() => import('./features/users/AddEditUser').then(m => ({ default: m.AddEditUser })))
const Reports = lazy(() => import('./features/reports/Reports').then(m => ({ default: m.Reports })))
const AddReport = lazy(() => import('./features/reports/AddReport').then(m => ({ default: m.AddReport })))
const Tasks = lazy(() => import('./features/tasks/Tasks').then(m => ({ default: m.Tasks })))
const AddEditTask = lazy(() => import('./features/tasks/AddEditTask').then(m => ({ default: m.AddEditTask })))
const Inventory = lazy(() => import('./features/inventory/Inventory').then(m => ({ default: m.Inventory })))
const AddEditProduct = lazy(() => import('./features/inventory/AddEditProduct').then(m => ({ default: m.AddEditProduct })))
const Profile = lazy(() => import('./features/profile/Profile').then(m => ({ default: m.Profile })))
const Notifications = lazy(() => import('./features/notifications/Notifications').then(m => ({ default: m.Notifications })))
const Chat = lazy(() => import('./features/chat/Chat').then(m => ({ default: m.Chat })))

const PageLoader = () => (
  <div className="flex h-screen items-center justify-center bg-gray-50 dark:bg-gray-900">
    <div className="flex flex-col items-center gap-3">
      <div className="w-10 h-10 border-4 border-primary-600 border-t-transparent rounded-full animate-spin" />
      <p className="text-sm text-gray-500 dark:text-gray-400">Loading...</p>
    </div>
  </div>
)

function App() {
  return (
    <Router>
      <AuthProvider>
        <ThemeProvider>
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/login" element={<Login />} />

              <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />

              <Route path="/assets" element={<ProtectedRoute><Assets /></ProtectedRoute>} />
              <Route path="/assets/add" element={<ProtectedRoute><AddEditAsset /></ProtectedRoute>} />
              <Route path="/assets/assign" element={<ProtectedRoute><AssignAsset /></ProtectedRoute>} />
              <Route path="/assets/edit/:id" element={<ProtectedRoute><AddEditAsset /></ProtectedRoute>} />

              <Route path="/employees" element={<ProtectedRoute><Employees /></ProtectedRoute>} />
              <Route path="/employees/add" element={<ProtectedRoute><AddEditEmployee /></ProtectedRoute>} />
              <Route path="/employees/edit/:id" element={<ProtectedRoute><AddEditEmployee /></ProtectedRoute>} />

              <Route path="/users" element={<ProtectedRoute><Users /></ProtectedRoute>} />
              <Route path="/users/add" element={<ProtectedRoute><AddEditUser /></ProtectedRoute>} />
              <Route path="/users/edit/:id" element={<ProtectedRoute><AddEditUser /></ProtectedRoute>} />

              <Route path="/reports" element={<ProtectedRoute><Reports /></ProtectedRoute>} />
              <Route path="/reports/add" element={<ProtectedRoute><AddReport /></ProtectedRoute>} />

              <Route path="/tasks" element={<ProtectedRoute><Tasks /></ProtectedRoute>} />
              <Route path="/tasks/add" element={<ProtectedRoute><AddEditTask /></ProtectedRoute>} />
              <Route path="/tasks/edit/:id" element={<ProtectedRoute><AddEditTask /></ProtectedRoute>} />

              <Route path="/inventory" element={<ProtectedRoute><Inventory /></ProtectedRoute>} />
              <Route path="/inventory/add" element={<ProtectedRoute><AddEditProduct /></ProtectedRoute>} />
              <Route path="/inventory/edit/:id" element={<ProtectedRoute><AddEditProduct /></ProtectedRoute>} />

              <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
              <Route path="/notifications" element={<ProtectedRoute><Notifications /></ProtectedRoute>} />
              <Route path="/chat" element={<ProtectedRoute><Chat /></ProtectedRoute>} />

              <Route path="/" element={<Navigate to="/dashboard" />} />
              <Route path="*" element={<Navigate to="/dashboard" />} />
            </Routes>
          </Suspense>
        </ThemeProvider>
      </AuthProvider>
    </Router>
  )
}

export default App
