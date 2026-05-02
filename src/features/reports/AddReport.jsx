import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useTranslation } from 'react-i18next'
import { Layout } from '../../components/layout/Layout'
import { Card, Button, Input, Select } from '../../components/common'
import { createReport, getAllAssets, getAllEmployees, getAllUsers, getAssetAssignmentsByUser } from '../../utils/api'

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
  const [recipients, setRecipients] = useState([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    const loadData = async () => {
      try {
        const [assetsData, employeesData, usersData] = await Promise.all([
          getAllAssets(),
          getAllEmployees(),
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
        
        // Combine employees and users, removing duplicates
        const allRecipients = [
          ...(employeesData || []).map(emp => ({ id: emp.id, name: emp.name, department: emp.department, type: 'employee' })),
          ...(usersData || []).map(usr => ({ id: usr.id, name: usr.name, department: usr.department, type: 'user' }))
        ]
        
        // Remove duplicates based on id
        const uniqueRecipients = Array.from(new Map(allRecipients.map(item => [item.id, item])).values())
        
        setAssets(availableAssets)
        setRecipients(uniqueRecipients)
      } catch (error) {
        console.error('Error loading data:', error)
        setError('Failed to load assets and recipients')
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

            <Select
              label={`Asset ${user?.role === 'user' ? '(Your assigned assets)' : ''}`}
              value={formData.asset_id}
              onChange={(e) => setFormData({...formData, asset_id: e.target.value})}
              badge="Asset Reference"
              icon="📦"
              options={assets.map(asset => ({ id: asset.id, label: asset.name }))}
              disabled={submitting}
              placeholder="Select an asset (optional)"
            />
            {user?.role === 'user' && assets.length === 0 && (
              <p className="text-sm text-gray-500 mt-2">No assets assigned to you</p>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Created By
                </label>
                <div className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700/50 text-gray-900 dark:text-gray-100">
                  {user?.name || 'N/A'}
                </div>
              </div>

              <Select
                label="Directed To (Employee or User)"
                value={formData.directed_to_id}
                onChange={(e) => setFormData({...formData, directed_to_id: e.target.value})}
                badge="Recipient"
                icon="👤"
                options={recipients.map(recipient => ({ 
                  id: recipient.id, 
                  label: `${recipient.name} (${recipient.department || 'N/A'} - ${recipient.type === 'user' ? 'User' : 'Employee'})`
                }))}
                disabled={submitting}
                placeholder="Select a recipient (optional)"
              />
              {recipients.length === 0 && (
                <p className="text-sm text-amber-600 dark:text-amber-400">No employees or users found</p>
              )}
              {recipients.length > 0 && (
                <p className="text-xs text-gray-500 dark:text-gray-400">{recipients.length} recipients available</p>
              )}
            </div>

            <Select
              label="Status"
              value={formData.status}
              onChange={(e) => setFormData({...formData, status: e.target.value})}
              badge="Report Status"
              icon="📋"
              options={[
                { id: 'pending', label: '⏱️ Pending' },
                { id: 'in_progress', label: '⚙️ In Progress' },
                { id: 'completed', label: '✓ Completed' }
              ]}
              disabled={submitting}
            />

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
