import { createContext, useContext, useState, useEffect } from 'react'
import axios from 'axios'

const AuthContext = createContext(null)

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/auth/me`, { withCredentials: true })
      console.log('User data:', response.data)
      setUser(response.data)
    } catch (error) {
      console.error('Auth check failed:', error)
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  const login = () => {
    window.location.href = `${API_URL}/api/auth/google`
  }

  const logout = async () => {
    try {
      await axios.post(`${API_URL}/api/auth/logout`, {}, { withCredentials: true })
      setUser(null)
      window.location.href = '/login'
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  const updateRole = async (role) => {
    try {
      const response = await axios.patch(
        `${API_URL}/api/users/role`,
        { role },
        { withCredentials: true }
      )
      setUser(response.data)
      return true
    } catch (error) {
      console.error('Role update failed:', error)
      return false
    }
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, updateRole, checkAuth }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
