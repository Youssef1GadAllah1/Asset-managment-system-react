import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../../context/AuthContext'
import { Layout } from '../../components/layout/Layout'
import { Card, Button, Input, Select } from '../../components/common'
import { createTask, updateTask, getTaskById, getAllEmployees } from '../../utils/api'

export const AddEditTask = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const { t } = useTranslation()
  const { user } = useAuth()
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    assigned_to_id: '',
    assigned_to_name: '',
    priority: 'medium',
    status: 'pending',
  })
  const [employees, setEmployees] = useState([])
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(id ? true : false)

  const isEditMode = !!id

  useEffect(() => {
    const fetchData = async () => {
      try {
        const employeesData = await getAllEmployees()
        setEmployees(employeesData)

        if (id) {
          const task = await getTaskById(id)
          // Ensure assigned_to_name is set from employees data if missing
          if (task.assigned_to_id && !task.assigned_to_name && employeesData.length > 0) {
            const employee = employeesData.find(emp => emp.id === task.assigned_to_id)
            task.assigned_to_name = employee?.name || ''
          }
          setFormData(task)
        }
      } catch (error) {
        console.error('Error loading data:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [id])

  const handleSubmit = async (e) => {
    e.preventDefault()
    const newErrors = {}

    if (!formData.title.trim()) newErrors.title = 'Title is required'
    if (!formData.description.trim()) newErrors.description = 'Description is required'

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    try {
      setLoading(true)
      
      // Ensure assigned_to_name is set from the selected employee
      let assignedToName = formData.assigned_to_name
      if (formData.assigned_to_id && !assignedToName) {
        const employee = employees.find(emp => emp.id === parseInt(formData.assigned_to_id))
        assignedToName = employee?.name || ''
      }

      const taskData = {
        title: formData.title,
        description: formData.description,
        assigned_to_id: formData.assigned_to_id ? parseInt(formData.assigned_to_id) : null,
        assigned_to_name: assignedToName || null,
        assigned_from_id: user?.id,
        assigned_from_name: user?.name,
        priority: formData.priority,
        status: formData.status,
      }

      if (isEditMode) {
        await updateTask(id, taskData)
      } else {
        await createTask(taskData)
      }

      navigate('/tasks')
    } catch (error) {
      console.error('Error saving task:', error)
      setErrors({ submit: error.message || 'Failed to save task' })
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

  const handleEmployeeChange = (e) => {
    const empId = e.target.value
    const employee = employees.find(emp => emp.id === parseInt(empId))
    setFormData(prev => ({
      ...prev,
      assigned_to_id: empId ? parseInt(empId) : '',
      assigned_to_name: employee?.name || ''
    }))
  }

  if (loading && isEditMode) return <Layout><div className="p-6">Loading...</div></Layout>

  return (
    <Layout>
      <div className="p-6 max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-8">
          {isEditMode ? 'Edit Task' : 'Add New Task'}
        </h1>

        <Card>
          <form onSubmit={handleSubmit} className="space-y-6">
            {errors.submit && (
              <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-800 dark:text-red-200">
                {errors.submit}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Title *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Enter task title"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:border-primary-500 dark:bg-gray-700 dark:text-gray-100"
              />
              {errors.title && <p className="text-red-600 text-sm mt-1">{errors.title}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Description *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Enter task description"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:border-primary-500 dark:bg-gray-700 dark:text-gray-100 h-24 resize-none"
              />
              {errors.description && <p className="text-red-600 text-sm mt-1">{errors.description}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Select
                label="Assign To"
                name="assigned_to_id"
                value={formData.assigned_to_id}
                onChange={handleEmployeeChange}
                badge="Assignee"
                icon="👤"
                options={employees.map(emp => ({ id: emp.id, label: emp.name, department: emp.department }))}
              />

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Assigned From
                </label>
                <input
                  type="text"
                  value={user?.name || ''}
                  disabled
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-800 dark:text-gray-100 cursor-not-allowed"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Select
                label="Priority"
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                badge="Urgency Level"
                icon="⚡"
                options={[
                  { id: 'low', label: '🟢 Low' },
                  { id: 'medium', label: '🟡 Medium' },
                  { id: 'high', label: '🔴 High' }
                ]}
              />
            </div>

            <Select
              label="Status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              badge="Task Status"
              icon="✓"
              options={[
                { id: 'pending', label: '⏱️ Pending' },
                { id: 'in_progress', label: '⚙️ In Progress' },
                { id: 'completed', label: '✅ Completed' }
              ]}
            />

            <div className="flex gap-3 pt-6">
              <Button type="submit" className="flex-1" disabled={loading}>
                {isEditMode ? 'Update Task' : 'Create Task'}
              </Button>
              <Button
                type="button"
                variant="secondary"
                className="flex-1"
                onClick={() => navigate('/tasks')}
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
