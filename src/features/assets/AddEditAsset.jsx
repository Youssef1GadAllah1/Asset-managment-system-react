import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Layout } from '../../components/layout/Layout'
import { Card, Button, Input, Badge } from '../../components/common'
import { createAsset, updateAsset, getAssetById, getAllEmployees, getAssetAssignmentsByAsset, updateAssetAssignment, deleteAssetAssignment } from '../../utils/api'
import { useAuth } from '../../context/AuthContext'
import { Trash2, Edit2 } from 'lucide-react'

export const AddEditAsset = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const { t } = useTranslation()
  const { user } = useAuth()

  // Redirect non-admin/non-asset_manager users
  if (user && user.role === 'user') {
    return (
      <Layout>
        <div className="p-6 max-w-2xl mx-auto">
          <Card className="text-center py-12">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              Access Denied
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Only administrators and asset managers can add or edit assets.
            </p>
            <Button onClick={() => navigate('/assets')} className="px-6">
              Back to Assets
            </Button>
          </Card>
        </div>
      </Layout>
    )
  }
  const [formData, setFormData] = useState({
    name: '',
    category: 'Electronics',
    type: '',
    price: '',
    amount: 1,
    location: '',
    status: 'available',
    color: '',
    image: '📦',
    date: new Date().toISOString().split('T')[0],
  })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(id ? true : false)
  const [assignments, setAssignments] = useState([])
  const [editingAssignment, setEditingAssignment] = useState(null)
  const [updatingAssignment, setUpdatingAssignment] = useState(false)

  useEffect(() => {
    const loadData = async () => {
      try {
        if (id) {
          const assetData = await getAssetById(id)
          setFormData(assetData)
          
          // Load assignments for this asset
          const assignmentsData = await getAssetAssignmentsByAsset(id)
          setAssignments(assignmentsData || [])
        }
      } catch (error) {
        console.error('Failed to load data:', error)
      } finally {
        setLoading(false)
      }
    }
    
    loadData()
  }, [id])
  const isEditMode = !!id

  const categories = [
    'Electronics',
    'Photography',
    'Mobile',
    'Furniture',
    'Accessories',
    'Other'
  ]

  const statuses = [
    { value: 'available', label: 'Available' },
    { value: 'in_use', label: 'In Use' },
    { value: 'maintenance', label: 'Maintenance' },
    { value: 'retired', label: 'Retired' },
  ]

  const handleSubmit = async (e) => {
    e.preventDefault()
    const newErrors = {}

    if (!formData.name.trim()) newErrors.name = 'Asset name is required'
    if (!formData.price) newErrors.price = 'Price is required'
    if (!formData.location.trim()) newErrors.location = 'Location is required'

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    try {
      setLoading(true)
      
      if (id) {
        // Update existing asset
        await updateAsset(id, formData)
      } else {
        // Create new asset
        await createAsset(formData)
      }
      
      navigate('/assets')
    } catch (error) {
      console.error('Failed to save asset:', error)
      setErrors({ submit: error.message || 'Failed to save asset' })
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
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const handleDeleteAssignment = async (assignmentId) => {
    if (!window.confirm('Are you sure you want to delete this assignment?')) return
    
    try {
      setUpdatingAssignment(true)
      await deleteAssetAssignment(assignmentId)
      setAssignments(assignments.filter(a => a.id !== assignmentId))
    } catch (error) {
      console.error('Failed to delete assignment:', error)
      alert('Failed to delete assignment')
    } finally {
      setUpdatingAssignment(false)
    }
  }

  const handleUpdateAssignment = async (assignmentId) => {
    if (!editingAssignment || editingAssignment.id !== assignmentId) return
    
    try {
      setUpdatingAssignment(true)
      await updateAssetAssignment(assignmentId, {
        quantity: editingAssignment.quantity,
        return_date: editingAssignment.return_date
      })
      
      const updated = assignments.map(a =>
        a.id === assignmentId ? { ...a, ...editingAssignment } : a
      )
      setAssignments(updated)
      setEditingAssignment(null)
    } catch (error) {
      console.error('Failed to update assignment:', error)
      alert('Failed to update assignment')
    } finally {
      setUpdatingAssignment(false)
    }
  }

  return (
    <Layout>
      <div className="p-6 max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-8">
          {isEditMode ? t('assets.editAsset') : t('assets.addAsset')}
        </h1>

        <Card>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label={t('assets.name')}
                name="name"
                value={formData.name}
                onChange={handleChange}
                error={errors.name}
              />
              <Input
                label={t('assets.type')}
                name="type"
                value={formData.type}
                onChange={handleChange}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {t('assets.category')}
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:text-gray-100"
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <Input
                label={t('assets.price')}
                name="price"
                type="number"
                value={formData.price}
                onChange={handleChange}
                error={errors.price}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Amount"
                name="amount"
                type="number"
                min="0"
                value={formData.amount}
                onChange={handleChange}
              />
              <Input
                label={t('assets.location')}
                name="location"
                value={formData.location}
                onChange={handleChange}
                error={errors.location}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label={t('assets.color')}
                name="color"
                value={formData.color}
                onChange={handleChange}
              />
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {t('assets.status')}
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  disabled={user?.role === 'user'}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:text-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {statuses.map(status => (
                    <option key={status.value} value={status.value}>
                      {status.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <Input
              label={t('assets.date')}
              name="date"
              type="date"
              value={formData.date}
              onChange={handleChange}
            />

            {/* Assignments Section */}
            {isEditMode && assignments.length > 0 && (
              <div className="pt-8 border-t border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                  Current Assignments
                </h3>
                <div className="space-y-3">
                  {assignments.map((assignment) => (
                    <div key={assignment.id} className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                      {editingAssignment?.id === assignment.id ? (
                        // Edit mode
                        <div className="space-y-3">
                          <div className="flex items-center justify-between mb-2">
                            <p className="font-semibold text-gray-900 dark:text-gray-100">
                              {assignment.user_name}
                            </p>
                            <Badge variant={assignment.status}>{assignment.status}</Badge>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">
                                Quantity
                              </label>
                              <input
                                type="number"
                                min="1"
                                value={editingAssignment.quantity}
                                onChange={(e) => setEditingAssignment({
                                  ...editingAssignment,
                                  quantity: parseInt(e.target.value)
                                })}
                                className="w-full px-2 py-1 border border-gray-300 dark:border-gray-600 rounded text-center dark:bg-gray-600 dark:text-gray-100"
                              />
                            </div>
                            <div>
                              <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">
                                Return Date
                              </label>
                              <input
                                type="date"
                                value={editingAssignment.return_date || ''}
                                onChange={(e) => setEditingAssignment({
                                  ...editingAssignment,
                                  return_date: e.target.value || null
                                })}
                                className="w-full px-2 py-1 border border-gray-300 dark:border-gray-600 rounded dark:bg-gray-600 dark:text-gray-100"
                              />
                            </div>
                          </div>

                          <div className="flex gap-2 pt-2">
                            <Button
                              onClick={() => handleUpdateAssignment(assignment.id)}
                              disabled={updatingAssignment}
                              variant="primary"
                              size="sm"
                              className="flex-1"
                            >
                              {updatingAssignment ? 'Saving...' : 'Save'}
                            </Button>
                            <Button
                              onClick={() => setEditingAssignment(null)}
                              disabled={updatingAssignment}
                              variant="secondary"
                              size="sm"
                              className="flex-1"
                            >
                              Cancel
                            </Button>
                          </div>
                        </div>
                      ) : (
                        // View mode
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <p className="font-semibold text-gray-900 dark:text-gray-100 mb-1">
                              {assignment.user_name}
                            </p>
                            <div className="grid grid-cols-3 gap-2 text-sm">
                              <div>
                                <span className="text-gray-600 dark:text-gray-400">Qty:</span>
                                <p className="font-medium text-gray-900 dark:text-gray-100">
                                  {assignment.quantity} units
                                </p>
                              </div>
                              <div>
                                <span className="text-gray-600 dark:text-gray-400">Assigned:</span>
                                <p className="font-medium text-gray-900 dark:text-gray-100">
                                  {new Date(assignment.assigned_date).toLocaleDateString()}
                                </p>
                              </div>
                              {assignment.return_date && (
                                <div>
                                  <span className="text-gray-600 dark:text-gray-400">Return:</span>
                                  <p className="font-medium text-gray-900 dark:text-gray-100">
                                    {new Date(assignment.return_date).toLocaleDateString()}
                                  </p>
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <button
                              type="button"
                              onClick={() => setEditingAssignment({
                                id: assignment.id,
                                quantity: assignment.quantity,
                                return_date: assignment.return_date
                              })}
                              className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded"
                            >
                              <Edit2 size={16} />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteAssignment(assignment.id)}
                              disabled={updatingAssignment}
                              className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded disabled:opacity-50"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex gap-3 pt-6">
              <Button
                type="submit"
                className="flex-1"
              >
                Update Asset
              </Button>
              <Button
                type="button"
                variant="secondary"
                className="flex-1"
                onClick={() => navigate('/assets')}
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
