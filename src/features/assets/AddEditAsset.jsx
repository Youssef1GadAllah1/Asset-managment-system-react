import { useState, useEffect, useRef } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Layout } from '../../components/layout/Layout'
import { Card, Button, Input, Badge, Select } from '../../components/common'
import { createAsset, updateAsset, getAssetById, getAssetAssignmentsByAsset, updateAssetAssignment, deleteAssetAssignment } from '../../utils/api'
import { useAuth } from '../../context/AuthContext'
import { Trash2, Edit2, ImagePlus, X } from 'lucide-react'

export const AddEditAsset = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const { t } = useTranslation()
  const { user } = useAuth()

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
    serialNumber: '',
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
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef(null)

  useEffect(() => {
    const loadData = async () => {
      try {
        if (id) {
          const assetData = await getAssetById(id)
          setFormData({
            name: assetData.name || '',
            serialNumber: assetData.serialNumber || assetData.serial_number || '',
            category: assetData.category || 'Electronics',
            type: assetData.type || '',
            price: assetData.price || '',
            amount: assetData.amount || 1,
            location: assetData.location || '',
            status: assetData.status || 'available',
            color: assetData.color || '',
            image: assetData.image || '📦',
            date: assetData.date ? String(assetData.date).split('T')[0] : new Date().toISOString().split('T')[0],
          })
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

  const handleImageChange = (file) => {
    if (!file || !file.type.startsWith('image/')) return
    if (file.size > 5 * 1024 * 1024) {
      setErrors(prev => ({ ...prev, image: 'Image must be under 5MB' }))
      return
    }
    const reader = new FileReader()
    reader.onload = (e) => {
      setFormData(prev => ({ ...prev, image: e.target.result }))
      setErrors(prev => ({ ...prev, image: '' }))
    }
    reader.readAsDataURL(file)
  }

  const categories = ['Electronics', 'Photography', 'Mobile', 'Furniture', 'Accessories', 'Other']
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
      const payload = {
        ...formData,
        serialNumber: formData.serialNumber.trim() || null,
      }
      if (id) {
        await updateAsset(id, payload)
      } else {
        await createAsset(payload)
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
                label="Serial Number"
                name="serialNumber"
                value={formData.serialNumber}
                onChange={handleChange}
                placeholder="SN-0001"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label={t('assets.type')}
                name="type"
                value={formData.type}
                onChange={handleChange}
              />
              <Select
                label={t('assets.category')}
                name="category"
                value={formData.category}
                onChange={handleChange}
                badge="Asset Type"
                icon="📦"
                options={categories.map(cat => ({ id: cat, label: cat }))}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label={t('assets.price')}
                name="price"
                type="number"
                value={formData.price}
                onChange={handleChange}
                error={errors.price}
              />
              <Input
                label="Amount"
                name="amount"
                type="number"
                min="0"
                value={formData.amount}
                onChange={handleChange}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label={t('assets.location')}
                name="location"
                value={formData.location}
                onChange={handleChange}
                error={errors.location}
              />
              <Select
                label={t('assets.status')}
                name="status"
                value={formData.status}
                onChange={handleChange}
                disabled={user?.role === 'user'}
                badge="Asset Status"
                icon="🔄"
                options={statuses.map(status => ({ id: status.value, label: status.label }))}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label={t('assets.color')}
                name="color"
                value={formData.color}
                onChange={handleChange}
              />
              <Input
                label={t('assets.date')}
                name="date"
                type="date"
                value={formData.date}
                onChange={handleChange}
              />
            </div>

            {/* Asset Image Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Asset Image
              </label>
              <div className="flex items-start gap-4">
                {formData.image && formData.image.startsWith('data:') ? (
                  <div className="relative flex-shrink-0">
                    <img
                      src={formData.image}
                      alt="Asset preview"
                      className="w-24 h-24 rounded-xl object-cover border-2 border-gray-200 dark:border-gray-600"
                    />
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, image: '📦' }))}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-0.5 hover:bg-red-600"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ) : (
                  <div className="w-24 h-24 rounded-xl bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-4xl flex-shrink-0 border-2 border-gray-200 dark:border-gray-600">
                    {formData.image || '📦'}
                  </div>
                )}
                <div
                  onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
                  onDragLeave={(e) => { e.preventDefault(); setIsDragging(false) }}
                  onDrop={(e) => { e.preventDefault(); setIsDragging(false); handleImageChange(e.dataTransfer.files[0]) }}
                  onClick={() => fileInputRef.current?.click()}
                  className={`flex-1 p-5 border-2 border-dashed rounded-xl text-center cursor-pointer transition-all ${
                    isDragging
                      ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                      : 'border-gray-300 dark:border-gray-600 hover:border-primary-400 hover:bg-gray-50 dark:hover:bg-gray-800'
                  }`}
                >
                  <ImagePlus size={22} className="mx-auto mb-2 text-gray-400" />
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    <span className="font-medium text-primary-600 dark:text-primary-400">Click to upload</span> or drag & drop
                  </p>
                  <p className="text-xs text-gray-400 mt-1">PNG, JPG, WEBP up to 5MB</p>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleImageChange(e.target.files[0])}
                />
              </div>
              {errors.image && <p className="mt-1 text-sm text-red-600">{errors.image}</p>}
            </div>

            {isEditMode && assignments.length > 0 && (
              <div className="pt-8 border-t border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                  Current Assignments
                </h3>
                <div className="space-y-3">
                  {assignments.map((assignment) => (
                    <div key={assignment.id} className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                      {editingAssignment?.id === assignment.id ? (
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
                            <Button onClick={() => handleUpdateAssignment(assignment.id)} disabled={updatingAssignment} variant="primary" size="sm">
                              Save
                            </Button>
                            <Button onClick={() => setEditingAssignment(null)} variant="outline" size="sm">
                              Cancel
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-semibold text-gray-900 dark:text-gray-100">{assignment.user_name}</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Qty: {assignment.quantity}</p>
                          </div>
                          <div className="flex gap-2">
                            <Button onClick={() => setEditingAssignment(assignment)} variant="outline" size="sm">
                              <Edit2 size={14} />
                            </Button>
                            <Button onClick={() => handleDeleteAssignment(assignment.id)} variant="danger" size="sm">
                              <Trash2 size={14} />
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {errors.submit && (
              <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-300">
                {errors.submit}
              </div>
            )}

            <div className="flex gap-4 pt-4">
              <Button type="submit" disabled={loading}>
                {loading ? 'Saving...' : isEditMode ? 'Update Asset' : 'Create Asset'}
              </Button>
              <Button type="button" variant="outline" onClick={() => navigate('/assets')}>
                Cancel
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </Layout>
  )
}
