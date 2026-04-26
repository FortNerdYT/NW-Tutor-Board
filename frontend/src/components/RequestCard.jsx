import { Link } from 'react-router-dom'
import { Calendar, Clock, User } from 'lucide-react'

const categoryColors = {
  tutoring: 'bg-blue-100 text-blue-800',
  lab_help: 'bg-green-100 text-green-800',
  organization: 'bg-purple-100 text-purple-800',
  tech_help: 'bg-orange-100 text-orange-800',
  other: 'bg-gray-100 text-gray-800'
}

const categoryLabels = {
  tutoring: 'Tutoring',
  lab_help: 'Lab Help',
  organization: 'Organization',
  tech_help: 'Tech Help',
  other: 'Other'
}

const RequestCard = ({ request }) => {
  const formatDate = (dateString) => {
    if (!dateString) return 'Ongoing'
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  const preview = request.description.length > 120
    ? request.description.substring(0, 120) + '...'
    : request.description

  return (
    <Link to={`/request/${request.id}`}>
      <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-200 p-6 cursor-pointer">
        <div className="flex items-start justify-between mb-3">
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${categoryColors[request.category]}`}>
            {categoryLabels[request.category]}
          </span>
          <div className="flex items-center text-xs text-gray-500">
            <Clock className="h-3 w-3 mr-1" />
            {new Date(request.created_at).toLocaleDateString()}
          </div>
        </div>

        <h3 className="text-lg font-semibold text-gray-900 mb-2">{request.title}</h3>
        <p className="text-gray-600 text-sm mb-4">{preview}</p>

        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center text-gray-500">
            <User className="h-4 w-4 mr-1" />
            <span>{request.users?.name || 'Teacher'}</span>
          </div>
          <div className="flex items-center text-gray-500">
            <Calendar className="h-4 w-4 mr-1" />
            <span>{formatDate(request.start_date)}</span>
          </div>
        </div>

        {request.min_grade && (
          <div className="mt-3 pt-3 border-t border-gray-100">
            <span className="text-xs text-gray-500">Min Grade: </span>
            <span className="text-xs font-medium text-gray-700">{request.min_grade}</span>
          </div>
        )}
      </div>
    </Link>
  )
}

export default RequestCard
