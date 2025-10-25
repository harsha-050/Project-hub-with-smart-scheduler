import { useState } from 'react';
import { scheduleTasks } from '../api/scheduler';
import TaskInput from './TaskInput';
import LoadingSpinner from './LoadingSpinner';

export default function TaskForm({ onScheduleComplete, loading, setLoading }) {
  const [projectId, setProjectId] = useState('project-001');
  const [tasks, setTasks] = useState([
    {
      id: 1,
      title: 'Design API',
      estimatedHours: 5,
      dueDate: '2025-10-25',
      dependencies: []
    }
  ]);
  const [error, setError] = useState('');

  const addTask = () => {
    const newTask = {
      id: tasks.length + 1,
      title: '',
      estimatedHours: 1,
      dueDate: new Date().toISOString().split('T')[0],
      dependencies: []
    };
    setTasks([...tasks, newTask]);
  };

  const removeTask = (id) => {
    if (tasks.length === 1) return;
    setTasks(tasks.filter(task => task.id !== id));
  };

  const updateTask = (id, field, value) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, [field]: value } : task
    ));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Validate tasks
      const invalidTask = tasks.find(t => !t.title.trim() || t.estimatedHours <= 0);
      if (invalidTask) {
        throw new Error('Please fill in all task fields correctly');
      }

      // Format tasks for API
      const formattedTasks = tasks.map(task => ({
        title: task.title.trim(),
        estimatedHours: Number(task.estimatedHours),
        dueDate: task.dueDate,
        dependencies: task.dependencies
      }));

      const result = await scheduleTasks(projectId, formattedTasks);
      onScheduleComplete(result);
    } catch (err) {
      setError(err.message || 'Failed to schedule tasks');
    } finally {
      setLoading(false);
    }
  };

  const loadExampleData = () => {
    setProjectId('example-project');
    setTasks([
      {
        id: 1,
        title: 'Design API',
        estimatedHours: 5,
        dueDate: '2025-10-25',
        dependencies: []
      },
      {
        id: 2,
        title: 'Implement Backend',
        estimatedHours: 12,
        dueDate: '2025-10-28',
        dependencies: ['Design API']
      },
      {
        id: 3,
        title: 'Build Frontend',
        estimatedHours: 10,
        dueDate: '2025-10-30',
        dependencies: ['Design API']
      },
      {
        id: 4,
        title: 'End-to-End Test',
        estimatedHours: 8,
        dueDate: '2025-10-31',
        dependencies: ['Implement Backend', 'Build Frontend']
      }
    ]);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 animate-fadeIn">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4 md:mb-0">
          Project Tasks
        </h2>
        <button
          type="button"
          onClick={loadExampleData}
          className="text-blue-600 hover:text-blue-700 font-medium text-sm underline"
        >
          Load Example Data
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Project ID
          </label>
          <input
            type="text"
            value={projectId}
            onChange={(e) => setProjectId(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter project ID"
            required
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Tasks
            </label>
            <span className="text-sm text-gray-500">
              {tasks.length} task{tasks.length !== 1 ? 's' : ''}
            </span>
          </div>

          <div className="space-y-4">
            {tasks.map((task, index) => (
              <TaskInput
                key={task.id}
                task={task}
                index={index}
                allTasks={tasks}
                onUpdate={updateTask}
                onRemove={removeTask}
                canRemove={tasks.length > 1}
              />
            ))}
          </div>
        </div>

        <button
          type="button"
          onClick={addTask}
          className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-500 hover:text-blue-600 transition-colors font-medium"
        >
          + Add Another Task
        </button>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              {error}
            </div>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 rounded-lg font-semibold hover:from-blue-600 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
        >
          {loading ? (
            <>
              <LoadingSpinner />
              <span className="ml-2">Scheduling Tasks...</span>
            </>
          ) : (
            <>
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Generate Schedule
            </>
          )}
        </button>
      </form>
    </div>
  );
}
