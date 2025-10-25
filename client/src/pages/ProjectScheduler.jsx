import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { projectsAPI } from '../api/projectManagerApi';
import { scheduleTasks } from '../api/scheduler';
import ScheduleResult from '../components/ScheduleResult';

const ProjectScheduler = () => {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [scheduleResult, setScheduleResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [scheduling, setScheduling] = useState(false);
  const [error, setError] = useState('');
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchProjectData();
  }, [id]);

  // Auto-schedule tasks when project data is loaded
  useEffect(() => {
    if (tasks.length > 0 && !scheduleResult && !scheduling) {
      handleSchedule();
    }
  }, [tasks]);

  const fetchProjectData = async () => {
    try {
      setLoading(true);
      const response = await projectsAPI.get(id);
      setProject(response.data);
      setTasks(response.data.tasks || []);
      setError('');
    } catch (err) {
      setError('Failed to load project');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSchedule = async () => {
    if (!tasks || tasks.length === 0) {
      setError('No tasks available to schedule');
      return;
    }

    // Filter out completed tasks
    const incompleteTasks = tasks.filter(task => !task.completionStatus);
    
    if (incompleteTasks.length === 0) {
      setError('All tasks are completed! No tasks to schedule.');
      return;
    }

    setScheduling(true);
    setError('');

    try {
      // Convert only incomplete project tasks to scheduler format
      const schedulerTasks = incompleteTasks.map(task => ({
        title: task.title || 'Untitled Task',
        estimatedHours: task.estimatedHours || 5,
        dueDate: task.dueDate || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        dependencies: task.dependencies ? JSON.parse(task.dependencies) : []
      }));

      console.log('Sending incomplete tasks to scheduler:', schedulerTasks);
      const result = await scheduleTasks(project.id, schedulerTasks);
      setScheduleResult(result);
    } catch (err) {
      setError(err.message || 'Failed to schedule tasks');
      console.error('Scheduling error:', err);
    } finally {
      setScheduling(false);
    }
  };

  const handleReset = () => {
    setScheduleResult(null);
    setError('');
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading project...</p>
        </div>
      </div>
    );
  }

  if (scheduling) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
          <p className="mt-4 text-gray-600 font-medium">Generating smart schedule...</p>
          <p className="mt-2 text-sm text-gray-500">Analyzing tasks and dependencies</p>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Project not found</p>
          <button
            onClick={() => navigate('/dashboard')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">📋</div>
          <p className="text-gray-600 mb-4 text-lg">No tasks available to schedule</p>
          <button
            onClick={() => navigate(`/projects/${project.id}`)}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition"
          >
            Add Tasks First
          </button>
        </div>
      </div>
    );
  }

  if (scheduleResult) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
        {/* Header */}
        <header className="bg-white shadow-md border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex justify-between items-center">
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Smart Schedule Results
              </h1>
              <p className="text-xs text-gray-600 mt-0.5">Project: {project.title}</p>
            </div>
            <button
              onClick={handleLogout}
              className="px-3 py-1.5 text-xs font-medium text-red-600 hover:text-white border border-red-500 rounded-md hover:bg-red-500 transition-all duration-200"
            >
              Logout
            </button>
          </div>
        </header>

        {/* Navigation */}
        <div className="bg-white border-b border-gray-200 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5">
            <button
              onClick={() => navigate(`/projects/${project.id}`)}
              className="text-blue-600 hover:text-blue-700 text-sm font-semibold flex items-center gap-2 hover:gap-3 transition-all"
            >
              <span>←</span>
              <span>Back to Project</span>
            </button>
          </div>
        </div>

        {/* Results */}
        <main className="container mx-auto px-4 py-6 max-w-7xl">
          <ScheduleResult result={scheduleResult} onReset={handleReset} tasks={tasks} />
        </main>
      </div>
    );
  }

  // Error state
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <header className="bg-white shadow-md border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Smart Scheduler
            </h1>
            <p className="text-xs text-gray-600 mt-0.5">Welcome, {user?.username}!</p>
          </div>
          <button
            onClick={handleLogout}
            className="px-3 py-1.5 text-xs font-medium text-red-600 hover:text-white border border-red-500 rounded-md hover:bg-red-500 transition-all duration-200"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Navigation */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5">
          <button
            onClick={() => navigate(`/projects/${project.id}`)}
            className="text-blue-600 hover:text-blue-700 text-sm font-semibold flex items-center gap-2 hover:gap-3 transition-all"
          >
            <span>←</span>
            <span>Back to Project</span>
          </button>
        </div>
      </div>

      {/* Error Message */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {error && (
          <div className="mb-4 bg-red-50 border-l-4 border-red-500 text-red-700 px-3 py-2 rounded-r-lg shadow-sm">
            <div className="flex items-center">
              <span className="text-base mr-2">⚠️</span>
              <span className="text-sm">{error}</span>
            </div>
          </div>
        )}
        <div className="text-center py-12">
          <p className="text-gray-600 mb-4">Unable to generate schedule</p>
          <button
            onClick={() => navigate(`/projects/${project.id}`)}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition"
          >
            Back to Project
          </button>
        </div>
      </main>
    </div>
  );
};

export default ProjectScheduler;
