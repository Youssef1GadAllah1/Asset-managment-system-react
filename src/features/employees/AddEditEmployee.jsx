import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Layout } from '../../components/layout/Layout'
import { Card, Button, Input } from '../../components/common'
import { createEmployee, updateEmployee, getEmployeeById } from '../../utils/api'

export const AddEditEmployee = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const { t } = useTranslation()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    department: '',
    position: '',
    hire_date: new Date().toISOString().split('T')[0],
    phone: '',
    status: 'active',
    avatar: '👤',
    role: 'user',
    createUserAccount: false
  })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(id ? true : false)
  const [credentials, setCredentials] = useState(null)
  const [showCredentials, setShowCredentials] = useState(false)
  const isEditMode = !!id

  useEffect(() => {
    if (id) {
      loadEmployee()
    }
  }, [id])

  const loadEmployee = async () => {
    try {
      setLoading(true)
      const data = await getEmployeeById(id)
      setFormData(data)
    } catch (error) {
      console.error('Failed to load employee:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const newErrors = {}

    if (!formData.name.trim()) newErrors.name = 'Name is required'
    if (!formData.email.trim()) newErrors.email = 'Email is required'
    if (!formData.department.trim()) newErrors.department = 'Department is required'

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    try {
      setLoading(true)
      
      if (id) {
        await updateEmployee(id, formData)
        navigate('/employees')
      } else {
        const response = await createEmployee(formData)
        
        // If user account was created, show credentials
        if (response.credentials) {
          setCredentials(response.credentials)
          setShowCredentials(true)
          setLoading(false)
          return
        }
        
        navigate('/employees')
      }
    } catch (error) {
      console.error('Failed to save employee:', error)
      setErrors({ submit: error.message || 'Failed to save employee' })
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

  // Copy to clipboard function
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
  }

  // If credentials are shown, display them instead of the form
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
                Employee Created Successfully!
              </h2>
              
              <p className="text-gray-600 dark:text-gray-400">
                A new user account has been created. Share these credentials with the employee.
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
                    Temporary Password
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
                <strong>Important:</strong> The employee should log in and change their password immediately. This temporary password expires in 24 hours.
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => navigate('/employees')}
                  className="flex-1 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition font-medium"
                >
                  Back to Employees
                </button>
                <button
                  onClick={() => {
                    const credentialsText = `Email: ${credentials.email}\nUsername: ${credentials.username}\nTemporary Password: ${credentials.tempPassword}\nRole: ${credentials.role}`
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

  if (loading && isEditMode) {
    return (
      <Layout>
        <div className="p-6 max-w-2xl mx-auto">
          <div className="flex items-center justify-center min-h-96">
            <div className="text-center">
              <div className="inline-block">
                <div className="w-12 h-12 border-4 border-gray-300 dark:border-gray-600 border-t-primary-500 rounded-full animate-spin"></div>
              </div>
              <p className="mt-4 text-gray-600 dark:text-gray-400">Loading employee details...</p>
            </div>
          </div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="p-6 max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-8">
          {isEditMode ? t('employees.editEmployee') : t('employees.addEmployee')}
        </h1>

        <Card>
          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              label={t('employees.name')}
              name="name"
              value={formData.name}
              onChange={handleChange}
              error={errors.name}
            />

            <Input
              label={t('employees.email')}
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label={t('employees.department')}
                name="department"
                value={formData.department}
                onChange={handleChange}
                error={errors.department}
              />
              <Input
                label="Position"
                name="position"
                value={formData.position}
                onChange={handleChange}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Hire Date"
                name="hire_date"
                type="date"
                value={formData.hire_date}
                onChange={handleChange}
              />
              <Input
                label="Phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <div className="flex items-center gap-2">
                    <span>Status</span>
                    <span className="text-xs px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded">Employee Status</span>
                  </div>
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:border-primary-500 dark:bg-gray-700 dark:text-gray-100 transition-colors hover:border-gray-400 dark:hover:border-gray-500 appearance-none bg-no-repeat bg-right pr-10"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%236b7280' d='M1 4l5 5 5-5z'/%3E%3C/svg%3E")`,
                    backgroundPosition: 'right 12px center'
                  }}
                >
                  <option value="active">🟢 Active</option>
                  <option value="inactive">🔴 Inactive</option>
                  <option value="on_leave">🟡 On Leave</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <div className="flex items-center gap-2">
                    <span>{t('employees.role')}</span>
                    <span className="text-xs px-2 py-1 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 rounded">System Role</span>
                  </div>
                </label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:border-primary-500 dark:bg-gray-700 dark:text-gray-100 transition-colors hover:border-gray-400 dark:hover:border-gray-500 appearance-none bg-no-repeat bg-right pr-10"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%236b7280' d='M1 4l5 5 5-5z'/%3E%3C/svg%3E")`,
                    backgroundPosition: 'right 12px center'
                  }}
                >
                  <option value="user">👤 User</option>
                  <option value="asset_manager">🔑 Asset Manager</option>
                </select>
              </div>
            </div>

            {!isEditMode && (
              <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    name="createUserAccount"
                    checked={formData.createUserAccount}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      createUserAccount: e.target.checked
                    }))}
                    className="w-4 h-4 rounded border-gray-300"
                  />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Create User Account (generate login credentials)
                  </span>
                </label>
                {formData.createUserAccount && (
                  <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                    A user account with temporary password will be created automatically. You&apos;ll be able to share the credentials with the employee.
                  </p>
                )}
              </div>
            )}

            <div className="flex gap-3 pt-6">
              <Button type="submit" className="flex-1" disabled={loading}>
                {loading ? 'Creating...' : (isEditMode ? 'Update Employee' : 'Create Employee')}
              </Button>
              <Button
                type="button"
                variant="secondary"
                className="flex-1"
                onClick={() => navigate('/employees')}
              >
                {t('common.cancel')}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </Layout>
  )
}
