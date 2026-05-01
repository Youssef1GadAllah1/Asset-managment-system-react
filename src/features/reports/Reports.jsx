import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useTranslation } from 'react-i18next'
import { Layout } from '../../components/layout/Layout'
import { Card, Button, Badge } from '../../components/common'
import { getAllReports, deleteReport, updateReport, getAllAssets, getAllEmployees } from '../../utils/api'
import { Plus, Trash2, Edit2, Calendar, X } from 'lucide-react'

const ReportCard = ({ report, canEdit, canDelete, onEdit, onDelete }) => {
  const isCompleted = report.status === 'completed'
  const completedClass = isCompleted ? 'opacity-50' : ''
  const completedBg = isCompleted ? 'bg-gray-100 dark:bg-gray-750' : ''
  const titleClass = isCompleted ? 'text-gray-600 dark:text-gray-500 line-through' : 'text-gray-900 dark:text-gray-100'
  const textClass = isCompleted ? 'text-gray-500 dark:text-gray-600' : 'text-gray-600 dark:text-gray-400'

  return (
    <Card className={`flex items-start justify-between p-6 transition-opacity ${completedClass} ${completedBg}`}>
      <div className="flex-1">
        <div className="flex items-center gap-3 mb-2">
          <h3 className={`text-lg font-semibold ${titleClass}`}>
            {report.title}
          </h3>
          <Badge variant={report.status}>{report.status}</Badge>
        </div>
        <p className={`mb-2 ${textClass}`}>{report.description}</p>
        <div className={`flex flex-wrap gap-4 text-sm ${textClass}`}>
          <span>Created by: {report.generated_by_name || 'N/A'}</span>
          {report.directed_to_name && <span>Directed to: {report.directed_to_name}</span>}
          {report.assetName && <span>Asset: {report.assetName}</span>}
          <div className="flex items-center gap-1">
            <Calendar size={14} />
            {new Date(report.date_generated || report.created_at).toLocaleDateString()}
          </div>
        </div>
      </div>
      <div className="flex gap-2">
        {canEdit && (
          <button
            onClick={() => onEdit(report)}
            className={`p-2 ${isCompleted ? 'text-gray-400 cursor-not-allowed' : 'text-blue-600 hover:text-blue-700'}`}
            disabled={isCompleted}
          >
            <Edit2 size={18} />
          </button>
        )}
        {canDelete && (
          <button
            onClick={() => onDelete(report.id)}
            className={`p-2 ${isCompleted ? 'text-gray-400 cursor-not-allowed' : 'text-red-600 hover:text-red-700'}`}
            disabled={isCompleted}
          >
            <Trash2 size={18} />
          </button>
        )}
      </div>
    </Card>
  )
}

export const Reports = () => {
  const navigate = useNavigate()
  const { user, loading: authLoading } = useAuth()
  const { t } = useTranslation()
  const [reports, setReports] = useState([])
  const [showEditModal, setShowEditModal] = useState(false)
  const [showStatusOnlyModal, setShowStatusOnlyModal] = useState(false)
  const [selectedReport, setSelectedReport] = useState(null)
  const [editFormData, setEditFormData] = useState({})
  const [assets, setAssets] = useState([])
  const [employees, setEmployees] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const canEdit = (report) => {
    if (user?.role === 'admin') return true
    if (report.generated_by_id === user?.id) return 'full'
    if (report.directed_to_id === user?.id) return 'statusOnly'
    return false
  }

  const canDelete = (report) => {
    return report.generated_by_id === user?.id || user?.role === 'admin'
  }

  const sortReports = (reportsToSort) => {
    return [...reportsToSort].sort((a, b) => {
      if (a.status === 'completed' && b.status !== 'completed') return 1
      if (a.status !== 'completed' && b.status === 'completed') return -1
      return new Date(b.created_at) - new Date(a.created_at)
    })
  }

  const getFilteredReports = () => {
    if (user?.role === 'admin') {
      return {
        assigned: reports.filter(r => r.directed_to_id === user?.id),
        created: reports.filter(r => r.generated_by_id === user?.id),
        all: reports.filter(r => r.generated_by_id !== user?.id && r.directed_to_id !== user?.id)
      }
    } else {
      return {
        assigned: reports.filter(r => r.directed_to_id === user?.id),
        created: reports.filter(r => r.generated_by_id === user?.id)
      }
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        setError(null)
        const [reportsData, assetsData, employeesData] = await Promise.all([
          getAllReports(),
          getAllAssets(),
          getAllEmployees()
        ])
        setAssets(assetsData || [])
        setEmployees(employeesData || [])
        setReports(reportsData || [])
      } catch (error) {
        console.error('Error fetching data:', error)
        setError(error.message || 'Failed to fetch reports')
      } finally {
        setLoading(false)
      }
    }
    
    if (user) {
      fetchData()
    }
  }, [user])

  const handleDelete = async (id) => {
    try {
      await deleteReport(id)
      setReports(reports.filter(r => r.id !== id))
    } catch (error) {
      console.error('Error deleting report:', error)
    }
  }

  const handleEdit = (report) => {
    const editPermission = canEdit(report)
    setSelectedReport(report)
    setEditFormData(report)
    
    if (editPermission === 'statusOnly') {
      // Only allow status edit for assigned reports
      setShowStatusOnlyModal(true)
    } else if (editPermission) {
      // Full edit for creators
      setShowEditModal(true)
    }
  }

  const handleStatusOnlySave = async () => {
    try {
      const updatedReport = {
        status: editFormData.status
      }
      await updateReport(selectedReport.id, updatedReport)
      setReports(reports.map(r => r.id === selectedReport.id ? { ...r, status: editFormData.status } : r))
      setShowStatusOnlyModal(false)
      setSelectedReport(null)
    } catch (error) {
      console.error('Error updating report status:', error)
    }
  }

  const handleSaveEdit = async () => {
    try {
      const directedToId = editFormData.directed_to_id ? parseInt(editFormData.directed_to_id) : null
      const directedEmployee = directedToId ? employees.find(emp => emp.id === directedToId) : null
      
      const updatedReport = {
        ...editFormData,
        asset_id: editFormData.asset_id ? parseInt(editFormData.asset_id) : null,
        directed_to_id: directedToId,
        directed_to_name: directedEmployee?.name || null,
        assigned_to_id: editFormData.assigned_to_id ? parseInt(editFormData.assigned_to_id) : null,
      }
      await updateReport(selectedReport.id, updatedReport)
      
      // Update local state with new data
      setReports(reports.map(r => r.id === selectedReport.id ? updatedReport : r))
      setShowEditModal(false)
      setSelectedReport(null)
    } catch (error) {
      console.error('Error updating report:', error)
    }
  }

  const handleEditChange = (e) => {
    const { name, value } = e.target
    setEditFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const getStatusColor = (status) => {
    switch(status) {
      case 'pending': return 'bg-accent-100 text-accent-800'
      case 'in_progress': return 'bg-blue-100 text-blue-800'
      case 'completed': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  // Show loading or error states
  if (authLoading || loading) {
    return <Layout><div className="p-6">Loading...</div></Layout>
  }
  if (!user) {
    return <Layout><div className="p-6 text-lg text-red-600">Please log in first</div></Layout>
  }
  if (error) {
    return <Layout><div className="p-6 text-red-600">{error}</div></Layout>
  }

  return (
    <Layout>
      <div className="p-6 max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            {t('reports.title')}
          </h1>
          <Button
            onClick={() => navigate('/reports/add')}
            className="flex items-center space-x-2"
          >
            <Plus size={20} />
            <span>{t('reports.addReport')}</span>
          </Button>
        </div>

        {reports.length > 0 ? (
          <div className="space-y-8">
            {getFilteredReports().assigned && getFilteredReports().assigned.length > 0 && (
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                  Assigned To Me
                </h2>
                <div className="space-y-4">
                  {sortReports(getFilteredReports().assigned).map(report => (
                    <ReportCard
                      key={report.id}
                      report={report}
                      canEdit={canEdit(report)}
                      canDelete={canDelete(report)}
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                    />
                  ))}
                </div>
              </div>
            )}

            {getFilteredReports().created && getFilteredReports().created.length > 0 && (
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                  Your Reports
                </h2>
                <div className="space-y-4">
                  {sortReports(getFilteredReports().created).map(report => (
                    <ReportCard
                      key={report.id}
                      report={report}
                      canEdit={canEdit(report)}
                      canDelete={canDelete(report)}
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                    />
                  ))}
                </div>
              </div>
            )}

            {user?.role === 'admin' && getFilteredReports().all && getFilteredReports().all.length > 0 && (
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                  All Other Reports
                </h2>
                <div className="space-y-4">
                  {sortReports(getFilteredReports().all).map(report => (
                    <ReportCard
                      key={report.id}
                      report={report}
                      canEdit={canEdit(report)}
                      canDelete={canDelete(report)}
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <Card className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-400">{t('common.noData')}</p>
          </Card>
        )}

        {/* Status Only Edit Modal */}
        {showStatusOnlyModal && selectedReport && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-md">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Update Status</h2>
                <button
                  onClick={() => {
                    setShowStatusOnlyModal(false)
                    setSelectedReport(null)
                  }}
                  className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Report: {selectedReport.title}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Status
                  </label>
                  <select
                    value={editFormData.status || 'pending'}
                    onChange={(e) => setEditFormData({...editFormData, status: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:border-primary-500 dark:bg-gray-700 dark:text-gray-100"
                  >
                    <option value="pending">Pending</option>
                    <option value="in_progress">In Progress</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button
                    onClick={handleStatusOnlySave}
                    className="flex-1"
                  >
                    Update Status
                  </Button>
                  <Button
                    onClick={() => {
                      setShowStatusOnlyModal(false)
                      setSelectedReport(null)
                    }}
                    variant="secondary"
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Edit Modal */}
        {showEditModal && selectedReport && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-md">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Edit Report</h2>
                <button
                  onClick={() => setShowEditModal(false)}
                  className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
                >
                  <X size={24} />
                </button>
              </div>

              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Title
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={editFormData.title || ''}
                    onChange={handleEditChange}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:border-primary-500 dark:bg-gray-700 dark:text-gray-100"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={editFormData.description || ''}
                    onChange={handleEditChange}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:border-primary-500 dark:bg-gray-700 dark:text-gray-100 h-20"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Asset
                  </label>
                  <select
                    name="asset_id"
                    value={editFormData.asset_id || ''}
                    onChange={handleEditChange}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:border-primary-500 dark:bg-gray-700 dark:text-gray-100"
                  >
                    <option value="">Select an asset</option>
                    {assets.map(asset => (
                      <option key={asset.id} value={asset.id}>{asset.name}</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Created By
                    </label>
                    <div className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700/50 text-gray-900 dark:text-gray-100 text-sm">
                      {editFormData.generated_by_name || 'N/A'}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Directed To
                    </label>
                    <select
                      name="directed_to_id"
                      value={editFormData.directed_to_id || ''}
                      onChange={handleEditChange}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:border-primary-500 dark:bg-gray-700 dark:text-gray-100"
                    >
                      <option value="">Select employee</option>
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
                    name="status"
                    value={editFormData.status || 'pending'}
                    onChange={handleEditChange}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:border-primary-500 dark:bg-gray-700 dark:text-gray-100"
                  >
                    <option value="pending">Pending</option>
                    <option value="in_progress">In Progress</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button
                    onClick={handleSaveEdit}
                    className="flex-1"
                  >
                    Save Changes
                  </Button>
                  <Button
                    variant="secondary"
                    className="flex-1"
                    onClick={() => setShowEditModal(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </Card>
          </div>
        )}
      </div>
    </Layout>
  )
}
