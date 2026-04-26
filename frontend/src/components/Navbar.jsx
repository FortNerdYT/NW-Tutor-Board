import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { GraduationCap, LogOut, User, Plus } from 'lucide-react'

const Navbar = () => {
  const { user, logout } = useAuth()

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

          <div className="flex items-center space-x-4">
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
        </div>
      </div>
    </nav>
  )
}

export default Navbar
