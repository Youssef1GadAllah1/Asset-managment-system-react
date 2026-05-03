import { useEffect, useState, useCallback, useMemo, memo } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useTranslation } from 'react-i18next'
import { Card, Badge } from '../../components/common'
import { Layout } from '../../components/layout/Layout'
import { Reveal } from '../../components/common/Reveal'
import { useInView } from '../../hooks/useInView'
import { useCountUp } from '../../hooks/useCountUp'
import { getTasksByUser, getAllAssets, getAllEmployees, getAssetAssignmentsByUser, updateAsset, updateTask, createNotification } from '../../utils/api'
import { BarChart3, Users, Package, CheckCircle, AlertCircle } from 'lucide-react'

const StatCard = memo(({ icon: Icon, label, value, bgColor, borderColor }) => {
  const [ref, inView] = useInView()
  const count = useCountUp(typeof value === 'number' ? value : 0, 1200, inView)
  return (
    <div ref={ref}>
      <Card className={`card-hover border-l-4 ${borderColor}`}>
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{label}</p>
            <p className={`text-3xl font-bold text-gray-900 dark:text-gray-100 ${inView ? 'count-enter' : 'opacity-0'}`}>
              {typeof value === 'number' ? count : value}
            </p>
          </div>
          <div className={`p-3 rounded-xl ${bgColor} shadow-sm`}>
            <Icon size={24} className="text-white" />
          </div>
        </div>
      </Card>
    </div>
  )
})
StatCard.displayName = 'StatCard'

const TaskItem = memo(({ task, onClick }) => {
  const statusColors = {
    pending: 'bg-accent-100 text-accent-800',
    in_progress: 'bg-blue-100 text-blue-800',
    completed: 'bg-green-100 text-green-800',
  }

  const priorityColors = {
    high: 'text-red-600',
    normal: 'text-yellow-600',
    low: 'text-green-600',
  }

  return (
    <div
      className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:shadow-md transition-shadow cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50"
      onClick={onClick}
    >
      <div className="flex items-start justify-between mb-2">
        <h4 className="font-medium text-gray-900 dark:text-gray-100 flex-1">{task.title}</h4>
        <Badge variant={task.status}>{task.status}</Badge>
      </div>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{task.description}</p>
      <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
        <span>Assigned to: {task.assigned_to_name || 'Unassigned'}</span>
        <span className={`font-semibold ${priorityColors[task.priority]}`}>
          {task.priority.toUpperCase()}
        </span>
      </div>
    </div>
  )
})
TaskItem.displayName = 'TaskItem'

export const Dashboard = () => {
  const { user } = useAuth()
  const { t } = useTranslation()
  const [tasks, setTasks] = useState([])
  const [assets, setAssets] = useState([])
  const [employees, setEmployees] = useState([])
  const [userAssignedAssets, setUserAssignedAssets] = useState([])
  const [selectedAsset, setSelectedAsset] = useState(null)
  const [showAssetModal, setShowAssetModal] = useState(false)
  const [editedStatus, setEditedStatus] = useState(null)
  const [selectedTask, setSelectedTask] = useState(null)
  const [showTaskModal, setShowTaskModal] = useState(false)
  const [editedTaskStatus, setEditedTaskStatus] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user?.id) {
      initializeDashboardData()
    }
  }, [user?.id])

  const initializeDashboardData = async () => {
    try {
      setLoading(true)
      const [tasksData, assetsData, employeesData, assignedAssetsData] = await Promise.all([
        getTasksByUser(user.id),
        getAllAssets(),
        getAllEmployees(),
        getAssetAssignmentsByUser(user.id)
      ])
      setTasks(tasksData)
      setAssets(assetsData)
      setEmployees(employeesData)
      setUserAssignedAssets(assignedAssetsData)
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSaveAsset = useCallback(async () => {
    if (!editedStatus || !selectedAsset) return
    try {
      const updatedAsset = await updateAsset(selectedAsset.id, {
        status: editedStatus,
        assigned_to_id: null,
        assigned_to_name: null
      })
      setAssets(prev => prev.map(a => a.id === selectedAsset.id ? updatedAsset : a))
      setShowAssetModal(false)
      setSelectedAsset(null)
      setEditedStatus(null)
    } catch (error) {
      console.error('Failed to update asset:', error)
    }
  }, [editedStatus, selectedAsset])

  const handleOpenAssetModal = useCallback((asset) => {
    setSelectedAsset(asset)
    setEditedStatus(asset.status)
    setShowAssetModal(true)
  }, [])

  const handleOpenTaskModal = useCallback((task) => {
    setSelectedTask(task)
    setEditedTaskStatus(task.status)
    setShowTaskModal(true)
  }, [])

  const handleSaveTask = useCallback(async () => {
    if (!editedTaskStatus || !selectedTask) return
    try {
      const updatedTask = await updateTask(selectedTask.id, { status: editedTaskStatus })

      if (editedTaskStatus === 'completed' && selectedTask.assigned_from_id) {
        await createNotification({
          user_id: selectedTask.assigned_from_id,
          type: 'task_completed',
          message: `"${selectedTask.title}" has been completed by ${selectedTask.assigned_to_name}`,
          related_id: selectedTask.id
        })
      }

      if (editedTaskStatus === 'completed') {
        setTasks(prev => prev.filter(t => t.id !== selectedTask.id))
      } else {
        setTasks(prev => prev.map(t => t.id === selectedTask.id ? updatedTask : t))
      }

      setShowTaskModal(false)
      setSelectedTask(null)
      setEditedTaskStatus(null)
    } catch (error) {
      console.error('Failed to update task:', error)
    }
  }, [editedTaskStatus, selectedTask])

  const userAssets = useMemo(() =>
    user?.role === 'user'
      ? assets.filter(a => a.assignedToId === user?.id)
      : assets
  , [assets, user?.id, user?.role])

  const taskStats = useMemo(() => ({
    total: tasks.length,
    inProgress: tasks.filter(t => t.status === 'in_progress').length,
    completed: tasks.filter(t => t.status === 'completed').length,
    pending: tasks.filter(t => t.status === 'pending').length,
  }), [tasks])

  const assetStats = useMemo(() => ({
    active: assets.filter(a => a.status === 'in_use').length,
    maintenance: assets.filter(a => a.status === 'maintenance').length,
  }), [assets])

  const today = useMemo(() =>
    new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
  , [])

  return (
    <Layout>
      <div className="p-6 max-w-7xl mx-auto">
        <Reveal>
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              {t('dashboard.welcome')}, {user?.name}! 👋
            </h1>
            <p className="text-gray-600 dark:text-gray-400">{today}</p>
          </div>
        </Reveal>

        {user?.role !== 'user' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 stagger">
            <StatCard icon={Users} label={t('dashboard.totalUsers')} value={employees.length} bgColor="bg-primary-600" borderColor="border-primary-600" />
            <StatCard icon={Package} label={t('dashboard.totalAssets')} value={assets.length} bgColor="bg-accent-500" borderColor="border-accent-500" />
            <StatCard icon={CheckCircle} label="Active Assets" value={assetStats.active} bgColor="bg-green-600" borderColor="border-green-600" />
            <StatCard icon={AlertCircle} label="Maintenance" value={assetStats.maintenance} bgColor="bg-yellow-600" borderColor="border-yellow-600" />
          </div>
        )}

        {userAssignedAssets.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">Your Assets</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {userAssignedAssets.map(assignment => (
                <Card
                  key={assignment.id}
                  className="hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => { setSelectedAsset(assignment); setShowAssetModal(true) }}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <span className="text-3xl">{assignment.image}</span>
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-gray-100">{assignment.asset_name}</h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Qty: {assignment.quantity}</p>
                      </div>
                    </div>
                    <Badge variant={assignment.status}>{assignment.status}</Badge>
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                    <p className="text-xs"><strong>Assigned:</strong> {new Date(assignment.assigned_date).toLocaleDateString()}</p>
                    {assignment.return_date && (
                      <p className="text-xs"><strong>Returned:</strong> {new Date(assignment.return_date).toLocaleDateString()}</p>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {user?.role === 'user' && userAssets.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">My Assets</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {userAssets.map(asset => (
                <Card
                  key={asset.id}
                  className="cursor-pointer hover:shadow-lg transition-shadow"
                  onClick={() => handleOpenAssetModal(asset)}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <span className="text-3xl">{asset.image}</span>
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-gray-100">{asset.name}</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{asset.category}</p>
                      </div>
                    </div>
                    <Badge variant={asset.status}>{asset.status}</Badge>
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                    <p>Location: {asset.location}</p>
                    <p>Price: ${asset.price}</p>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">{t('dashboard.tasks')}</h2>
            {tasks.length > 0 ? (
              <div className="space-y-4">
                {tasks.slice(0, 5).map(task => (
                  <TaskItem key={task.id} task={task} onClick={() => handleOpenTaskModal(task)} />
                ))}
              </div>
            ) : (
              <Card>
                <p className="text-center text-gray-500 dark:text-gray-400 py-8">No tasks assigned</p>
              </Card>
            )}
          </div>

          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">Task Summary</h3>
            <div className="space-y-3">
              {[
                { label: 'Total Tasks', value: taskStats.total, color: 'text-gray-900 dark:text-gray-100' },
                { label: 'In Progress', value: taskStats.inProgress, color: 'text-blue-600' },
                { label: 'Completed', value: taskStats.completed, color: 'text-green-600' },
                { label: 'Pending', value: taskStats.pending, color: 'text-accent-500' },
              ].map(({ label, value, color }) => (
                <Card key={label}>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-400">{label}</span>
                    <span className={`text-2xl font-bold ${color}`}>{value}</span>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Asset Details Modal */}
      {showAssetModal && selectedAsset && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <span className="text-5xl">{selectedAsset.image}</span>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    {selectedAsset.name || selectedAsset.asset_name}
                  </h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {selectedAsset.category} {selectedAsset.type ? `• ${selectedAsset.type}` : ''}
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4 mb-6">
              {selectedAsset.quantity && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">Assignment Details</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Quantity Assigned</p>
                      <p className="font-semibold text-gray-900 dark:text-gray-100">{selectedAsset.quantity}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Assignment Status</p>
                      <Badge variant={selectedAsset.status}>{selectedAsset.status}</Badge>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Assigned Date</p>
                      <p className="font-semibold text-gray-900 dark:text-gray-100">
                        {new Date(selectedAsset.assigned_date).toLocaleDateString()}
                      </p>
                    </div>
                    {selectedAsset.return_date && (
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Return Date</p>
                        <p className="font-semibold text-gray-900 dark:text-gray-100">
                          {new Date(selectedAsset.return_date).toLocaleDateString()}
                        </p>
                      </div>
                    )}
                    {selectedAsset.assigned_by_name && (
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Assigned By</p>
                        <p className="font-semibold text-gray-900 dark:text-gray-100">{selectedAsset.assigned_by_name}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">Asset Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Asset ID</p>
                    <p className="font-semibold text-gray-900 dark:text-gray-100">{selectedAsset.id}</p>
                  </div>
                  {selectedAsset.serialNumber && (
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Serial Number</p>
                      <p className="font-semibold text-gray-900 dark:text-gray-100">{selectedAsset.serialNumber}</p>
                    </div>
                  )}
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Location</p>
                    <p className="font-semibold text-gray-900 dark:text-gray-100">{selectedAsset.location}</p>
                  </div>
                </div>
              </div>

              {!selectedAsset.quantity && (
                <>
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
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Status</p>
                    <select
                      value={editedStatus}
                      onChange={(e) => setEditedStatus(e.target.value)}
                      className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:text-gray-100 font-semibold"
                    >
                      <option value="in_use">In Use</option>
                      <option value="retired">Retired</option>
                    </select>
                  </div>
                </>
              )}

              <div className="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700 rounded-lg p-3 mt-4">
                <p className="text-sm text-blue-800 dark:text-blue-100">
                  <strong>Note:</strong> {selectedAsset.quantity
                    ? 'View your assignment details and return date above.'
                    : 'When you save changes, this asset status will be updated.'}
                </p>
              </div>
            </div>

            <div className="flex gap-3 pt-6 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={() => { setShowAssetModal(false); setSelectedAsset(null); setEditedStatus(null) }}
                className="flex-1 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveAsset}
                className="flex-1 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors font-medium"
              >
                Save Changes
              </button>
            </div>
          </Card>
        </div>
      )}

      {/* Task Details Modal */}
      {showTaskModal && selectedTask && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{selectedTask.title}</h2>
                <Badge variant={selectedTask.status}>{selectedTask.status}</Badge>
              </div>
              <p className="text-gray-600 dark:text-gray-400">{selectedTask.description}</p>
            </div>

            <div className="space-y-4 mb-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Task ID</p>
                  <p className="font-semibold text-gray-900 dark:text-gray-100">{selectedTask.id}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Priority</p>
                  <p className={`font-semibold ${
                    selectedTask.priority === 'high' ? 'text-red-600' :
                    selectedTask.priority === 'normal' ? 'text-yellow-600' : 'text-green-600'
                  }`}>
                    {selectedTask.priority.toUpperCase()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Assigned To</p>
                  <p className="font-semibold text-gray-900 dark:text-gray-100">{selectedTask.assigned_to_name || 'Unassigned'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Assigned From</p>
                  <p className="font-semibold text-gray-900 dark:text-gray-100">{selectedTask.assigned_from_name || 'N/A'}</p>
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Update Status</p>
                <select
                  value={editedTaskStatus}
                  onChange={(e) => setEditedTaskStatus(e.target.value)}
                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:border-primary-500 dark:bg-gray-700 dark:text-gray-100 font-semibold"
                >
                  <option value="pending">Pending</option>
                  <option value="in_progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
            </div>

            <div className="flex gap-3 pt-6 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={() => { setShowTaskModal(false); setSelectedTask(null); setEditedTaskStatus(null) }}
                className="flex-1 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveTask}
                className="flex-1 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors font-medium"
              >
                Save Changes
              </button>
            </div>
          </Card>
        </div>
      )}
    </Layout>
  )
}
