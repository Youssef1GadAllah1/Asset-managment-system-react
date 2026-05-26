import { useState, useEffect, useMemo, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../../context/AuthContext'
import { Layout } from '../../components/layout/Layout'
import { Card, Button, Badge } from '../../components/common'
import { getAllAssets, deleteAsset, getAssetAssignmentsByAsset, updateAsset } from '../../utils/api'
import { Plus, Search, Edit, Trash2, X, RefreshCw, CheckCircle } from 'lucide-react'

const STATUS_OPTIONS = [
  { value: 'available',   label: 'Available',    color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' },
  { value: 'in_use',      label: 'In Use',       color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300' },
  { value: 'maintenance', label: 'Maintenance',   color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300' },
  { value: 'retired',     label: 'Retired',       color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300' },
]

export const Assets = () => {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { t } = useTranslation()
  const [assets, setAssets] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [deleteId, setDeleteId] = useState(null)
  const [selectedAsset, setSelectedAsset] = useState(null)
  const [showAssetModal, setShowAssetModal] = useState(false)
  const [loading, setLoading] = useState(true)
  const [assignments, setAssignments] = useState([])
  const [loadingAssignments, setLoadingAssignments] = useState(false)

  // Status-only edit modal state
  const [showStatusModal, setShowStatusModal] = useState(false)
  const [statusAsset, setStatusAsset] = useState(null)
  const [newStatus, setNewStatus] = useState('')
  const [savingStatus, setSavingStatus] = useState(false)

  useEffect(() => {
    fetchAssets()
  }, [])

  const fetchAssets = async () => {
    try {
      setLoading(true)
      const data = await getAllAssets()
      setAssets(data)
    } catch (error) {
      console.error('Failed to fetch assets:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = useCallback((id) => {
    setDeleteId(id)
    setShowDeleteModal(true)
  }, [])

  const handleAssetClick = useCallback(async (asset) => {
    setSelectedAsset(asset)
    setShowAssetModal(true)
    setLoadingAssignments(true)
    try {
      const data = await getAssetAssignmentsByAsset(asset.id)
      setAssignments(data || [])
    } catch (error) {
      console.error('Failed to fetch assignments:', error)
      setAssignments([])
    } finally {
      setLoadingAssignments(false)
    }
  }, [])

  const confirmDelete = useCallback(async () => {
    try {
      await deleteAsset(deleteId)
      setAssets(prev => prev.filter(a => a.id !== deleteId))
      setShowDeleteModal(false)
    } catch (error) {
      console.error('Failed to delete asset:', error)
    }
  }, [deleteId])

  const handleOpenStatusModal = useCallback((e, asset) => {
    e.stopPropagation()
    setStatusAsset(asset)
    setNewStatus(asset.status)
    setShowStatusModal(true)
  }, [])

  const handleSaveStatus = async () => {
    if (!statusAsset || newStatus === statusAsset.status) {
      setShowStatusModal(false)
      return
    }
    try {
      setSavingStatus(true)
      await updateAsset(statusAsset.id, { ...statusAsset, status: newStatus })
      setAssets(prev => prev.map(a => a.id === statusAsset.id ? { ...a, status: newStatus } : a))
      setShowStatusModal(false)
      setStatusAsset(null)
    } catch (error) {
      console.error('Failed to update status:', error)
    } finally {
      setSavingStatus(false)
    }
  }

  const filteredAssets = useMemo(() => {
    const lower = searchTerm.toLowerCase()
    return assets
      .filter(asset => {
        const matchesSearch = asset.name.toLowerCase().includes(lower) ||
          asset.category.toLowerCase().includes(lower) ||
          String(asset.serialNumber || asset.serial_number || '').toLowerCase().includes(lower)
        const matchesStatus = statusFilter === 'all' || asset.status === statusFilter
        return matchesSearch && matchesStatus
      })
      .sort((a, b) => {
        if (a.amount > 0 && b.amount === 0) return -1
        if (a.amount === 0 && b.amount > 0) return 1
        return 0
      })
  }, [assets, searchTerm, statusFilter])

  return (
    <Layout>
      <div className="p-6 max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">{t('assets.title')}</h1>
          {user?.role === 'admin' && (
            <div className="flex gap-3">
              <Button onClick={() => navigate('/assets/assign')} variant="secondary" className="flex items-center space-x-2">
                <span>Assign Asset</span>
              </Button>
              <Button onClick={() => navigate('/assets/add')} className="flex items-center space-x-2">
                <Plus size={20} />
                <span>{t('assets.addAsset')}</span>
              </Button>
            </div>
          )}
        </div>

        <Card className="mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 text-gray-400" size={18} />
              <input
                type="text"
                placeholder={t('common.search')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:text-gray-100"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:text-gray-100"
            >
              <option value="all">All Status</option>
              <option value="available">Available</option>
              <option value="in_use">In Use</option>
              <option value="maintenance">Maintenance</option>
              <option value="retired">Retired</option>
            </select>
          </div>
        </Card>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-48 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse" />
            ))}
          </div>
        ) : filteredAssets.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAssets.map(asset => (
              <Card
                key={asset.id}
                className={`flex flex-col cursor-pointer hover:shadow-lg transition-shadow ${asset.amount === 0 ? 'opacity-50 grayscale' : ''}`}
                onClick={() => handleAssetClick(asset)}
              >
                <div className="flex items-center justify-between mb-4">
                  {asset.image && asset.image.startsWith('data:') ? (
                    <img src={asset.image} alt={asset.name} className="w-16 h-16 rounded-lg object-cover" />
                  ) : (
                    <span className="text-4xl">{asset.image || '📦'}</span>
                  )}
                  <Badge variant={asset.status}>{asset.status}</Badge>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1">{asset.name}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  {asset.category} • {asset.type}
                </p>
                <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1 mb-4 flex-1">
                  <p>Serial Number: {asset.serialNumber || asset.serial_number || '-'}</p>
                  <p>Location: {asset.location}</p>
                  <p>Price: ${asset.price}</p>
                  {asset.assignedToName && <p>Assigned: {asset.assignedToName}</p>}
                </div>
                <div className="flex gap-2 pt-4 border-t border-gray-200 dark:border-gray-700">
                  {(user?.role === 'admin' || user?.role === 'asset_manager') && (
                    <>
                      <Button
                        onClick={(e) => { e.stopPropagation(); navigate(`/assets/edit/${asset.id}`) }}
                        variant="outline"
                        size="sm"
                        className="flex-1 flex items-center justify-center space-x-1"
                      >
                        <Edit size={16} />
                        <span>{t('common.edit')}</span>
                      </Button>
                      <Button
                        onClick={(e) => handleOpenStatusModal(e, asset)}
                        variant="secondary"
                        size="sm"
                        className="flex-1 flex items-center justify-center space-x-1"
                      >
                        <RefreshCw size={16} />
                        <span>Status</span>
                      </Button>
                    </>
                  )}
                  {user?.role === 'admin' && (
                    <Button
                      onClick={(e) => { e.stopPropagation(); handleDelete(asset.id) }}
                      variant="danger"
                      size="sm"
                      className="flex-1 flex items-center justify-center space-x-1"
                    >
                      <Trash2 size={16} />
                      <span>{t('common.delete')}</span>
                    </Button>
                  )}
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-400">{t('common.noData')}</p>
          </Card>
        )}

        {/* Asset Details Modal */}
        {showAssetModal && selectedAsset && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <Card className="max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-4">
                  {selectedAsset.image && selectedAsset.image.startsWith('data:') ? (
                    <img src={selectedAsset.image} alt={selectedAsset.name} className="w-20 h-20 rounded-xl object-cover" />
                  ) : (
                    <span className="text-5xl">{selectedAsset.image || '📦'}</span>
                  )}
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{selectedAsset.name}</h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{selectedAsset.category} • {selectedAsset.type}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant={selectedAsset.status}>{selectedAsset.status}</Badge>
                  <button
                    onClick={() => setShowAssetModal(false)}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-all duration-200 active:scale-90"
                    aria-label="Close"
                  >
                    <X size={22} />
                  </button>
                </div>
              </div>

              <div className="space-y-4 mb-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Asset ID</p>
                    <p className="font-semibold text-gray-900 dark:text-gray-100">{selectedAsset.id}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Serial Number</p>
                    <p className="font-semibold text-gray-900 dark:text-gray-100">{selectedAsset.serialNumber || selectedAsset.serial_number || '-'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Price</p>
                    <p className="font-semibold text-gray-900 dark:text-gray-100">${selectedAsset.price}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Available Amount</p>
                    <p className="font-semibold text-gray-900 dark:text-gray-100">{selectedAsset.amount || 0} units</p>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Location</p>
                  <p className="font-semibold text-gray-900 dark:text-gray-100">{selectedAsset.location}</p>
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Assignments</h3>
                {loadingAssignments ? (
                  <p className="text-sm text-gray-500 dark:text-gray-400">Loading assignments...</p>
                ) : assignments.length > 0 ? (
                  assignments.map((assignment) => (
                    <div key={assignment.id} className="p-3 rounded-lg border border-gray-200 dark:border-gray-700 flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900 dark:text-gray-100">{assignment.user_name}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Qty: {assignment.quantity}</p>
                      </div>
                      <Badge variant={assignment.status}>{assignment.status}</Badge>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500 dark:text-gray-400">No assignments yet.</p>
                )}
              </div>
            </Card>
          </div>
        )}

        {/* Edit Status Modal */}
        {showStatusModal && statusAsset && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <Card className="max-w-sm w-full">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">Edit Status</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5 truncate max-w-[200px]">{statusAsset.name}</p>
                </div>
                <button
                  onClick={() => setShowStatusModal(false)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-all active:scale-90"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-2 mb-6">
                {STATUS_OPTIONS.map(opt => (
                  <button
                    key={opt.value}
                    onClick={() => setNewStatus(opt.value)}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border-2 transition-all duration-150 ${
                      newStatus === opt.value
                        ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                    }`}
                  >
                    <span className={`text-sm font-semibold px-2.5 py-1 rounded-full ${opt.color}`}>
                      {opt.label}
                    </span>
                    {newStatus === opt.value && (
                      <CheckCircle size={18} className="text-primary-600 dark:text-primary-400" />
                    )}
                  </button>
                ))}
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={handleSaveStatus}
                  disabled={savingStatus || newStatus === statusAsset.status}
                  className="flex-1"
                >
                  {savingStatus ? 'Saving...' : 'Save Status'}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowStatusModal(false)}
                  className="flex-1"
                  disabled={savingStatus}
                >
                  Cancel
                </Button>
              </div>
            </Card>
          </div>
        )}

        {/* Delete Confirm Modal */}
        {showDeleteModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <Card className="max-w-md w-full">
              <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-3">Delete asset?</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">This action cannot be undone.</p>
              <div className="flex gap-3 justify-end">
                <Button variant="outline" onClick={() => setShowDeleteModal(false)}>Cancel</Button>
                <Button variant="danger" onClick={confirmDelete}>Delete</Button>
              </div>
            </Card>
          </div>
        )}
      </div>
    </Layout>
  )
}
