import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useTheme } from '../../context/ThemeContext'
import { useTranslation } from 'react-i18next'
import { getUnreadNotificationCount } from '../../utils/api'
import {
  Menu,
  Search,
  Bell,
  LogOut,
  Sun,
  Moon,
  Globe,
  User,
} from 'lucide-react'

export const Navbar = ({ onMenuClick }) => {
  const { user, logout } = useAuth()
  const { isDark, toggleTheme } = useTheme()
  const { i18n, t } = useTranslation()
  const navigate = useNavigate()
  const [showProfile, setShowProfile] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)
  const [profileImage] = useState(
    localStorage.getItem(`userProfileImage_${user?.id || user?.userName}`) || null
  )

  useEffect(() => {
    if (!user?.id) return
    const fetchUnread = async () => {
      try {
        const data = await getUnreadNotificationCount(user.id)
        setUnreadCount(data?.count ?? 0)
      } catch {
        // silently ignore
      }
    }
    fetchUnread()
    const interval = setInterval(fetchUnread, 60000)
    return () => clearInterval(interval)
  }, [user?.id])

  const handleLogout = useCallback(() => {
    logout()
    navigate('/login')
  }, [logout, navigate])

  const toggleLanguage = useCallback(() => {
    const newLang = i18n.language === 'en' ? 'ar' : 'en'
    i18n.changeLanguage(newLang)
  }, [i18n])

  const handleNotificationClick = useCallback(() => {
    navigate('/notifications')
    setUnreadCount(0)
  }, [navigate])

  return (
    <nav className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40">
      <div className="px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4 ltr:space-x-4 rtl:space-x-reverse">
            <button
              onClick={onMenuClick}
              className="lg:hidden p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg text-primary-600"
            >
              <Menu size={24} />
            </button>
          </div>

          <div className="hidden md:flex flex-1 ltr:mx-4 rtl:mx-4">
            <div className="w-full relative">
              <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder={t('navbar.search')}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:text-gray-100"
              />
            </div>
          </div>

          <div className="flex items-center space-x-4 ltr:space-x-4 rtl:space-x-reverse">
            <button
              onClick={handleNotificationClick}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg relative text-primary-600"
            >
              <Bell size={20} />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-accent-500 rounded-full text-white text-xs flex items-center justify-center px-1 font-bold">
                  {unreadCount > 99 ? '99+' : unreadCount}
                </span>
              )}
            </button>

            <button
              onClick={toggleLanguage}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg text-gray-600 dark:text-gray-400"
              title="Toggle Language"
            >
              <Globe size={20} />
            </button>

            <button
              onClick={toggleTheme}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg text-gray-600 dark:text-gray-400"
              title="Toggle Theme"
            >
              {isDark ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            <div className="relative">
              <button
                onClick={() => setShowProfile(prev => !prev)}
                className="flex items-center space-x-2 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
              >
                {profileImage ? (
                  <img src={profileImage} alt="Profile" className="w-8 h-8 rounded-full object-cover" />
                ) : (
                  <span className="text-2xl">👤</span>
                )}
                <span className="hidden sm:inline text-sm font-medium text-gray-900 dark:text-gray-100">
                  {user?.name}
                </span>
              </button>

              {showProfile && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-50">
                  <button
                    onClick={() => { navigate('/profile'); setShowProfile(false) }}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center space-x-2"
                  >
                    <User size={18} />
                    <span>{t('common.profile')}</span>
                  </button>
                  <button
                    onClick={() => { navigate('/notifications'); setShowProfile(false) }}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center space-x-2"
                  >
                    <Bell size={18} />
                    <span>{t('common.notifications')}</span>
                  </button>
                  <hr className="my-2 dark:border-gray-700" />
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400 flex items-center space-x-2"
                  >
                    <LogOut size={18} />
                    <span>{t('common.logout')}</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}
