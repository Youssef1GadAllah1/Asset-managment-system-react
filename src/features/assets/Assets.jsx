import { useState, useEffect, useMemo, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../../context/AuthContext'
import { Layout } from '../../components/layout/Layout'
import { Card, Button, Badge, Input } from '../../components/common'
import { getAllAssets, deleteAsset, getAssetAssignmentsByAsset } from '../../utils/api'
import { Plus, Search, Edit, Trash2 } from 'lucide-react'

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

  const closeAssetModal = useCallback(() => setShowAssetModal(false), [])
  const closeDeleteModal = useCallback(() => setShowDeleteModal(false), [])

  const filteredAssets = useMemo(() => {
    const lower = searchTerm.toLowerCase()
    return assets
      .filter(asset => {
        const matchesSearch = asset.name.toLowerCase().includes(lower) ||
          asset.category.toLowerCase().includes(lower)
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
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            {t('assets.title')}
          </h1>
          {user?.role === 'admin' && (
            <div className="flex gap-3">
              <Button
                onClick={() => navigate('/assets/assign')}
                variant="secondary"
                className="flex items-center space-x-2"
              >
                <span>Assign Asset</span>
              </Button>
              <Button
                onClick={() => navigate('/assets/add')}
                className="flex items-center space-x-2"
              >
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
                className={`flex flex-col cursor-pointer hover:shadow-lg transition-shadow ${
                  asset.amount === 0 ? 'opacity-50 grayscale' : ''
                }`}
                onClick={() => handleAssetClick(asset)}
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="text-4xl">{asset.image}</span>
                  <Badge variant={asset.status}>{asset.status}</Badge>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1">
                  {asset.name}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  {asset.category} • {asset.type}
                </p>
                <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1 mb-4 flex-1">
                  <p>Location: {asset.location}</p>
                  <p>Price: ${asset.price}</p>
                  {asset.assignedToName && (
                    <p>Assigned: {asset.assignedToName}</p>
                  )}
                </div>
                <div className="flex gap-2 pt-4 border-t border-gray-200 dark:border-gray-700">
                  {(user?.role === 'admin' || user?.role === 'asset_manager') && (
                    <Button
                      onClick={(e) => { e.stopPropagation(); navigate(`/assets/edit/${asset.id}`) }}
                      variant="outline"
                      size="sm"
                      className="flex-1 flex items-center justify-center space-x-1"
                    >
                      <Edit size={16} />
                      <span>{t('common.edit')}</span>
                    </Button>
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
                  <span className="text-5xl">{selectedAsset.image}</span>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                      {selectedAsset.name}
                    </h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {selectedAsset.category} • {selectedAsset.type}
                    </p>
                  </div>
                </div>
                <Badge variant={selectedAsset.status}>{selectedAsset.status}</Badge>
              </div>

              <div className="space-y-4 mb-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Asset ID</p>
                    <p className="font-semibold text-gray-900 dark:text-gray-100">{selectedAsset.id}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Serial Number</p>
                    <p className="font-semibold text-gray-900 dark:text-gray-100">{selectedAsset.serialNumber}</p>
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

                {selectedAsset.description && (
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Description</p>
                    <p className="text-gray-900 dark:text-gray-100">{selectedAsset.description}</p>
                  </div>
                )}

                {selectedAsset.purchaseDate && (
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Purchase Date</p>
                    <p className="font-semibold text-gray-900 dark:text-gray-100">{new Date(selectedAsset.purchaseDate).toLocaleDateString()}</p>
                  </div>
                )}
              </div>

              <div className="mb-6 pb-6 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Assignments</h3>
                {loadingAssignments ? (
                  <p className="text-gray-600 dark:text-gray-400">Loading assignments...</p>
                ) : assignments.length > 0 ? (
                  <div className="space-y-3">
                    {assignments.map((assignment) => (
                      <div key={assignment.id} className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <p className="font-semibold text-gray-900 dark:text-gray-100">{assignment.user_name}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">{assignment.role}</p>
                          </div>
                          <Badge variant={assignment.status}>{assignment.status}</Badge>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div>
                            <span className="text-gray-600 dark:text-gray-400">Quantity:</span>
                            <p className="font-semibold text-gray-900 dark:text-gray-100">{assignment.quantity} units</p>
                          </div>
                          <div>
                            <span className="text-gray-600 dark:text-gray-400">Assigned By:</span>
                            <p className="font-semibold text-gray-900 dark:text-gray-100">{assignment.assigned_by_name}</p>
                          </div>
                          <div>
                            <span className="text-gray-600 dark:text-gray-400">Assigned Date:</span>
                            <p className="font-semibold text-gray-900 dark:text-gray-100">
                              {new Date(assignment.assigned_date).toLocaleDateString()}
                            </p>
                          </div>
                          {assignment.return_date && (
                            <div>
                              <span className="text-gray-600 dark:text-gray-400">Return Date:</span>
                              <p className="font-semibold text-gray-900 dark:text-gray-100">
                                {new Date(assignment.return_date).toLocaleDateString()}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-600 dark:text-gray-400">No active assignments</p>
                )}
              </div>

              <div className="flex gap-3 pt-6 border-t border-gray-200 dark:border-gray-700">
                <Button onClick={closeAssetModal} variant="secondary" className="flex-1">
                  {t('common.close')}
                </Button>
              </div>
            </Card>
          </div>
        )}

        {/* Delete Modal */}
        {showDeleteModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <Card className="max-w-sm w-full">
              <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">Confirm Delete</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">{t('common.confirmDelete')}</p>
              <div className="flex gap-3">
                <Button onClick={closeDeleteModal} variant="secondary" className="flex-1">
                  {t('common.cancel')}
                </Button>
                <Button onClick={confirmDelete} variant="danger" className="flex-1">
                  {t('common.delete')}
                </Button>
              </div>
            </Card>
          </div>
        )}
      </div>
    </Layout>
  )
}
