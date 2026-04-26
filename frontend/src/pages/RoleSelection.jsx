import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { GraduationCap, Users, Briefcase } from 'lucide-react'

const RoleSelection = () => {
  const { user, loading, updateRole } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!user && !loading) {
      navigate('/login')
    }
    if (user && user.role) {
      navigate('/dashboard')
    }
  }, [user, loading, navigate])

  const handleRoleSelect = async (role) => {
    const success = await updateRole(role)
    if (success) {
      navigate('/dashboard')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center px-4 pt-16">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <GraduationCap className="h-16 w-16 text-primary-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome to Tutor Board</h1>
          <p className="text-gray-600">Select your role to get started</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <button
            onClick={() => handleRoleSelect('teacher')}
            className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-shadow text-left group"
          >
            <div className="flex items-center mb-4">
              <div className="p-3 bg-primary-100 rounded-lg group-hover:bg-primary-200 transition-colors">
                <Briefcase className="h-8 w-8 text-primary-600" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Teacher</h2>
            <p className="text-gray-600 mb-4">
              Post requests for student help including tutoring, lab assistance, organization, and more.
            </p>
            <ul className="space-y-2 text-sm text-gray-500">
              <li className="flex items-center">
                <span className="w-1.5 h-1.5 bg-primary-600 rounded-full mr-2"></span>
                Create help requests
              </li>
              <li className="flex items-center">
                <span className="w-1.5 h-1.5 bg-primary-600 rounded-full mr-2"></span>
                Manage your posts
              </li>
              <li className="flex items-center">
                <span className="w-1.5 h-1.5 bg-primary-600 rounded-full mr-2"></span>
                Receive student responses
              </li>
            </ul>
          </button>

          <button
            onClick={() => handleRoleSelect('student')}
            className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-shadow text-left group"
          >
            <div className="flex items-center mb-4">
              <div className="p-3 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
                <Users className="h-8 w-8 text-blue-600" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Student</h2>
            <p className="text-gray-600 mb-4">
              Browse available opportunities and respond to teacher requests for help.
            </p>
            <ul className="space-y-2 text-sm text-gray-500">
              <li className="flex items-center">
                <span className="w-1.5 h-1.5 bg-blue-600 rounded-full mr-2"></span>
                Browse all requests
              </li>
              <li className="flex items-center">
                <span className="w-1.5 h-1.5 bg-blue-600 rounded-full mr-2"></span>
                Filter by category
              </li>
              <li className="flex items-center">
                <span className="w-1.5 h-1.5 bg-blue-600 rounded-full mr-2"></span>
                Contact teachers directly
              </li>
            </ul>
          </button>
        </div>
      </div>
    </div>
  )
}

export default RoleSelection
