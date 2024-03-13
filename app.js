const express = require('express');
const router = express.Router();

const tasks = [
  {
    id: '1',
    title: 'Complete Project Proposal',
    description: 'Write and submit the project proposal by the deadline.',
    dueDate: '2024-03-20',
    category: 'Work',
    priority: 'High',
    completed: false,
  },
  {
    id: '2',
    title: 'Grocery Shopping',
    description: 'Buy groceries for the week.',
    dueDate: '2024-03-15',
    category: 'Errands',
    priority: 'Medium',
    completed: false,
  },
];

// Task Creation
router.post('/tasks', (req, res) => {
  const { title, description, dueDate, category, priority } = req.body;
  const taskId = generateTaskId(); 
  const task = { id: taskId, title, description, dueDate, category, priority, completed: false };
  tasks.push(task);
  res.status(201).json(task);
});

// Task Categorization
router.put('/tasks/:taskId/category', (req, res) => {
  const taskId = req.params.taskId;
  const { category } = req.body;
  const task = findTaskById(taskId);
  if (task) {
    task.category = category;
    res.json(task);
  } else {
    res.status(404).json({ error: 'Task not found' });
  }
});

// Task Status
router.put('/tasks/:taskId/complete', (req, res) => {
  const taskId = req.params.taskId;
  const task = findTaskById(taskId);
  if (task) {
    task.completed = true;
    res.json(task);
  } else {
    res.status(404).json({ error: 'Task not found' });
  }
});

// View Tasks
router.get('/tasks', (req, res) => {
  const sortedTasks = sortTasks(req.query); 
  res.json(sortedTasks);
});

// Priority Levels
router.put('/tasks/:taskId/priority', (req, res) => {
  const taskId = req.params.taskId;
  const { priority } = req.body;
  const task = findTaskById(taskId);
  if (task) {
    task.priority = priority;
    res.json(task);
  } else {
    res.status(404).json({ error: 'Task not found' });
  }
});
function generateTaskId() {
  return Date.now().toString();
}
function findTaskById(taskId) {
  return tasks.find(task => task.id === taskId);
}

function sortTasks(query) {
    let { sortBy, sortOrder } = query;
  
    if (!sortBy || !['dueDate', 'category', 'completed'].includes(sortBy)) {
      sortBy = 'dueDate'; 
    }
  
    if (!sortOrder || !['asc', 'desc'].includes(sortOrder)) {
      sortOrder = 'asc'; 
    }
  
    return tasks.sort((a, b) => {
      const aValue = getSortValue(a, sortBy);
      const bValue = getSortValue(b, sortBy);
  
      if (sortOrder === 'asc') {
        return aValue.localeCompare(bValue);
      } else {
        return bValue.localeCompare(aValue);
      }
    });
  }
  function getSortValue(task, sortBy) {
    switch (sortBy) {
      case 'dueDate':
        return task.dueDate;
      case 'category':
        return task.category;
      case 'completed':
        return task.completed.toString();
      default:
        return '';
    }
  }
  

module.exports = router;
