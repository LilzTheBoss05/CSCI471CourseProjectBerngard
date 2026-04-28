import RecurringTask from '../models/RecurringTask.js';

export const createRecurringTask = async (req, res) => {
  const { title, time, duration, recurrence, startDate } = req.body;

  try {
    const recurringTask = await RecurringTask.create({
      title,
      time,
      duration,
      recurrence,
      startDate,
      owner: req.user.id
    });
    res.status(201).json(recurringTask);
  } catch (err) {
    res.status(400).json({ message: 'Could not create recurring task' });
  }
};

export const getRecurringTasks = async (req, res) => {
  const recurringTasks = await RecurringTask.find({ owner: req.user.id });
  res.json(recurringTasks);
};

export const updateRecurringTask = async (req, res) => {
  const { id } = req.params;
  const { title, time, duration, recurrence, startDate } = req.body;

  try {
    const task = await RecurringTask.findOneAndUpdate(
      { _id: id, owner: req.user.id },
      { title, time, duration, recurrence, startDate },
      { new: true }
    );

    if (!task) {
      return res.status(404).json({ message: 'Recurring task not found' });
    }

    res.json(task);
  } catch (err) {
    res.status(400).json({ message: 'Could not update recurring task' });
  }
};

export const deleteRecurringTask = async (req, res) => {
  const { id } = req.params;

  try {
    const task = await RecurringTask.findOneAndDelete({ _id: id, owner: req.user.id });

    if (!task) {
      return res.status(404).json({ message: 'Recurring task not found' });
    }

    res.json({ message: 'Recurring task deleted' });
  } catch (err) {
    res.status(400).json({ message: 'Could not delete recurring task' });
  }
};
