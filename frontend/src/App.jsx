import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import Navbar from './components/Navbar'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import CreateRequest from './pages/CreateRequest'
import EditRequest from './pages/EditRequest'
import ViewRequest from './pages/ViewRequest'
import MyRequests from './pages/MyRequests'
import RoleSelection from './pages/RoleSelection'

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/role-selection" element={<RoleSelection />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/create-request" element={<CreateRequest />} />
            <Route path="/edit-request/:id" element={<EditRequest />} />
            <Route path="/request/:id" element={<ViewRequest />} />
            <Route path="/my-requests" element={<MyRequests />} />
            <Route path="/" element={<Navigate to="/login" />} />
          </Routes>
        </div>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
