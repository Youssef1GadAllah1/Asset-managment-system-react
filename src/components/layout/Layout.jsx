import { useEffect, useState } from 'react'
import { Navbar } from './Navbar'
import { Sidebar } from './Sidebar'

export const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(() => localStorage.getItem('sidebarOpen') === 'true')
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    localStorage.setItem('sidebarOpen', sidebarOpen ? 'true' : 'false')
  }, [sidebarOpen])

  return (
    <div className={`flex h-screen bg-gray-50 dark:bg-gray-900 ${sidebarOpen ? 'sidebar-expanded' : ''}`}>
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar
          onMenuClick={() => setSidebarOpen(prev => !prev)}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
        />
        <main className="flex-1 overflow-auto page-enter">
          {children}
        </main>
      </div>
    </div>
  )
}
