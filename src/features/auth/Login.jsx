import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useTranslation } from 'react-i18next'
import { Button, Input, Card, Toast } from '../../components/common'
import { Mail, Lock, Eye, EyeOff } from 'lucide-react'

// Test accounts (from Backend seeded data)
const DEMO_ACCOUNTS = [
  {
    id: 1,
    name: 'Ahmed Hassan',
    email: 'user@eva.com',
    password: 'password123',
    role: 'user',
    avatar: '👨‍💼',
    department: 'Marketing'
  },
  {
    id: 2,
    name: 'Fatima Manager',
    email: 'manager@eva.com',
    password: 'password123',
    role: 'asset_manager',
    avatar: '👩‍💼',
    department: 'Operations'
  },
  {
    id: 3,
    name: 'Admin User',
    email: 'admin@eva.com',
    password: 'password123',
    role: 'admin',
    avatar: '👨‍🔧',
    department: 'IT'
  },
  {
    id: 4,
    name: 'Layla Ibrahim',
    email: 'layla.ibrahim@eva.com',
    password: 'password123',
    role: 'user',
    avatar: '👩‍💼',
    department: 'Sales'
  },
  {
    id: 5,
    name: 'Karim Saleh',
    email: 'karim.saleh@eva.com',
    password: 'password123',
    role: 'user',
    avatar: '👨‍💼',
    department: 'Marketing'
  },
  {
    id: 6,
    name: 'Noor Ahmed',
    email: 'noor.ahmed@eva.com',
    password: 'password123',
    role: 'user',
    avatar: '👩‍💼',
    department: 'Operations'
  },
  {
    id: 7,
    name: 'Hassan Mahmoud',
    email: 'hassan.mahmoud@eva.com',
    password: 'password123',
    role: 'user',
    avatar: '👨‍💼',
    department: 'Finance'
  }
]

export const Login = () => {
  const navigate = useNavigate()
  const { login } = useAuth()
  const { t } = useTranslation()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      // Call Backend login
      await login(email, password)
      navigate('/dashboard')
    } catch (err) {
      setError(err.message || 'Invalid email or password')
    } finally {
      setLoading(false)
    }
  }

  const handleQuickLogin = async (account) => {
    setError('')
    setLoading(true)

    try {
      // Call Backend login with demo credentials
      await login(account.email, account.password)
      navigate('/dashboard')
    } catch (err) {
      setError(err.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-primary-600 mb-2">EVA Cosmetics</h1>
          <p className="text-gray-600 dark:text-gray-400">{t('login.subtitle')}</p>
        </div>

        {/* Login Form Card */}
        <Card className="mb-8">
          <form onSubmit={handleLogin} className="space-y-6">
            {error && (
              <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-800 dark:text-red-200 text-sm">
                {error}
              </div>
            )}

            <Input
              label={t('login.email')}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
            />

            <div className="relative">
              <Input
                label={t('login.password')}
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-10 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <Button
              type="submit"
              variant="primary"
              className="w-full"
              disabled={loading}
            >
              {loading ? t('common.loading') : t('login.login')}
            </Button>
          </form>
        </Card>

        {/* Demo Users */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
          <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-4">
            حسابات تجريبية
          </h3>
          <div className="space-y-3">
            {DEMO_ACCOUNTS.map((account) => (
              <button
                key={account.id}
                onClick={() => handleQuickLogin(account)}
                disabled={loading}
                className="w-full p-3 border-2 border-gray-200 dark:border-gray-700 rounded-lg hover:border-primary-500 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors text-left disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{account.avatar}</span>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-gray-100">
                      {account.name}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {account.email}
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-8">
          © 2026 EVA Cosmetics Group. All rights reserved.
        </p>
      </div>
    </div>
  )
}

