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
import { Logo } from '../common/Logo'

export const Navbar = ({ onMenuClick, searchTerm = '', onSearchChange }) => {
  const { user, logout } = useAuth()
  const { isDark, toggleTheme } = useTheme()
  const { i18n, t } = useTranslation()
  const navigate = useNavigate()
  const [showProfile, setShowProfile] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)
  const [scrolled, setScrolled] = useState(false)

  const profileImage = user?.profile_image || null
  const initials = user?.name
    ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : '?'

  useEffect(() => {
    if (!user?.id) return
    const fetchUnread = async () => {
      try {
        const data = await getUnreadNotificationCount(user.id)
        setUnreadCount(data?.count ?? 0)
      } catch {
      }
    }
    fetchUnread()
    const interval = setInterval(fetchUnread, 60000)
    return () => clearInterval(interval)
  }, [user?.id])

  useEffect(() => {
    const main = document.querySelector('main')
    if (!main) return
    const onScroll = () => setScrolled(main.scrollTop > 8)
    main.addEventListener('scroll', onScroll, { passive: true })
    return () => main.removeEventListener('scroll', onScroll)
  }, [])

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
    <nav className={`bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl border-b border-gray-200/70 dark:border-gray-700 sticky top-0 z-40 transition-all duration-300 ${scrolled ? 'navbar-scrolled' : ''}`}>
      <div className="px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center space-x-3 ltr:space-x-3 rtl:space-x-reverse min-w-0">
            <button
              onClick={onMenuClick}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl text-primary-600 transition-all duration-200 active:scale-90 shrink-0"
            >
              <Menu size={24} />
            </button>
            <Logo size="sm" to="/dashboard" />
          </div>

          <div className="flex-1 max-w-2xl hidden md:block">
            <div className="relative group">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary-500 transition-colors duration-200"
              />
              <input
                type="text"
                placeholder={t('navbar.search')}
                value={searchTerm}
                onChange={(e) => onSearchChange?.(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all duration-200"
              />
            </div>
          </div>

          <div className="flex items-center space-x-2 ltr:space-x-2 rtl:space-x-reverse">
            <button
              onClick={toggleTheme}
              className="p-2.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl text-gray-500 dark:text-gray-300 transition-all duration-200 active:scale-90"
              title={isDark ? t('navbar.lightMode') : t('navbar.darkMode')}
            >
              {isDark ? <Sun size={20} className="text-amber-400" /> : <Moon size={20} />}
            </button>

            <button
              onClick={toggleLanguage}
              className="p-2.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl text-gray-500 dark:text-gray-300 transition-all duration-200 active:scale-90"
              title={i18n.language === 'en' ? 'Switch to Arabic' : 'التبديل إلى الإنجليزية'}
            >
              <Globe size={20} />
            </button>

            <button
              onClick={handleNotificationClick}
              className="p-2.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl relative text-primary-600 transition-all duration-200 active:scale-90"
            >
              <Bell size={20} />
              {unreadCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold animate-pulse">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>

            <div className="relative">
              <button
                onClick={() => setShowProfile(v => !v)}
                className="flex items-center gap-2 p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-all duration-200 active:scale-95"
              >
                {profileImage ? (
                  <img
                    src={profileImage}
                    alt="Profile"
                    className="w-8 h-8 rounded-full object-cover border-2 border-primary-200 dark:border-primary-700"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-primary-600 flex items-center justify-center border-2 border-primary-200 dark:border-primary-700 text-white text-xs font-bold">
                    {initials}
                  </div>
                )}
                <span className="hidden md:block text-sm font-medium text-gray-700 dark:text-gray-200 max-w-[120px] truncate">
                  {user?.name}
                </span>
              </button>

              {showProfile && (
                <div className="animate-slideDown absolute right-0 mt-2 w-56 bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden z-50">
                  <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700">
                    <p className="font-semibold text-sm text-gray-900 dark:text-white truncate">{user?.name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user?.email}</p>
                  </div>
                  <div className="py-1">
                    <button
                      onClick={() => { navigate('/profile'); setShowProfile(false) }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-150"
                    >
                      <User size={15} />
                      {t('common.profile')}
                    </button>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors duration-150"
                    >
                      <LogOut size={15} />
                      {t('common.logout')}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}
