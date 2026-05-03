import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Layout } from '../../components/layout/Layout'
import { Card, Button, Input } from '../../components/common'
import { getAllEmployees, deleteEmployee } from '../../utils/api'
import { useAuth } from '../../context/AuthContext'
import { Plus, Trash2, Edit } from 'lucide-react'

export const Employees = () => {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { t } = useTranslation()
  const [employees, setEmployees] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchEmployees()
  }, [user])

  const fetchEmployees = async () => {
    try {
      setLoading(true)
      const data = await getAllEmployees()
      // Filter out the logged-in user from the list
      const filtered = data.filter(e => e.id !== user?.id)
      
      // Non-admins can only see non-admin employees
      if (user?.role !== 'admin') {
        setEmployees(filtered.filter(e => e.role !== 'admin'))
      } else {
        setEmployees(filtered)
      }
    } catch (error) {
      console.error('Failed to fetch employees:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    try {
      await deleteEmployee(id)
      setEmployees(employees.filter(e => e.id !== id))
    } catch (error) {
      console.error('Failed to delete employee:', error)
    }
  }

  const filteredEmployees = employees.filter(emp =>
    emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <Layout>
      <div className="p-6 max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            {t('employees.title')}
          </h1>
          {user?.role === 'admin' && (
            <Button
              onClick={() => navigate('/employees/add')}
              className="flex items-center space-x-2"
            >
              <Plus size={20} />
              <span>Add Employee</span>
            </Button>
          )}
        </div>

        <Card className="mb-6">
          <div className="relative">
            <input
              type="text"
              placeholder={t('common.search')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:border-primary-500 dark:bg-gray-700 dark:text-gray-100"
            />
          </div>
        </Card>

        {filteredEmployees.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEmployees.map(employee => (
              <Card key={employee.id}>
                <div className="flex items-start justify-between mb-4">
                  <span className="text-4xl">{employee.avatar}</span>
                  <span className="text-xs bg-primary-100 text-primary-800 px-2 py-1 rounded-full dark:bg-primary-900 dark:text-primary-100">
                    {employee.role === 'asset_manager' ? 'Manager' : 'User'}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1">
                  {employee.name}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  {employee.department}
                </p>
                <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1 mb-4">
                  <p>Email: {employee.email}</p>
                  <p>Username: {employee.username}</p>
                </div>
                <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex gap-2">
                    <Button
                      onClick={() => navigate(`/employees/edit/${employee.id}`)}
                      variant="outline"
                      size="sm"
                      className="flex-1 px-3 py-2 border-2 border-primary-600 text-primary-600 rounded-lg flex items-center space-x-2 justify-center"
                    >
                      <Edit size={16} />
                      <span className="text-sm font-medium">Edit</span>
                    </Button>
                    {user?.role === 'admin' && (
                      <button
                        onClick={() => handleDelete(employee.id)}
                        className="flex-1 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg py-2 flex items-center justify-center gap-2"
                      >
                        <Trash2 size={16} />
                        <span className="text-sm font-medium">Delete</span>
                      </button>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-400">{t('common.noData')}</p>
          </Card>
        )}
      </div>
    </Layout>
  )
}
