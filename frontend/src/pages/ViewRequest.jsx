import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Calendar, User, Mail, ArrowLeft, Trash2, Edit, Check } from 'lucide-react'
import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || '/api'

const categoryLabels = {
  tutoring: 'Tutoring',
  lab_help: 'Lab Help',
  organization: 'Organization',
  tech_help: 'Tech Help',
  other: 'Other'
}

const ViewRequest = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [request, setRequest] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchRequest()
  }, [id])

  const fetchRequest = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/requests/${id}`, { withCredentials: true })
      setRequest(response.data)
    } catch (error) {
      console.error('Failed to fetch request:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleContact = () => {
    const subject = encodeURIComponent(`Student Response: ${request.title}`)
    const body = encodeURIComponent(
      `Hi ${request.users?.name || 'Teacher'},\n\nI'm interested in helping with: ${request.title}\n\n`
    )
    window.location.href = `mailto:${request.contact_method}?subject=${subject}&body=${body}`
  }

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this request?')) return

    try {
      await axios.delete(`${API_URL}/api/requests/${id}`, { withCredentials: true })
      navigate('/dashboard')
    } catch (error) {
      console.error('Failed to delete request:', error)
      alert('Failed to delete request')
    }
  }

  const handleMarkFilled = async () => {
    try {
      await axios.patch(`${API_URL}/api/requests/${id}/filled`, {}, { withCredentials: true })
      fetchRequest()
    } catch (error) {
      console.error('Failed to mark as filled:', error)
      alert('Failed to mark as filled')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (!request) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <p className="text-gray-500">Request not found</p>
      </div>
    )
  }

  const isOwner = user?.id === request.teacher_id

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <button
        onClick={() => navigate('/dashboard')}
        className="flex items-center text-gray-600 hover:text-gray-900 mb-6"
      >
        <ArrowLeft className="h-5 w-5 mr-2" />
        Back to Dashboard
      </button>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <div className="flex items-start justify-between mb-6">
          <div>
            <span className="inline-block px-3 py-1 bg-primary-100 text-primary-800 rounded-full text-sm font-medium mb-3">
              {categoryLabels[request.category]}
            </span>
            <h1 className="text-3xl font-bold text-gray-900">{request.title}</h1>
          </div>
          {isOwner && (
            <div className="flex space-x-2">
              <button
                onClick={() => navigate(`/edit-request/${id}`)}
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Edit className="h-5 w-5" />
              </button>
              <button
                onClick={handleDelete}
                className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <Trash2 className="h-5 w-5" />
              </button>
            </div>
          )}
        </div>

        <div className="flex items-center space-x-4 text-sm text-gray-600 mb-6">
          <div className="flex items-center">
            <User className="h-4 w-4 mr-1" />
            <span>{request.users?.name || 'Teacher'}</span>
          </div>
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-1" />
            <span>Posted {new Date(request.created_at).toLocaleDateString()}</span>
          </div>
        </div>

        <div className="prose max-w-none mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Description</h3>
          <p className="text-gray-700 whitespace-pre-wrap">{request.description}</p>
        </div>

        {request.student_requirements && (
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Student Requirements</h3>
            <p className="text-gray-700 whitespace-pre-wrap">{request.student_requirements}</p>
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {request.min_grade && (
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">Minimum Grade</h3>
              <p className="text-gray-900 font-medium">{request.min_grade}</p>
            </div>
          )}
          {request.class_taken && (
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">Class Taken</h3>
              <p className="text-gray-900 font-medium">{request.class_taken}</p>
            </div>
          )}
          {request.clubs && (
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">Clubs</h3>
              <p className="text-gray-900 font-medium">{request.clubs}</p>
            </div>
          )}
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-1">Timeframe</h3>
            <p className="text-gray-900 font-medium">
              {request.is_ongoing ? 'Ongoing' : `${request.start_date} - ${request.end_date}`}
            </p>
          </div>
        </div>

        {request.contact_instructions && (
          <div className="bg-blue-50 rounded-lg p-4 mb-6">
            <h3 className="text-sm font-medium text-blue-900 mb-1">Contact Instructions</h3>
            <p className="text-blue-800">{request.contact_instructions}</p>
          </div>
        )}

        <div className="flex items-center justify-between pt-6 border-t border-gray-200">
          <div className="flex items-center text-sm text-gray-600">
            <Mail className="h-4 w-4 mr-1" />
            <span>{request.contact_method}</span>
          </div>
          <div className="flex space-x-3">
            {isOwner && !request.is_filled && (
              <button
                onClick={handleMarkFilled}
                className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <Check className="h-4 w-4" />
                <span>Mark as Filled</span>
              </button>
            )}
            {!isOwner && !request.is_filled && (
              <button
                onClick={handleContact}
                className="flex items-center space-x-2 px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                <Mail className="h-4 w-4" />
                <span>Contact Teacher</span>
              </button>
            )}
            {request.is_filled && (
              <span className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg">
                This position has been filled
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ViewRequest
