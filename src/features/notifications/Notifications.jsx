import { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useTranslation } from 'react-i18next'
import { Layout } from '../../components/layout/Layout'
import { Card, Badge, Button } from '../../components/common'
import { getNotifications, markNotificationAsRead } from '../../utils/api'
import { Trash2, Bell } from 'lucide-react'

export const Notifications = () => {
  const { user } = useAuth()
  const { t } = useTranslation()
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user?.id) return;

    const fetchNotifications = async () => {
      try {
        const data = await getNotifications(user?.id)
        setNotifications(data || [])
      } catch (error) {
        console.error('Error fetching notifications:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchNotifications()
  }, [user?.id])

  const handleDelete = async (id) => {
    try {
      // Update local state
      setNotifications(notifications.filter(n => n.id !== id))
      // Note: Backend deleteNotification would be called if available
    } catch (error) {
      console.error('Error deleting notification:', error)
    }
  }

  const handleMarkAsRead = async (id) => {
    try {
      await markNotificationAsRead(id)
      const updated = notifications.map(n =>
        n.id === id ? { ...n, is_read: true } : n
      )
      setNotifications(updated)
    } catch (error) {
      console.error('Error marking notification as read:', error)
    }
  }

  const typeColors = {
    info: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100',
    success: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100',
    warning: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100',
    error: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100',
  }

  if (loading) return <Layout><div className="p-6">Loading...</div></Layout>

  return (
    <Layout>
      <div className="p-6 max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-8">
          {t('common.notifications')}
        </h1>

        {notifications.length > 0 ? (
          <div className="space-y-4">
            {notifications.map(notification => (
              <Card
                key={notification.id}
                className={`flex items-start justify-between ${
                  !notification.is_read ? 'bg-primary-50 dark:bg-primary-900/20 border-l-4 border-primary-500' : ''
                }`}
              >
                <div className="flex items-start space-x-4 flex-1">
                  <div className="mt-1">
                    <Bell size={20} className="text-primary-600" />
                  </div>
                  <div className="flex-1">
                    <p className={`${!notification.is_read ? 'font-semibold' : ''} text-gray-900 dark:text-gray-100`}>
                      {notification.message}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      {new Date(notification.created_at).toLocaleDateString()} {new Date(notification.created_at).toLocaleTimeString()}
                    </p>
                    <div className="mt-2">
                      <Badge variant={notification.type}>{notification.type}</Badge>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 ltr:ml-4 rtl:mr-4">
                  {!notification.is_read && (
                    <Button
                      onClick={() => handleMarkAsRead(notification.id)}
                      variant="ghost"
                      size="sm"
                    >
                      Mark Read
                    </Button>
                  )}
                  <button
                    onClick={() => handleDelete(notification.id)}
                    className="text-red-600 hover:text-red-700 p-2"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="text-center py-12">
            <Bell size={48} className="mx-auto mb-4 text-gray-400" />
            <p className="text-gray-600 dark:text-gray-400">No notifications</p>
          </Card>
        )}
      </div>
    </Layout>
  )
}
