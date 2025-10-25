import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { projectsAPI, tasksAPI } from '../api/projectManagerApi';

const ProjectDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { logout, user } = useAuth();

  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAddTask, setShowAddTask] = useState(false);
  const [newTask, setNewTask] = useState({ 
    title: '', 
    dueDate: '', 
    estimatedHours: 0, 
    dependencies: [] 
  });
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    fetchProjectDetails();
  }, [id]);

  const fetchProjectDetails = async () => {
    try {
      setLoading(true);
      const response = await projectsAPI.get(id);
      console.log('Project response:', response.data);
      setProject(response.data);
      setTasks(response.data.tasks || []);
      setError('');
    } catch (err) {
      setError('Failed to load project details');
      console.error('Error fetching project:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddTask = async (e) => {
    e.preventDefault();
    
    if (!newTask.title.trim()) {
      return;
    }

    setCreating(true);
    try {
      await tasksAPI.create(parseInt(id), {
        title: newTask.title,
        dueDate: newTask.dueDate || undefined,
        estimatedHours: newTask.estimatedHours,
        dependencies: JSON.stringify(newTask.dependencies)
      });
      setShowAddTask(false);
      setNewTask({ title: '', dueDate: '', estimatedHours: 5, dependencies: [] });
      await fetchProjectDetails();
    } catch (err) {
      setError('Failed to create task');
      console.error(err);
    } finally {
      setCreating(false);
    }
  };

  const handleToggleTask = async (taskId, currentStatus) => {
    try {
      await tasksAPI.update(taskId, { completionStatus: !currentStatus });
      fetchProjectDetails();
    } catch (err) {
      setError('Failed to update task');
      console.error(err);
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (!confirm('Are you sure you want to delete this task?')) {
      return;
    }

    try {
      await tasksAPI.delete(taskId);
      fetchProjectDetails();
    } catch (err) {
      setError('Failed to delete task');
      console.error(err);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading project...</p>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
      <header className="bg-white shadow-md border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Project Hub
            </h1>
            <p className="text-xs text-gray-600 mt-0.5">Welcome back, <span className="font-semibold text-gray-800">{user?.username}</span>! 👋</p>
          </div>
          <button
            onClick={handleLogout}
            className="px-3 py-1.5 text-xs font-medium text-red-600 hover:text-white border border-red-500 rounded-md hover:bg-red-500 transition-all duration-200"
          >
            Logout
          </button>
        </div>
      </header>

      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5">
          <button
            onClick={() => navigate('/dashboard')}
            className="text-blue-600 hover:text-blue-700 text-sm font-semibold flex items-center gap-2 hover:gap-3 transition-all"
          >
            <span>←</span>
            <span>Back to All Projects</span>
          </button>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {error && (
          <div className="mb-4 bg-red-50 border-l-4 border-red-500 text-red-700 px-3 py-2 rounded-r-lg shadow-sm">
            <div className="flex items-center">
              <span className="text-base mr-2">⚠️</span>
              <span className="text-sm">{error}</span>
            </div>
          </div>
        )}

        <div className="bg-white rounded-lg shadow-lg p-5 mb-5 border border-gray-100">
          <div className="flex items-start gap-3">
            <div className="bg-gradient-to-br from-blue-500 to-indigo-500 rounded-lg p-2.5 shadow-lg">
              <span className="text-2xl">📁</span>
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold text-gray-800 mb-2">{project.title}</h2>
              {project.description && (
                <p className="text-gray-600 mb-3 text-sm leading-relaxed">{project.description}</p>
              )}
              <div className="flex gap-4 text-xs text-gray-500">
                <span className="flex items-center gap-1.5">
                  <span className="text-sm">📅</span>
                  <span>Created: {new Date(project.creationDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                </span>
                <span>•</span>
                <span className="flex items-center gap-1.5">
                  <span className="text-sm">✓</span>
                  <span className="font-medium">{tasks.length} {tasks.length === 1 ? 'task' : 'tasks'}</span>
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-5 border border-gray-100">
          <div className="flex justify-between items-center mb-5">
            <div>
              <h3 className="text-lg font-bold text-gray-800">Tasks</h3>
              <p className="text-xs text-gray-600 mt-0.5">Manage and track your project tasks</p>
            </div>
            <button
              onClick={() => setShowAddTask(true)}
              className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-sm font-semibold rounded-lg transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 flex items-center gap-2"
            >
              <span className="text-base">+</span>
              <span>Add Task</span>
            </button>
          </div>

          {tasks.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-4xl mb-3">✅</div>
              <p className="text-gray-600">No tasks yet. Add your first task!</p>
            </div>
          ) : (
            <div className="space-y-6">
              {tasks.filter(task => !task.completionStatus).length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <h4 className="text-sm font-bold text-gray-700">📋 To Do</h4>
                    <span className="bg-blue-100 text-blue-700 text-xs font-semibold px-2 py-1 rounded-full">
                      {tasks.filter(task => !task.completionStatus).length}
                    </span>
                  </div>
                  <div className="space-y-3">
                    {tasks
                      .filter(task => !task.completionStatus)
                      .map((task) => (
                        <div
                          key={task.id}
                          className="flex items-center gap-3 p-3.5 border-2 border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-md transition-all duration-200 bg-gradient-to-r from-white to-gray-50"
                        >
                          <input
                            type="checkbox"
                            checked={task.completionStatus}
                            onChange={() => handleToggleTask(task.id, task.completionStatus)}
                            className="w-5 h-5 text-blue-600 rounded-lg focus:ring-2 focus:ring-blue-500 cursor-pointer"
                          />
                          <div className="flex-1">
                            <h4 className="font-semibold text-sm text-gray-800">
                              {task.title}
                            </h4>
                            <div className="flex gap-2 text-xs text-gray-500 mt-1.5">
                              {task.estimatedHours && (
                                <span className="flex items-center gap-1 bg-blue-50 px-2 py-0.5 rounded-full">
                                  <span>⏱️</span>
                                  <span className="font-medium">{task.estimatedHours}h</span>
                                </span>
                              )}
                              {task.dueDate && (
                                <span className="flex items-center gap-1 bg-purple-50 px-2 py-0.5 rounded-full">
                                  <span>📅</span>
                                  <span className="font-medium">
                                    Due: {new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                    {(() => {
                                      const daysLeft = Math.ceil((new Date(task.dueDate) - new Date()) / (1000 * 60 * 60 * 24));
                                      if (daysLeft < 0) {
                                        return ` (${Math.abs(daysLeft)} days overdue)`;
                                      } else if (daysLeft === 0) {
                                        return ' (Today)';
                                      } else if (daysLeft === 1) {
                                        return ' (1 day left)';
                                      } else {
                                        return ` (${daysLeft} days left)`;
                                      }
                                    })()}
                                  </span>
                                </span>
                              )}
                              {task.dependencies && JSON.parse(task.dependencies).length > 0 && (
                                <span className="flex items-center gap-1 bg-orange-50 px-2 py-0.5 rounded-full">
                                  <span>🔗</span>
                                  <span className="font-medium">{JSON.parse(task.dependencies).length} {JSON.parse(task.dependencies).length === 1 ? 'dependency' : 'dependencies'}</span>
                                </span>
                              )}
                            </div>
                          </div>
                          <button
                            onClick={() => handleDeleteTask(task.id)}
                            className="px-3 py-1.5 text-xs text-red-600 hover:text-white hover:bg-red-500 font-medium rounded-md border border-red-500 transition-all"
                          >
                            Delete
                          </button>
                        </div>
                      ))}
                  </div>
                </div>
              )}

              {tasks.filter(task => task.completionStatus).length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <h4 className="text-sm font-bold text-gray-700">✅ Completed</h4>
                    <span className="bg-green-100 text-green-700 text-xs font-semibold px-2 py-1 rounded-full">
                      {tasks.filter(task => task.completionStatus).length}
                    </span>
                  </div>
                  <div className="space-y-3">
                    {tasks
                      .filter(task => task.completionStatus)
                      .map((task) => (
                        <div
                          key={task.id}
                          className="flex items-center gap-3 p-3.5 border-2 border-gray-200 rounded-lg hover:border-green-300 hover:shadow-md transition-all duration-200 bg-gradient-to-r from-green-50 to-gray-50"
                        >
                          <input
                            type="checkbox"
                            checked={task.completionStatus}
                            onChange={() => handleToggleTask(task.id, task.completionStatus)}
                            className="w-5 h-5 text-green-600 rounded-lg focus:ring-2 focus:ring-green-500 cursor-pointer"
                          />
                          <div className="flex-1">
                            <h4 className="font-semibold text-sm line-through text-gray-400">
                              {task.title}
                            </h4>
                            <div className="flex gap-2 text-xs text-gray-400 mt-1.5">
                              {task.estimatedHours && (
                                <span className="flex items-center gap-1 bg-gray-100 px-2 py-0.5 rounded-full">
                                  <span>⏱️</span>
                                  <span className="font-medium">{task.estimatedHours}h</span>
                                </span>
                              )}
                              {task.dueDate && (
                                <span className="flex items-center gap-1 bg-gray-100 px-2 py-0.5 rounded-full">
                                  <span>📅</span>
                                  <span className="font-medium">
                                    Due: {new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                  </span>
                                </span>
                              )}
                              {task.dependencies && JSON.parse(task.dependencies).length > 0 && (
                                <span className="flex items-center gap-1 bg-gray-100 px-2 py-0.5 rounded-full">
                                  <span>🔗</span>
                                  <span className="font-medium">{JSON.parse(task.dependencies).length} {JSON.parse(task.dependencies).length === 1 ? 'dependency' : 'dependencies'}</span>
                                </span>
                              )}
                            </div>
                          </div>
                          <button
                            onClick={() => handleDeleteTask(task.id)}
                            className="px-3 py-1.5 text-xs text-red-600 hover:text-white hover:bg-red-500 font-medium rounded-md border border-red-500 transition-all"
                          >
                            Delete
                          </button>
                        </div>
                      ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="mt-6 text-center">
          <button
            onClick={() => navigate(`/projects/${id}/schedule`)}
            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1 text-sm flex items-center gap-2 mx-auto"
          >
            <span className="text-lg">🚀</span>
            <span>Smart Schedule Tasks</span>
          </button>
          <p className="text-xs text-gray-600 mt-2">AI-powered task scheduling for optimal productivity</p>
        </div>
      </main>

      {showAddTask && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full p-6 my-8 transform transition-all">
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              <span className="text-2xl">✨</span>
              Add New Task
            </h3>
            <form onSubmit={handleAddTask}>
              <div className="mb-4">
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  Task Title *
                </label>
                <input
                  type="text"
                  value={newTask.title}
                  onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                  className="w-full px-3 py-2 text-sm border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  placeholder="Enter task name"
                  required
                />
              </div>
              
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    Estimated Hours *
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={newTask.estimatedHours}
                      onChange={(e) => {
                        const value = e.target.value;
                        // Allow only numbers
                        if (value === '' || /^\d+$/.test(value)) {
                          setNewTask({ ...newTask, estimatedHours: value === '' ? 0 : parseInt(value) });
                        }
                      }}
                      className="w-full px-3 py-2 text-sm border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                      placeholder="0"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    Due Date
                  </label>
                  <input
                    type="date"
                    value={newTask.dueDate}
                    onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                    className="w-full px-3 py-2 text-sm border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  />
                </div>
              </div>
              
              <div className="mb-5">
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  Task Dependencies
                </label>
                <div className="border-2 border-gray-300 rounded-lg p-3 max-h-40 overflow-y-auto bg-gray-50">
                  {tasks.length === 0 ? (
                    <p className="text-xs text-gray-500 text-center py-3">No other tasks available yet</p>
                  ) : (
                    <div className="space-y-1.5">
                      {tasks.map((task) => (
                        <label key={task.id} className="flex items-center gap-2 cursor-pointer hover:bg-white p-2 rounded-md transition-all border border-transparent hover:border-blue-200">
                          <input
                            type="checkbox"
                            checked={newTask.dependencies.includes(task.title)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setNewTask({ 
                                  ...newTask, 
                                  dependencies: [...newTask.dependencies, task.title] 
                                });
                              } else {
                                setNewTask({ 
                                  ...newTask, 
                                  dependencies: newTask.dependencies.filter(d => d !== task.title) 
                                });
                              }
                            }}
                            className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                          />
                          <span className="text-xs text-gray-700 font-medium">{task.title}</span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>
                <p className="mt-1.5 text-xs text-gray-500 flex items-start gap-1">
                  <span>💡</span>
                  <span>Select tasks that must be completed before this task can start</span>
                </p>
              </div>
              
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddTask(false);
                    setNewTask({ title: '', dueDate: '', estimatedHours: 0, dependencies: [] });
                  }}
                  className="flex-1 px-4 py-2 text-sm border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  className="flex-1 px-4 py-2 text-sm bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                >
                  {creating ? 'Adding...' : 'Add Task'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectDetails;
