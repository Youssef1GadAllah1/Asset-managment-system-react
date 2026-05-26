import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useTranslation } from 'react-i18next'
import { Logo } from '../common/Logo'
import {
  LayoutDashboard,
  Package,
  FileBarChart2,
  Users,
  UserCog,
  MessageSquare,
  Bell,
  UserCircle,
  LogOut,
  X,
  CheckSquare,
  ChevronRight,
} from 'lucide-react'

const ROLE_LABEL = {
  admin: 'Administrator',
  asset_manager: 'Asset Manager',
  user: 'Staff',
}

const ROLE_COLOR = {
  admin: 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300',
  asset_manager: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
  user: 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300',
}

export const Sidebar = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const { t } = useTranslation()

  const isActive = (path) => location.pathname.startsWith(path)

  const getMenuGroups = () => {
    const mainGroup = {
      label: 'Main',
      items: [
        { icon: LayoutDashboard, label: t('sidebar.home'), path: '/dashboard' },
      ],
    }

    const manageGroup = {
      label: 'Manage',
      items: [],
    }

    if (user?.role === 'admin' || user?.role === 'asset_manager') {
      manageGroup.items.push({ icon: Package, label: t('sidebar.assets'), path: '/assets' })
      manageGroup.items.push({ icon: Users, label: t('sidebar.employees'), path: '/employees' })
      manageGroup.items.push({ icon: CheckSquare, label: t('sidebar.tasks') || 'Tasks', path: '/tasks' })
    }
    if (user?.role === 'admin') {
      manageGroup.items.push({ icon: UserCog, label: t('sidebar.users') || 'Users', path: '/users' })
    }
    manageGroup.items.push({ icon: FileBarChart2, label: t('sidebar.assetsReport'), path: '/reports' })

    const communicationGroup = {
      label: 'Communication',
      items: [
        { icon: MessageSquare, label: t('sidebar.chat'), path: '/chat' },
        { icon: Bell, label: t('sidebar.notifications'), path: '/notifications' },
      ],
    }

    const accountGroup = {
      label: 'Account',
      items: [
        { icon: UserCircle, label: t('sidebar.profile'), path: '/profile' },
      ],
    }

    return [mainGroup, manageGroup, communicationGroup, accountGroup].filter(g => g.items.length > 0)
  }

  const groups = getMenuGroups()

  const handleLogout = () => {
    logout()
    navigate('/login')
    onClose?.()
  }

  const handleNavigate = (path) => {
    navigate(path)
    onClose?.()
  }

  const initials = user?.name
    ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : '??'

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-30 lg:hidden backdrop-blur-sm"
          onClick={onClose}
        />
      )}

      <aside className={`fixed inset-y-0 left-0 z-40 w-64 flex flex-col bg-white dark:bg-gray-900 border-r border-gray-200/80 dark:border-gray-700/80 shadow-xl transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>

        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-gray-800">
          <Logo size="sm" to="/dashboard" />
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-150 active:scale-90"
            aria-label="Close sidebar"
          >
            <X size={18} />
          </button>
        </div>

        <div className="mx-4 mt-4 mb-2 p-3 rounded-2xl bg-gradient-to-br from-primary-50 to-primary-100/60 dark:from-primary-900/30 dark:to-primary-800/20 border border-primary-100 dark:border-primary-800/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary-600 flex items-center justify-center text-white font-bold text-sm shrink-0 shadow-md">
              {initials}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-gray-900 dark:text-white truncate leading-tight">{user?.name}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user?.email}</p>
            </div>
          </div>
          <div className="mt-2.5">
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${ROLE_COLOR[user?.role] || ROLE_COLOR.user}`}>
              {ROLE_LABEL[user?.role] || 'Staff'}
            </span>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-2 space-y-5">
          {groups.map((group) => (
            <div key={group.label}>
              <p className="px-3 mb-1 text-[10px] font-bold uppercase tracking-widest text-gray-400 dark:text-gray-600 select-none">
                {group.label}
              </p>
              <div className="space-y-0.5">
                {group.items.map((item) => {
                  const Icon = item.icon
                  const active = isActive(item.path)
                  return (
                    <button
                      key={item.path}
                      onClick={() => handleNavigate(item.path)}
                      className={`w-full group flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                        active
                          ? 'bg-primary-600 text-white shadow-md shadow-primary-600/25'
                          : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-100'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className={`p-1 rounded-lg transition-colors duration-200 ${active ? 'bg-white/20' : 'bg-gray-100 dark:bg-gray-800 group-hover:bg-gray-200 dark:group-hover:bg-gray-700'}`}>
                          <Icon size={16} />
                        </span>
                        <span>{item.label}</span>
                      </div>
                      {active && <ChevronRight size={14} className="opacity-70" />}
                    </button>
                  )
                })}
              </div>
            </div>
          ))}
        </nav>

        <div className="px-3 py-3 border-t border-gray-100 dark:border-gray-800">
          <button
            onClick={handleLogout}
            className="w-full group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-300 transition-all duration-200"
          >
            <span className="p-1 rounded-lg bg-red-50 dark:bg-red-900/30 group-hover:bg-red-100 dark:group-hover:bg-red-900/50 transition-colors duration-200">
              <LogOut size={16} />
            </span>
            <span>{t('common.logout')}</span>
          </button>
        </div>
      </aside>
    </>
  )
}
