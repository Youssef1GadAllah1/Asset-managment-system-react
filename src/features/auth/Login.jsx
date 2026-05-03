import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useTranslation } from 'react-i18next'
import { Button, Input, Card } from '../../components/common'
import { Logo } from '../../components/common/Logo'
import { Eye, EyeOff } from 'lucide-react'

export const Login = () => {
  const navigate = useNavigate()
  const { login } = useAuth()
  const { t } = useTranslation()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(email, password, rememberMe)
      navigate('/dashboard')
    } catch (err) {
      setError(err.message || 'Invalid email or password')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center mb-8 gap-3">
          <Logo size="lg" to={null} />
          <p className="text-gray-600 dark:text-gray-400">{t('login.subtitle')}</p>
        </div>

        <Card>
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
              autoComplete="email"
              required
            />

            <div className="relative">
              <Input
                label={t('login.password')}
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete={rememberMe ? 'current-password' : 'current-password'}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(v => !v)}
                className="absolute right-3 top-10 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <div className="flex items-center">
              <input
                id="rememberMe"
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500 cursor-pointer"
              />
              <label
                htmlFor="rememberMe"
                className="ml-2 text-sm text-gray-700 dark:text-gray-300 cursor-pointer select-none"
              >
                {t('login.rememberMe') || 'Remember me'}
              </label>
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

        <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-8">
          © {new Date().getFullYear()} Next-Step · EVA Cosmetics Group
        </p>
      </div>
    </div>
  )
}
