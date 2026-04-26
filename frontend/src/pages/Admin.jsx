import { useState } from 'react'
import { Shield, Upload, Check, X, Users } from 'lucide-react'
import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || ''

const Admin = () => {
  const [password, setPassword] = useState('')
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [emails, setEmails] = useState('')
  const [results, setResults] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleLogin = (e) => {
    e.preventDefault()
    // Store password for API calls
    sessionStorage.setItem('adminPassword', password)
    setIsAuthenticated(true)
  }

  const handleImport = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setResults(null)

    // Parse emails from textarea (one per line or comma-separated)
    const emailList = emails
      .split(/[\n,]/)
      .map(e => e.trim())
      .filter(e => e && e.includes('@'))

    if (emailList.length === 0) {
      setError('No valid emails found')
      setLoading(false)
      return
    }

    try {
      const adminPassword = sessionStorage.getItem('adminPassword')
      const response = await axios.post(
        `${API_URL}/api/admin/import-teachers`,
        { emails: emailList },
        {
          headers: { 'X-Admin-Password': adminPassword }
        }
      )
      setResults(response.data)
      setEmails('')
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to import emails')
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    sessionStorage.removeItem('adminPassword')
    setIsAuthenticated(false)
    setPassword('')
    setResults(null)
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center px-4">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="flex items-center justify-center mb-6">
              <Shield className="h-16 w-16 text-primary-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2 text-center">Admin Access</h1>
            <p className="text-gray-600 text-center mb-6">Enter admin password to continue</p>
            
            <form onSubmit={handleLogin}>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Admin password"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent mb-4"
                required
              />
              <button
                type="submit"
                className="w-full bg-primary-600 text-white py-3 rounded-lg hover:bg-primary-700 transition-colors font-medium"
              >
                Access Admin Panel
              </button>
            </form>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <Shield className="h-8 w-8 text-primary-600 mr-3" />
            <h1 className="text-3xl font-bold text-gray-900">Admin Panel</h1>
          </div>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Logout
          </button>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
            <Upload className="h-5 w-5 mr-2" />
            Import Teacher Emails
          </h2>
          <p className="text-gray-600 mb-4">
            Enter email addresses (one per line or comma-separated) to set them as teachers.
            Existing users will be updated, new users will be created (they'll need to login via OAuth).
          </p>
          
          <form onSubmit={handleImport}>
            <textarea
              value={emails}
              onChange={(e) => setEmails(e.target.value)}
              placeholder="teacher1@example.com&#10;teacher2@example.com&#10;teacher3@example.com"
              className="w-full h-48 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent mb-4 font-mono text-sm"
            />
            
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Importing...' : 'Import Teachers'}
            </button>
          </form>
        </div>

        {results && (
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
              <Users className="h-5 w-5 mr-2" />
              Import Results
            </h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-green-700 mb-3 flex items-center">
                  <Check className="h-4 w-4 mr-1" />
                  Success ({results.success.length})
                </h3>
                <div className="bg-green-50 rounded-lg p-4 max-h-64 overflow-y-auto">
                  {results.success.map((item, index) => (
                    <div key={index} className="text-sm text-green-800 mb-1">
                      {item.email} - {item.action}
                    </div>
                  ))}
                </div>
              </div>
              
              {results.failed.length > 0 && (
                <div>
                  <h3 className="font-semibold text-red-700 mb-3 flex items-center">
                    <X className="h-4 w-4 mr-1" />
                    Failed ({results.failed.length})
                  </h3>
                  <div className="bg-red-50 rounded-lg p-4 max-h-64 overflow-y-auto">
                    {results.failed.map((item, index) => (
                      <div key={index} className="text-sm text-red-800 mb-1">
                        {item.email} - {item.error}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Admin
