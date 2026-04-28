import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import RequestCard from '../components/RequestCard'
import { Search, Filter } from 'lucide-react'
import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || ''

const Dashboard = () => {
  const { user } = useAuth()
  const [requests, setRequests] = useState([])
  const [filteredRequests, setFilteredRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'tutoring', label: 'Tutoring' },
    { value: 'lab_help', label: 'Lab Help' },
    { value: 'organization', label: 'Organization' },
    { value: 'tech_help', label: 'Tech Help' },
    { value: 'other', label: 'Other' }
  ]

  useEffect(() => {
    fetchRequests()
  }, [])

  useEffect(() => {
    filterRequests()
  }, [requests, searchTerm, categoryFilter])

  const fetchRequests = async () => {
    const token = localStorage.getItem('token')
    try {
      const response = await axios.get(`${API_URL}/api/requests`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setRequests(response.data)
    } catch (error) {
      console.error('Failed to fetch requests:', error)
    } finally {
      setLoading(false)
    }
  }

  const filterRequests = () => {
    let filtered = requests

    if (categoryFilter !== 'all') {
      filtered = filtered.filter(req => req.category === categoryFilter)
    }

    if (searchTerm) {
      filtered = filtered.filter(req =>
        req.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        req.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    setFilteredRequests(filtered)
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
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {String(user?.role) === 'teacher' ? 'Help Requests Board' : 'Available Opportunities'}
        </h1>
        <p className="text-gray-600">
          {String(user?.role) === 'teacher'
            ? 'Browse all requests or create your own'
            : 'Find opportunities to help teachers'}
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search requests..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Filter className="h-5 w-5 text-gray-400" />
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              {categories.map(cat => (
                <option key={cat.value} value={cat.value}>{cat.label}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {filteredRequests.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">
            {searchTerm || categoryFilter !== 'all'
              ? 'No requests match your filters'
              : 'No requests available yet'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {filteredRequests.map(request => (
            <RequestCard key={request.id} request={request} />
          ))}
        </div>
      )}
    </div>
  )
}

export default Dashboard
