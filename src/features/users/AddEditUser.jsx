import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Layout } from '../../components/layout/Layout'
import { Card, Button, Input, Select } from '../../components/common'
import { createUser, updateUser, getUserById } from '../../utils/api'

export const AddEditUser = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
    department: '',
    role: 'user',
    avatar: '👤',
  })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(id ? true : false)
  const [credentials, setCredentials] = useState(null)
  const [showCredentials, setShowCredentials] = useState(false)
  const isEditMode = !!id

  useEffect(() => {
    if (id) {
      loadUser()
    }
  }, [id])

  const loadUser = async () => {
    try {
      const user = await getUserById(id)
      setFormData({
        name: user.name,
        email: user.email,
        username: user.username,
        password: '',
        confirmPassword: '',
        department: user.department || '',
        role: user.role || 'user',
        avatar: user.avatar || '👤',
      })
    } catch (error) {
      setErrors({ submit: 'Failed to load user' })
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const newErrors = {}

    // Validation
    if (!formData.name.trim()) newErrors.name = 'Name is required'
    if (!formData.email.trim()) newErrors.email = 'Email is required'
    if (!formData.username.trim()) newErrors.username = 'Username is required'

    if (!isEditMode) {
      if (!formData.password.trim()) newErrors.password = 'Password is required'
      if (formData.password.length < 8) newErrors.password = 'Password must be at least 8 characters'
      if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match'
    } else if (formData.password) {
      if (formData.password.length < 8) newErrors.password = 'Password must be at least 8 characters'
      if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match'
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    try {
      setLoading(true)

      if (isEditMode) {
        await updateUser(id, formData)
        navigate('/users')
      } else {
        const response = await createUser(formData)

        // Show credentials if user was created with password
        if (response.user) {
          setCredentials({
            email: response.user.email,
            username: response.user.username,
            tempPassword: formData.password,
            role: response.user.role
          })
          setShowCredentials(true)
          setLoading(false)
          return
        }

        navigate('/users')
      }
    } catch (error) {
      console.error('Failed to save user:', error)
      setErrors({ submit: error.message || 'Failed to save user' })
    } finally {
      setLoading(false)
    }
  }

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
  }

  // If credentials are shown, display them
  if (showCredentials && credentials) {
    return (
      <Layout>
        <div className="p-6 max-w-2xl mx-auto">
          <Card>
            <div className="text-center space-y-6">
              <div className="text-green-600 dark:text-green-400 text-5xl">
                ✓
              </div>

              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                User Created Successfully!
              </h2>

              <p className="text-gray-600 dark:text-gray-400">
                A new user account has been created. Share these credentials with the user.
              </p>

              <div className="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-lg p-6 text-left space-y-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Email
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={credentials.email}
                      readOnly
                      className="flex-1 px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded text-gray-900 dark:text-gray-100"
                    />
                    <button
                      onClick={() => copyToClipboard(credentials.email)}
                      className="px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded transition"
                    >
                      Copy
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Username
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={credentials.username}
                      readOnly
                      className="flex-1 px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded text-gray-900 dark:text-gray-100"
                    />
                    <button
                      onClick={() => copyToClipboard(credentials.username)}
                      className="px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded transition"
                    >
                      Copy
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Password
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={credentials.tempPassword}
                      readOnly
                      className="flex-1 px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded text-gray-900 dark:text-gray-100 font-mono"
                    />
                    <button
                      onClick={() => copyToClipboard(credentials.tempPassword)}
                      className="px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded transition"
                    >
                      Copy
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Role
                  </label>
                  <input
                    type="text"
                    value={credentials.role}
                    readOnly
                    className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded text-gray-900 dark:text-gray-100 capitalize"
                  />
                </div>
              </div>

              <div className="text-sm text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-800 rounded p-4">
                <strong>Important:</strong> The user should log in and change their password immediately.
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => navigate('/users')}
                  className="flex-1 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition font-medium"
                >
                  Back to Users
                </button>
                <button
                  onClick={() => {
                    const credentialsText = `Email: ${credentials.email}\nUsername: ${credentials.username}\nPassword: ${credentials.tempPassword}\nRole: ${credentials.role}`
                    copyToClipboard(credentialsText)
                  }}
                  className="flex-1 px-4 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-gray-100 rounded-lg transition font-medium"
                >
                  Copy All
                </button>
              </div>
            </div>
          </Card>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="p-6 max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-8">
          {isEditMode ? 'Edit User' : 'Create New User'}
        </h1>

        <Card>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Error Messages */}
            {errors.submit && (
              <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded text-red-600 dark:text-red-400">
                {errors.submit}
              </div>
            )}

            {/* Name & Email */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Full Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                error={errors.name}
              />
              <Input
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                error={errors.email}
              />
            </div>

            {/* Username & Department */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                error={errors.username}
              />
              <Input
                label="Department"
                name="department"
                value={formData.department}
                onChange={handleChange}
              />
            </div>

            {/* Password Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label={isEditMode ? 'New Password (optional)' : 'Password'}
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                error={errors.password}
              />
              <Input
                label={isEditMode ? 'Confirm New Password' : 'Confirm Password'}
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                error={errors.confirmPassword}
              />
            </div>

            {/* Role Selection */}
            <Select
              label="User Role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              badge="Access Level"
              icon="🔐"
              options={[
                { id: 'user', label: '👤 User (Basic Access)' },
                { id: 'asset_manager', label: '🔑 Asset Manager (Extended Access)' },
                { id: 'admin', label: '👑 Administrator (Full Access)' }
              ]}
            />

            {/* Submit Buttons */}
            <div className="flex gap-3 pt-6">
              <Button type="submit" className="flex-1" disabled={loading}>
                {loading ? 'Saving...' : (isEditMode ? 'Update User' : 'Create User')}
              </Button>
              <Button
                type="button"
                variant="secondary"
                className="flex-1"
                onClick={() => navigate('/users')}
              >
                Cancel
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </Layout>
  )
}
