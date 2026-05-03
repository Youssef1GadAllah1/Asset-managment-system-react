import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useTranslation } from 'react-i18next'
import { Logo } from '../common/Logo'
import {
  Home,
  Package,
  FileText,
  Users,
  MessageSquare,
  Bell,
  User,
  LogOut,
  X,
  CheckSquare,
} from 'lucide-react'

export const Sidebar = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const { t } = useTranslation()

  const isActive = (path) => location.pathname.startsWith(path)

  const getMenuItems = () => {
    const baseItems = [
      { icon: Home, label: t('sidebar.home'), path: '/dashboard' },
      { icon: FileText, label: t('sidebar.assetsReport'), path: '/reports' },
      { icon: MessageSquare, label: t('sidebar.chat'), path: '/chat' },
      { icon: Bell, label: t('sidebar.notifications'), path: '/notifications' },
      { icon: User, label: t('sidebar.profile'), path: '/profile' },
    ]

    const managerItems = [
      { icon: Home, label: t('sidebar.home'), path: '/dashboard' },
      { icon: Package, label: t('sidebar.assets'), path: '/assets' },
      { icon: Users, label: t('sidebar.employees'), path: '/employees' },
      { icon: FileText, label: t('sidebar.assetsReport'), path: '/reports' },
      { icon: CheckSquare, label: 'Tasks', path: '/tasks' },
      { icon: MessageSquare, label: t('sidebar.chat'), path: '/chat' },
      { icon: Bell, label: t('sidebar.notifications'), path: '/notifications' },
      { icon: User, label: t('sidebar.profile'), path: '/profile' },
    ]

    const adminItems = [
      { icon: Home, label: t('sidebar.home'), path: '/dashboard' },
      { icon: Package, label: t('sidebar.assets'), path: '/assets' },
      { icon: Users, label: 'Users', path: '/users' },
      { icon: Users, label: t('sidebar.employees'), path: '/employees' },
      { icon: FileText, label: t('sidebar.assetsReport'), path: '/reports' },
      { icon: CheckSquare, label: 'Tasks', path: '/tasks' },
      { icon: MessageSquare, label: t('sidebar.chat'), path: '/chat' },
      { icon: Bell, label: t('sidebar.notifications'), path: '/notifications' },
      { icon: User, label: t('sidebar.profile'), path: '/profile' },
    ]

    switch (user?.role) {
      case 'user': return baseItems
      case 'asset_manager': return managerItems
      case 'admin': return adminItems
      default: return baseItems
    }
  }

  const menuItems = getMenuItems()

  const handleLogout = () => {
    logout()
    navigate('/login')
    onClose?.()
  }

  const handleNavigate = (path) => {
    navigate(path)
    onClose?.()
  }

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 z-30 lg:hidden backdrop-blur-sm" onClick={onClose} />
      )}

      <div className={`fixed lg:static inset-y-0 left-0 z-40 w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="flex flex-col h-screen">
          <div className="flex items-center justify-between p-6">
            <Logo size="sm" to="/dashboard" />
            <button onClick={onClose} className="lg:hidden p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl">
              <X size={20} />
            </button>
          </div>

          <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
            {menuItems.map((item) => {
              const Icon = item.icon
              const active = isActive(item.path)
              return (
                <button
                  key={item.path}
                  onClick={() => handleNavigate(item.path)}
                  className={`w-full flex items-center space-x-3 ltr:space-x-3 rtl:space-x-reverse px-4 py-3 rounded-xl transition-all duration-200 ${active ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 border border-primary-200 dark:border-primary-800 shadow-sm' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'}`}
                >
                  <Icon size={20} />
                  <span className="font-medium">{item.label}</span>
                </button>
              )
            })}
          </nav>

          <div className="p-4 border-t border-gray-200 dark:border-gray-700 space-y-2">
            <button onClick={handleLogout} className="w-full flex items-center space-x-3 ltr:space-x-3 rtl:space-x-reverse px-4 py-3 rounded-xl text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
              <LogOut size={20} />
              <span className="font-medium">{t('common.logout')}</span>
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
