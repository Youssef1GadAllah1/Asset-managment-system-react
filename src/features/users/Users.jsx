import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Plus, Edit2, Trash2, Lock } from 'lucide-react'
import { Layout } from '../../components/layout/Layout'
import { Card, Button } from '../../components/common'
import { getAllUsers, deleteUser } from '../../utils/api'

export const Users = () => {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [deleteConfirm, setDeleteConfirm] = useState(null)

  useEffect(() => {
    loadUsers()
  }, [])

  const loadUsers = async () => {
    try {
      setLoading(true)
      const data = await getAllUsers()
      setUsers(data)
      setError(null)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (userId) => {
    try {
      await deleteUser(userId)
      setUsers(users.filter(u => u.id !== userId))
      setDeleteConfirm(null)
    } catch (err) {
      setError(err.message)
    }
  }

  const getRoleLabel = (role) => {
    const roleMap = {
      admin: 'Administrator',
      asset_manager: 'Asset Manager',
      user: 'User'
    }
    return roleMap[role] || role
  }

  const getRoleColor = (role) => {
    const colorMap = {
      admin: 'bg-red-100 text-red-800',
      asset_manager: 'bg-blue-100 text-blue-800',
      user: 'bg-gray-100 text-gray-800'
    }
    return colorMap[role] || 'bg-gray-100 text-gray-800'
  }

  return (
    <Layout>
      <div className="p-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                User Management
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Create and manage system users and their access levels
              </p>
            </div>
            <Button
              onClick={() => navigate('/users/add')}
              className="flex items-center gap-2"
            >
              <Plus size={20} />
              Add User
            </Button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400">
              {error}
            </div>
          )}

          {/* Loading State */}
          {loading ? (
            <Card>
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
                <p className="mt-4 text-gray-600 dark:text-gray-400">Loading users...</p>
              </div>
            </Card>
          ) : users.length === 0 ? (
            <Card>
              <div className="text-center py-12">
                <p className="text-gray-600 dark:text-gray-400 mb-4">No users created yet</p>
                <Button onClick={() => navigate('/users/add')}>
                  Create First User
                </Button>
              </div>
            </Card>
          ) : (
            <div className="grid gap-4">
              {users.map((user) => (
                <Card key={user.id} className="hover:shadow-lg transition-shadow">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-4 mb-2">
                        <div className="text-3xl">{user.avatar || '👤'}</div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                            {user.name}
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            @{user.username}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-4 text-sm text-gray-600 dark:text-gray-400 ml-16">
                        <p>{user.email}</p>
                        {user.department && <p>Department: {user.department}</p>}
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getRoleColor(user.role)}`}>
                        {getRoleLabel(user.role)}
                      </span>
                      <button
                        onClick={() => navigate(`/users/edit/${user.id}`)}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition"
                        title="Edit user"
                      >
                        <Edit2 size={18} className="text-gray-600 dark:text-gray-400" />
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(user.id)}
                        className="p-2 hover:bg-red-100 dark:hover:bg-red-900/20 rounded transition"
                        title="Delete user"
                      >
                        <Trash2 size={18} className="text-red-600 dark:text-red-400" />
                      </button>
                    </div>
                  </div>

                  {/* Delete Confirmation */}
                  {deleteConfirm === user.id && (
                    <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 flex gap-2 justify-end">
                      <Button
                        variant="secondary"
                        onClick={() => setDeleteConfirm(null)}
                      >
                        Cancel
                      </Button>
                      <Button
                        variant="danger"
                        onClick={() => handleDelete(user.id)}
                      >
                        Delete Permanently
                      </Button>
                    </div>
                  )}
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  )
}
