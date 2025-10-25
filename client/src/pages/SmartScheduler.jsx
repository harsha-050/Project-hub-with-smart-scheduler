import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import TaskForm from '../components/TaskForm'
import ScheduleResult from '../components/ScheduleResult'
import Header from '../components/Header'

function SmartScheduler() {
  const [scheduleResult, setScheduleResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const { logout } = useAuth()
  const navigate = useNavigate()

  const handleScheduleComplete = (result) => {
    setScheduleResult(result)
  }

  const handleReset = () => {
    setScheduleResult(null)
  }

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Header />
      
      {/* Navigation Bar */}
      <div className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex gap-4">
            <button
              onClick={() => navigate('/dashboard')}
              className="px-4 py-2 text-gray-700 hover:text-blue-600 font-medium transition"
            >
              ← Back to Projects
            </button>
          </div>
          <button
            onClick={handleLogout}
            className="px-4 py-2 text-sm font-medium text-red-600 hover:text-red-700 border border-red-300 rounded-lg hover:bg-red-50 transition"
          >
            Logout
          </button>
        </div>
      </div>
      
      <main className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="mb-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Smart Scheduler
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Automatically plan your work by analyzing task dependencies and generating optimal scheduling
          </p>
        </div>

        {!scheduleResult ? (
          <TaskForm 
            onScheduleComplete={handleScheduleComplete}
            loading={loading}
            setLoading={setLoading}
          />
        ) : (
          <ScheduleResult 
            result={scheduleResult}
            onReset={handleReset}
          />
        )}
      </main>

      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="container mx-auto px-4 py-6 text-center text-gray-600">
          <p>© 2025 Smart Scheduler API - Credits: 10</p>
        </div>
      </footer>
    </div>
  )
}

export default SmartScheduler
