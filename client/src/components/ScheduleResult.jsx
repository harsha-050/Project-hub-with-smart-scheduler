export default function ScheduleResult({ result, onReset, tasks = [] }) {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatDateTime = (date) => {
    return new Date(date).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const getTaskHours = (taskTitle) => {
    const task = tasks.find(t => t.title === taskTitle);
    return task?.estimatedHours || 0;
  };

  const getTaskDueDate = (taskTitle) => {
    const task = tasks.find(t => t.title === taskTitle);
    return task?.dueDate;
  };

  const calculateTaskTimes = () => {
    const taskTimes = [];
    let currentTime = new Date();
    
    result.recommendedOrder.forEach((taskTitle) => {
      const hours = getTaskHours(taskTitle);
      const dueDate = getTaskDueDate(taskTitle);
      const startTime = new Date(currentTime);
      const endTime = new Date(currentTime.getTime() + hours * 60 * 60 * 1000);
      
      taskTimes.push({
        title: taskTitle,
        startTime,
        endTime,
        hours,
        dueDate
      });
      
      currentTime = endTime;
    });
    
    return taskTimes;
  };

  const taskSchedule = calculateTaskTimes();

  return (
    <div className="max-w-5xl mx-auto">
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6 rounded-lg shadow-lg mb-6">
        <h2 className="text-2xl font-bold">📅 Optimized Schedule</h2>
        <p className="text-blue-100 mt-1">AI-powered task scheduling with timeline</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-white p-5 rounded-lg shadow-md border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Total Tasks</p>
              <p className="text-3xl font-bold text-gray-800 mt-1">{result.metrics.totalTasks}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <span className="text-3xl">📋</span>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-5 rounded-lg shadow-md border-l-4 border-purple-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Total Hours</p>
              <p className="text-3xl font-bold text-gray-800 mt-1">{result.metrics.totalEstimatedHours}h</p>
            </div>
            <div className="bg-purple-100 p-3 rounded-full">
              <span className="text-3xl">⏱️</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          <span className="mr-2">🎯</span>
          Scheduled Tasks
        </h3>
        <div className="space-y-3">
          {taskSchedule.map((task, index) => (
            <div 
              key={index} 
              className="border-l-4 border-blue-500 bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-r-lg shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <span className="bg-blue-600 text-white font-bold w-8 h-8 rounded-full flex items-center justify-center text-sm shadow">
                    {index + 1}
                  </span>
                  <h4 className="font-semibold text-gray-800 text-lg">{task.title}</h4>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-semibold shadow-sm">
                    ⏳ {task.hours}h
                  </span>
                  {task.dueDate && (
                    <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-sm font-semibold shadow-sm">
                      📅 Due: {new Date(task.dueDate).toLocaleDateString()}
                    </span>
                  )}
                </div>
              </div>
              
              <div className="flex items-center space-x-4 ml-11 text-sm">
                <div className="flex items-center space-x-2 bg-green-100 px-3 py-2 rounded-lg">
                  <span className="text-green-600 font-bold">▶</span>
                  <span className="text-gray-700">
                    <span className="font-medium text-green-700">Start:</span> {formatDateTime(task.startTime)}
                  </span>
                </div>
                <div className="text-gray-400">→</div>
                <div className="flex items-center space-x-2 bg-red-100 px-3 py-2 rounded-lg">
                  <span className="text-red-600 font-bold">■</span>
                  <span className="text-gray-700">
                    <span className="font-medium text-red-700">End:</span> {formatDateTime(task.endTime)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {result.reasoning && (
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-l-4 border-amber-500 p-5 rounded-r-lg mt-6 shadow-md">
          <h3 className="text-lg font-semibold text-gray-800 mb-2 flex items-center">
            <span className="mr-2">💡</span>
            AI Scheduling Insights
          </h3>
          <p className="text-gray-700 leading-relaxed">{result.reasoning}</p>
        </div>
      )}
    </div>
  );
}
