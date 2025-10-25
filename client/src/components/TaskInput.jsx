export default function TaskInput({ task, index, allTasks, onUpdate, onRemove, canRemove }) {
  const availableDependencies = allTasks
    .filter(t => t.id !== task.id)
    .map(t => t.title)
    .filter(title => title.trim() !== '');

  const handleDependencyChange = (e) => {
    const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
    onUpdate(task.id, 'dependencies', selectedOptions);
  };

  return (
    <div className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors bg-gray-50">
      <div className="flex items-start justify-between mb-3">
        <span className="inline-flex items-center justify-center w-8 h-8 bg-blue-500 text-white rounded-full font-semibold text-sm">
          {index + 1}
        </span>
        {canRemove && (
          <button
            type="button"
            onClick={() => onRemove(task.id)}
            className="text-red-500 hover:text-red-700 p-1"
            title="Remove task"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Task Title */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Task Title *
          </label>
          <input
            type="text"
            value={task.title}
            onChange={(e) => onUpdate(task.id, 'title', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="e.g., Design API"
            required
          />
        </div>

        {/* Estimated Hours */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Estimated Hours *
          </label>
          <input
            type="number"
            value={task.estimatedHours}
            onChange={(e) => onUpdate(task.id, 'estimatedHours', Number(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            min="0.5"
            step="0.5"
            required
          />
        </div>

        {/* Due Date */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Due Date *
          </label>
          <input
            type="date"
            value={task.dueDate}
            onChange={(e) => onUpdate(task.id, 'dueDate', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>

        {/* Dependencies */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Dependencies (optional)
          </label>
          <select
            multiple
            value={task.dependencies}
            onChange={handleDependencyChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent h-20"
          >
            {availableDependencies.length === 0 ? (
              <option disabled>No other tasks available</option>
            ) : (
              availableDependencies.map((dep, i) => (
                <option key={i} value={dep}>
                  {dep}
                </option>
              ))
            )}
          </select>
          <p className="text-xs text-gray-500 mt-1">
            Hold Ctrl/Cmd to select multiple dependencies
          </p>
        </div>
      </div>
    </div>
  );
}
