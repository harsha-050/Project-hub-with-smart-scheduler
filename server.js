const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Topological Sort Algorithm for Task Dependencies
function topologicalSort(tasks) {
  const taskMap = new Map();
  const inDegree = new Map();
  const adjList = new Map();

  // Initialize data structures
  tasks.forEach(task => {
    taskMap.set(task.title, task);
    inDegree.set(task.title, 0);
    adjList.set(task.title, []);
  });

  // Build adjacency list and calculate in-degrees
  tasks.forEach(task => {
    if (task.dependencies && Array.isArray(task.dependencies)) {
      task.dependencies.forEach(dep => {
        if (adjList.has(dep)) {
          adjList.get(dep).push(task.title);
          inDegree.set(task.title, inDegree.get(task.title) + 1);
        }
      });
    }
  });

  // Find all nodes with in-degree 0
  const queue = [];
  inDegree.forEach((degree, task) => {
    if (degree === 0) {
      queue.push(task);
    }
  });

  const result = [];
  
  while (queue.length > 0) {
    // Sort by due date and estimated hours for prioritization
    queue.sort((a, b) => {
      const taskA = taskMap.get(a);
      const taskB = taskMap.get(b);
      
      // First priority: due date
      if (taskA.dueDate !== taskB.dueDate) {
        return new Date(taskA.dueDate) - new Date(taskB.dueDate);
      }
      
      // Second priority: estimated hours (shorter tasks first)
      return taskA.estimatedHours - taskB.estimatedHours;
    });

    const current = queue.shift();
    result.push(current);

    // Reduce in-degree for all neighbors
    adjList.get(current).forEach(neighbor => {
      inDegree.set(neighbor, inDegree.get(neighbor) - 1);
      if (inDegree.get(neighbor) === 0) {
        queue.push(neighbor);
      }
    });
  }

  // Check for cycles
  if (result.length !== tasks.length) {
    throw new Error('Circular dependency detected in tasks');
  }

  return result;
}

// Validate task input
function validateTasks(tasks) {
  if (!Array.isArray(tasks)) {
    return { valid: false, error: 'Tasks must be an array' };
  }

  for (const task of tasks) {
    if (!task.title || typeof task.title !== 'string') {
      return { valid: false, error: 'Each task must have a valid title' };
    }
    if (!task.estimatedHours || typeof task.estimatedHours !== 'number' || task.estimatedHours <= 0) {
      return { valid: false, error: `Task "${task.title}" must have a valid estimatedHours (positive number)` };
    }
    if (!task.dueDate || isNaN(Date.parse(task.dueDate))) {
      return { valid: false, error: `Task "${task.title}" must have a valid dueDate` };
    }
    if (task.dependencies && !Array.isArray(task.dependencies)) {
      return { valid: false, error: `Task "${task.title}" dependencies must be an array` };
    }
  }

  return { valid: true };
}

// POST endpoint for scheduling tasks
app.post('/api/v1/projects/:projectId/schedule', (req, res) => {
  try {
    const { projectId } = req.params;
    const { tasks } = req.body;

    // Validate input
    if (!tasks) {
      return res.status(400).json({ error: 'Missing tasks in request body' });
    }

    const validation = validateTasks(tasks);
    if (!validation.valid) {
      return res.status(400).json({ error: validation.error });
    }

    // Generate recommended order using topological sort
    const recommendedOrder = topologicalSort(tasks);

    // Calculate scheduling metrics
    const metrics = {
      totalTasks: tasks.length,
      totalEstimatedHours: tasks.reduce((sum, task) => sum + task.estimatedHours, 0),
      earliestDueDate: tasks.reduce((earliest, task) => {
        const dueDate = new Date(task.dueDate);
        return dueDate < earliest ? dueDate : earliest;
      }, new Date(tasks[0].dueDate)),
      latestDueDate: tasks.reduce((latest, task) => {
        const dueDate = new Date(task.dueDate);
        return dueDate > latest ? dueDate : latest;
      }, new Date(tasks[0].dueDate))
    };

    // Return response
    res.json({
      projectId,
      recommendedOrder,
      metrics,
      message: 'Tasks scheduled successfully'
    });

  } catch (error) {
    console.error('Error scheduling tasks:', error);
    res.status(500).json({ 
      error: error.message || 'Internal server error while scheduling tasks' 
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Smart Scheduler API is running' });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({ 
    message: 'Welcome to Smart Scheduler API',
    version: '1.0.0',
    endpoints: {
      health: 'GET /api/health',
      schedule: 'POST /api/v1/projects/:projectId/schedule'
    }
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Smart Scheduler API running on port ${PORT}`);
  console.log(`📝 API endpoint: http://localhost:${PORT}/api/v1/projects/{projectId}/schedule`);
});
