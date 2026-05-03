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
  })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(id ? true : false)
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
      } else {
        await createEmployee(formData)
      }
      
      navigate('/employees')
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label={t('employees.email')}
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                error={errors.email}
              />
              <Input
                label="Username"
                name="username"
                value={formData.username}
                onChange={handleChange}
              />
            </div>

            <Input
              label={t('employees.department')}
              name="department"
              value={formData.department}
              onChange={handleChange}
              error={errors.department}
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t('employees.role')}
              </label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:border-primary-500 dark:bg-gray-700 dark:text-gray-100"
              >
                <option value="user">User</option>
                <option value="asset_manager">Asset Manager</option>
              </select>
            </div>

            <div className="flex gap-3 pt-6">
              <Button type="submit" className="flex-1">
                {isEditMode ? 'Update Employee' : 'Create Employee'}
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
