import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useTranslation } from 'react-i18next'
import { Layout } from '../../components/layout/Layout'
import { Card, Button } from '../../components/common'
import { getAllAssets, getAllUsers, assignAssets } from '../../utils/api'
import { Trash2 } from 'lucide-react'

export const AssignAsset = () => {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { t } = useTranslation()

  const [assets, setAssets] = useState([])
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const [selectedAsset, setSelectedAsset] = useState(null)
  const [selectedUsers, setSelectedUsers] = useState([])
  const [quantities, setQuantities] = useState({})
  const [returnDate, setReturnDate] = useState('')

  useEffect(() => {
    const loadData = async () => {
      try {
        const [assetsData, usersData] = await Promise.all([
          getAllAssets(),
          getAllUsers()
        ])
        setAssets(assetsData || [])
        setUsers(usersData || [])
      } catch (error) {
        console.error('Error loading data:', error)
        setError('Failed to load assets and users')
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  const handleAssetSelect = (e) => {
    const assetId = parseInt(e.target.value)
    const asset = assets.find(a => a.id === assetId)
    setSelectedAsset(asset || null)
  }

  const handleUserToggle = (userId) => {
    setSelectedUsers(prev => {
      if (prev.includes(userId)) {
        return prev.filter(id => id !== userId)
      } else {
        return [...prev, userId]
      }
    })
    // Initialize quantity for this user
    if (!quantities[userId]) {
      setQuantities(prev => ({
        ...prev,
        [userId]: 1
      }))
    }
  }

  const handleQuantityChange = (userId, value) => {
    const qty = parseInt(value) || 0
    if (selectedAsset && qty > selectedAsset.amount) {
      setError(`Quantity cannot exceed available amount (${selectedAsset.amount})`)
      return
    }
    setQuantities(prev => ({
      ...prev,
      [userId]: qty > 0 ? qty : 0
    }))
    setError('')
  }

  const getSelectedUserName = (userId) => {
    return users.find(u => u.id === userId)?.name || 'Unknown'
  }

  const getTotalQuantity = () => {
    return selectedUsers.reduce((sum, userId) => sum + (quantities[userId] || 0), 0)
  }

  const getSortedAssets = () => {
    // Separate available and exhausted assets
    const available = assets.filter(a => a.amount > 0)
    const exhausted = assets.filter(a => a.amount === 0)
    // Combine with available first
    return [...available, ...exhausted]
  }

  const handleRemoveUser = (userId) => {
    setSelectedUsers(prev => prev.filter(id => id !== userId))
    setQuantities(prev => {
      const newQuantities = { ...prev }
      delete newQuantities[userId]
      return newQuantities
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (!selectedAsset) {
      setError('Please select an asset')
      return
    }

    if (selectedUsers.length === 0) {
      setError('Please select at least one user')
      return
    }

    const totalQty = getTotalQuantity()
    if (totalQty === 0) {
      setError('Please enter quantities for selected users')
      return
    }

    if (totalQty > selectedAsset.amount) {
      setError(`Total quantity (${totalQty}) exceeds available amount (${selectedAsset.amount})`)
      return
    }

    setSubmitting(true)
    try {
      const assignmentData = {
        asset_id: selectedAsset.id,
        user_ids: selectedUsers,
        quantities: selectedUsers.map(userId => quantities[userId] || 1),
        assigned_by_id: user?.id,
        assigned_by_name: user?.name,
        return_date: returnDate || null
      }

      console.log('Assigning assets:', assignmentData)
      await assignAssets(assignmentData)
      setSuccess(`Asset assigned successfully to ${selectedUsers.length} user(s)!`)
      setTimeout(() => navigate('/assets'), 2000)
    } catch (error) {
      console.error('Error assigning assets:', error)
      setError(error.message || 'Failed to assign asset')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Layout>
      <div className="p-6 max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-8">
          Assign Asset to Users
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
            {/* Asset Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Select Asset *
              </label>
              <select
                value={selectedAsset?.id || ''}
                onChange={handleAssetSelect}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:border-primary-500 dark:bg-gray-700 dark:text-gray-100"
                required
              >
                <option value="">Choose an asset...</option>
                {getSortedAssets().map(asset => (
                  <option 
                    key={asset.id} 
                    value={asset.id}
                    disabled={asset.amount === 0}
                  >
                    {asset.name} ({asset.amount} available)
                    {asset.amount === 0 && ' - OUT OF STOCK'}
                  </option>
                ))}
              </select>
            </div>

            {selectedAsset && (
              <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  <strong>Selected Asset:</strong> {selectedAsset.name}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  <strong>Available Amount:</strong> {selectedAsset.amount}
                </p>
                {getTotalQuantity() > 0 && (
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    <strong>Total to Assign:</strong> {getTotalQuantity()} / {selectedAsset.amount}
                  </p>
                )}
              </div>
            )}

            {/* Return Date */}
            {selectedAsset && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Return Date (Optional)
                </label>
                <input
                  type="date"
                  value={returnDate}
                  onChange={(e) => setReturnDate(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:border-primary-500 dark:bg-gray-700 dark:text-gray-100"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Set the expected return date for the assigned asset
                </p>
              </div>
            )}

            {/* User Selection */}
            {selectedAsset && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Select Users to Assign To *
                </label>
                <div className="space-y-2 max-h-60 overflow-y-auto border border-gray-300 dark:border-gray-600 rounded-lg p-3">
                  {users.map(u => (
                    <label key={u.id} className="flex items-center p-2 hover:bg-gray-100 dark:hover:bg-gray-600/50 rounded">
                      <input
                        type="checkbox"
                        checked={selectedUsers.includes(u.id)}
                        onChange={() => handleUserToggle(u.id)}
                        className="w-4 h-4 mr-3"
                      />
                      <span className="flex-1 text-gray-700 dark:text-gray-300">{u.name}</span>
                      <span className="text-xs text-gray-500">{u.role}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Selected Users with Quantities */}
            {selectedUsers.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Assign Quantities *
                </label>
                <div className="space-y-3 max-h-60 overflow-y-auto border border-gray-300 dark:border-gray-600 rounded-lg p-3">
                  {selectedUsers.map(userId => (
                    <div key={userId} className="flex items-center space-x-3 p-2 bg-gray-50 dark:bg-gray-700/50 rounded">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                          {getSelectedUserName(userId)}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input
                          type="number"
                          min="0"
                          max={selectedAsset?.amount}
                          value={quantities[userId] || 0}
                          onChange={(e) => handleQuantityChange(userId, e.target.value)}
                          className="w-16 px-2 py-1 border border-gray-300 dark:border-gray-600 rounded text-center dark:bg-gray-600 dark:text-gray-100"
                          required
                        />
                        <span className="text-sm text-gray-500">units</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveUser(userId)}
                        className="p-1 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3 pt-6 border-t dark:border-gray-700">
              <Button type="submit" disabled={submitting || !selectedAsset || selectedUsers.length === 0}>
                {submitting ? 'Assigning...' : 'Assign Asset'}
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={() => navigate('/assets')}
                disabled={submitting}
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

export default AssignAsset
