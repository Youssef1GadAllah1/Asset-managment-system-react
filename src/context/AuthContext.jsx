import { createContext, useState, useContext, useEffect } from 'react'
import { login as apiLogin } from '../utils/api'

const AuthContext = createContext()

const getStorage = () => {
  const remember = localStorage.getItem('rememberMe') === 'true'
  return remember ? localStorage : sessionStorage
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token =
      localStorage.getItem('token') || sessionStorage.getItem('token')
    const savedUser =
      localStorage.getItem('user') || sessionStorage.getItem('user')

    if (token && savedUser) {
      try {
        setUser(JSON.parse(savedUser))
      } catch {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        sessionStorage.removeItem('token')
        sessionStorage.removeItem('user')
      }
    }
    setLoading(false)
  }, [])

  const login = async (email, password, rememberMe = false) => {
    const { user: userData, token } = await apiLogin(email, password)

    localStorage.setItem('rememberMe', String(rememberMe))

    const storage = rememberMe ? localStorage : sessionStorage
    storage.setItem('token', token)
    storage.setItem('user', JSON.stringify(userData))

    if (!rememberMe) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
    } else {
      sessionStorage.removeItem('token')
      sessionStorage.removeItem('user')
    }

    setUser(userData)
    return userData
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    localStorage.removeItem('rememberMe')
    sessionStorage.removeItem('token')
    sessionStorage.removeItem('user')
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}
