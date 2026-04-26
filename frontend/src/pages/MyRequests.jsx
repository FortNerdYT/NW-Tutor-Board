import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Plus, Trash2, Edit, Check } from 'lucide-react'
import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || ''

const categoryLabels = {
  tutoring: 'Tutoring',
  lab_help: 'Lab Help',
  organization: 'Organization',
  tech_help: 'Tech Help',
  other: 'Other'
}

const MyRequests = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user?.role !== 'teacher') {
      navigate('/dashboard')
      return
    }
    fetchRequests()
  }, [user, navigate])

  const fetchRequests = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/users/my-requests`, { withCredentials: true })
      setRequests(response.data)
    } catch (error) {
      console.error('Failed to fetch requests:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this request?')) return

    try {
      await axios.delete(`${API_URL}/api/requests/${id}`, { withCredentials: true })
      setRequests(requests.filter(req => req.id !== id))
    } catch (error) {
      console.error('Failed to delete request:', error)
      alert('Failed to delete request')
    }
  }

  const handleMarkFilled = async (id) => {
    try {
      await axios.patch(`${API_URL}/api/requests/${id}/filled`, {}, { withCredentials: true })
      fetchRequests()
    } catch (error) {
      console.error('Failed to mark as filled:', error)
      alert('Failed to mark as filled')
    }
  }

  if (user?.role !== 'teacher') {
    return null
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Requests</h1>
          <p className="text-gray-600">Manage your help requests</p>
        </div>
        <button
          onClick={() => navigate('/create-request')}
          className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span>New Request</span>
        </button>
      </div>

      {requests.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <p className="text-gray-500 text-lg mb-4">You haven't created any requests yet</p>
          <button
            onClick={() => navigate('/create-request')}
            className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            Create Your First Request
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {requests.map(request => (
            <div
              key={request.id}
              className={`bg-white rounded-xl shadow-sm border p-6 ${
                request.is_filled ? 'border-green-200 bg-green-50' : 'border-gray-200'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-medium">
                      {categoryLabels[request.category]}
                    </span>
                    {request.is_filled && (
                      <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                        Filled
                      </span>
                    )}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{request.title}</h3>
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">{request.description}</p>
                  <div className="text-xs text-gray-500">
                    Posted {new Date(request.created_at).toLocaleDateString()}
                  </div>
                </div>

                <div className="flex space-x-2 ml-4">
                  <button
                    onClick={() => navigate(`/edit-request/${request.id}`)}
                    className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                    title="Edit"
                  >
                    <Edit className="h-5 w-5" />
                  </button>
                  {!request.is_filled && (
                    <button
                      onClick={() => handleMarkFilled(request.id)}
                      className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                      title="Mark as Filled"
                    >
                      <Check className="h-5 w-5" />
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(request.id)}
                    className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default MyRequests
