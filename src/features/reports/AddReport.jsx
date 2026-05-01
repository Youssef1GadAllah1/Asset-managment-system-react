import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useTranslation } from 'react-i18next'
import { Layout } from '../../components/layout/Layout'
import { Card, Button, Input } from '../../components/common'
import { createReport, getAllAssets, getAllUsers, getAssetAssignmentsByUser } from '../../utils/api'

export const AddReport = () => {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { t } = useTranslation()
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'pending',
    asset_id: '',
    directed_to_id: '',
  })
  const [assets, setAssets] = useState([])
  const [employees, setEmployees] = useState([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    const loadData = async () => {
      try {
        const [assetsData, usersData] = await Promise.all([
          getAllAssets(),
          getAllUsers()
        ])
        
        let availableAssets = assetsData || []
        
        // For regular users, only show assets assigned to them
        if (user?.role === 'user' && user?.id) {
          try {
            const assignmentsData = await getAssetAssignmentsByUser(user.id)
            const assignedAssetIds = assignmentsData.map(a => a.asset_id)
            availableAssets = availableAssets.filter(asset => assignedAssetIds.includes(asset.id))
          } catch (error) {
            console.error('Error fetching user assignments:', error)
          }
        }
        // For admin and asset_manager, show all assets (no filtering)
        
        setAssets(availableAssets)
        setEmployees(usersData || [])
      } catch (error) {
        console.error('Error loading data:', error)
        setError('Failed to load assets and users')
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [user?.id, user?.role])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    // Validation
    if (!formData.title.trim()) {
      setError('Report title is required')
      return
    }
    if (!formData.description.trim()) {
      setError('Description is required')
      return
    }
    if (!user?.id) {
      setError('User information is not loaded. Please login again.')
      return
    }

    setSubmitting(true)
    try {
      const directedToId = formData.directed_to_id ? parseInt(formData.directed_to_id) : null
      const selectedUser = directedToId ? employees.find(emp => emp.id === directedToId) : null
      
      const newReport = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        type: 'general',
        status: formData.status,
        generated_by_id: user?.id,
        generated_by_name: user?.name,
        directed_to_id: directedToId,
        directed_to_name: selectedUser?.name || null,
        data: null
      }
      
      console.log('Creating report with data:', newReport)
      const response = await createReport(newReport)
      console.log('Report created successfully:', response)
      setSuccess('Report created successfully!')
      setTimeout(() => navigate('/reports'), 1000)
    } catch (error) {
      console.error('Error creating report:', error)
      const errorMessage = error.message || 'Failed to create report'
      setError(errorMessage)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Layout>
      <div className="p-6 max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-8">
          {t('reports.addReport')}
        </h1>

        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-200">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg text-green-700 dark:text-green-200">
            {success}
          </div>
        )}

        <Card>
          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              label="Report Title"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              required
              disabled={submitting}
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:border-primary-500 dark:bg-gray-700 dark:text-gray-100 h-32 disabled:opacity-50 disabled:cursor-not-allowed"
                required
                disabled={submitting}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Asset
                {user?.role === 'user' && <span className="text-xs text-gray-500 ml-2">(Your assigned assets)</span>}
              </label>
              <select
                value={formData.asset_id}
                onChange={(e) => setFormData({...formData, asset_id: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:border-primary-500 dark:bg-gray-700 dark:text-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={submitting}
              >
                <option value="">Select an asset (optional)</option>
                {assets.map(asset => (
                  <option key={asset.id} value={asset.id}>{asset.name}</option>
                ))}
              </select>
              {user?.role === 'user' && assets.length === 0 && (
                <p className="text-sm text-gray-500 mt-2">No assets assigned to you</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Created By
                </label>
                <div className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700/50 text-gray-900 dark:text-gray-100">
                  {user?.name || 'N/A'}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Directed To
                </label>
                <select
                  value={formData.directed_to_id}
                  onChange={(e) => setFormData({...formData, directed_to_id: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:border-primary-500 dark:bg-gray-700 dark:text-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={submitting}
                >
                  <option value="">Select employee (optional)</option>
                  {employees.map(emp => (
                    <option key={emp.id} value={emp.id}>{emp.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({...formData, status: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:border-primary-500 dark:bg-gray-700 dark:text-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={submitting}
              >
                <option value="pending">Pending</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>

            <div className="flex gap-3 pt-6">
              <Button 
                type="submit" 
                className="flex-1"
                disabled={submitting}
              >
                {submitting ? 'Creating...' : 'Create Report'}
              </Button>
              <Button
                type="button"
                variant="secondary"
                className="flex-1"
                onClick={() => navigate('/reports')}
                disabled={submitting}
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
