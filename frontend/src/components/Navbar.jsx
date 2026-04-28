import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useState } from 'react'
import { GraduationCap, LogOut, User, Plus, Menu, X } from 'lucide-react'

const Navbar = () => {
  const { user, logout } = useAuth()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  if (!user) return null

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/dashboard" className="flex items-center space-x-2">
              <GraduationCap className="h-8 w-8 text-primary-600" />
              <span className="text-xl font-bold text-gray-900">Tutor Board</span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-4">
            {user.role === 'teacher' && (
              <Link
                to="/create-request"
                className="flex items-center space-x-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                <Plus className="h-4 w-4" />
                <span>New Request</span>
              </Link>
            )}

            {user.role === 'teacher' && (
              <Link
                to="/my-requests"
                className="px-4 py-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              >
                My Requests
              </Link>
            )}

            <div className="flex items-center space-x-2 px-4 py-2 bg-gray-100 rounded-lg">
              <User className="h-4 w-4 text-gray-600" />
              <span className="text-sm font-medium text-gray-700">{user.name || 'User'}</span>
              <span className="text-xs text-gray-500 capitalize">({user.role || 'student'})</span>
            </div>

            <button
              onClick={logout}
              className="flex items-center space-x-1 px-4 py-2 text-gray-700 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200 space-y-3">
            {user.role === 'teacher' && (
              <Link
                to="/create-request"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg"
              >
                <Plus className="h-4 w-4" />
                <span>New Request</span>
              </Link>
            )}

            {user.role === 'teacher' && (
              <Link
                to="/my-requests"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-4 py-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
              >
                My Requests
              </Link>
            )}

            <div className="flex items-center space-x-2 px-4 py-2 bg-gray-100 rounded-lg">
              <User className="h-4 w-4 text-gray-600" />
              <span className="text-sm font-medium text-gray-700">{user.name || 'User'}</span>
              <span className="text-xs text-gray-500 capitalize">({user.role || 'student'})</span>
            </div>

            <button
              onClick={() => {
                setMobileMenuOpen(false)
                logout()
              }}
              className="flex items-center space-x-2 w-full px-4 py-2 text-gray-700 hover:text-red-600 hover:bg-red-50 rounded-lg"
            >
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </button>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar
