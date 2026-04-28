import Task from '../models/Task.js';
import RecurringTask from '../models/RecurringTask.js';

// Helper function to check if a recurring task occurs on a given date
function occursOnDate(recurringTask, dateStr) {
  const date = new Date(dateStr);
  const startDate = new Date(recurringTask.startDate);
  const endDate = recurringTask.recurrence.endDate ? new Date(recurringTask.recurrence.endDate) : null;

  if (date < startDate || (endDate && date > endDate)) return false;

  const { type, days, interval } = recurringTask.recurrence;

  if (type === 'daily') {
    const diffTime = date - startDate;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    return diffDays % interval === 0;
  }

  if (type === 'weekly') {
    const dayOfWeek = date.toLocaleLowerCase('en-US', { weekday: 'long' });
    if (!days.includes(dayOfWeek)) return false;
    const diffTime = date - startDate;
    const diffWeeks = Math.floor(diffTime / (1000 * 60 * 60 * 24 * 7));
    return diffWeeks % interval === 0;
  }

  if (type === 'monthly') {
    const dayOfMonth = date.getDate();
    if (!days.includes(dayOfMonth.toString())) return false;
    const diffMonths = (date.getFullYear() - startDate.getFullYear()) * 12 + date.getMonth() - startDate.getMonth();
    return diffMonths % interval === 0;
  }

  return false;
}

export const createTask = async (req, res) => {
  const { title, time, date, duration, recurrence } = req.body;
  
  try {
    const task = await Task.create({
      title,
      time,
      date,
      duration,
      recurrence: recurrence || { type: 'none' },
      owner: req.user.id
    });
    res.status(201).json(task);
  } catch (err) {
    res.status(400).json({ message: 'could not create task' });
  }
};

export const getTasks = async (req, res) => {
  const { date } = req.query;
  const query = { owner: req.user.id };
  
  if (date) {
    query.date = date;
  }

  let tasks = await Task.find(query);

  if (date) {
    const recurringTasks = await RecurringTask.find({ owner: req.user.id });
    const recurringInstances = recurringTasks.filter(task => occursOnDate(task, date)).map(task => ({
      ...task.toObject(),
      date,
      isRecurring: true,
      recurringId: task._id
    }));
    tasks = [...tasks, ...recurringInstances];
  }

  res.json(tasks);
};

export const updateTask = async (req, res) => {
  const { id } = req.params;
  const { title, time, date, duration, recurrence } = req.body; 

  try {
    const task = await Task.findOneAndUpdate(
      { _id: id, owner: req.user.id },
      { title, time, date, duration, recurrence },
      { new: true }
    );

    if (!task) {
      return res.status(404).json({ message: 'task not found or u dont own it' });
    }
    
    res.json(task);
  } catch (err) {
    res.status(400).json({ message: 'couldnt update that task' });
  }
};

// Handle moving task from inbox to timeline
export const scheduleTask = async (req, res) => {
  const { id } = req.params;
  const { time, status, date } = req.body;

  try {
    const task = await Task.findOneAndUpdate(
      { _id: id, owner: req.user.id },
      { time, status: status || 'scheduled', date },
      { new: true }
    );

    if (!task) {
      return res.status(404).json({ message: 'task not found or you dont own it' });
    }

    res.json(task);
  } catch (err) {
    res.status(400).json({ message: 'could not schedule task' });
  }
};

export const deleteTask = async (req, res) => {
  const { id } = req.params;
  try {
    const task = await Task.findOneAndDelete({ _id: id, owner: req.user.id });
    if (!task) return res.status(404).json({ message: 'Task not found' });
    res.json({ message: 'Task deleted successfully' });
  } catch (err) {
    res.status(400).json({ message: 'Could not delete task' });
  }
};
