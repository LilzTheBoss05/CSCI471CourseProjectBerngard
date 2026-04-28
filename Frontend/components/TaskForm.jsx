import { useState } from 'react';

const TaskForm = ({ onAddTask }) => {
  const [title, setTitle] = useState('');
  const [time, setTime] = useState('');
  const [duration, setDuration] = useState('');
  const [isRecurring, setIsRecurring] = useState(false);
  const [recurrenceType, setRecurrenceType] = useState('daily');
  const [recurrenceDays, setRecurrenceDays] = useState([]);
  const [recurrenceInterval, setRecurrenceInterval] = useState(1);
  const [recurrenceEndDate, setRecurrenceEndDate] = useState('');
  const [err, setErr] = useState('');

  const handleDayChange = (day) => {
    setRecurrenceDays(prev => 
      prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
    );
  };

  const doSubmit = async (e) => {
    e.preventDefault();
    
    if (title.length < 2) {
      setErr('Task name is too short');
      return;
    }

    if (!time) {
      setErr('Please set a time');
      return;
    }

    const recurrence = isRecurring ? {
      type: recurrenceType,
      days: recurrenceDays,
      interval: recurrenceInterval,
      endDate: recurrenceEndDate || undefined
    } : { type: 'none' };

    if (isRecurring) {
      // For recurring tasks, create a RecurringTask
      const recurringTask = {
        title,
        time,
        duration: duration || undefined,
        recurrence,
        startDate: new Date().toISOString().split('T')[0] // Use today's date as start
      };

      try {
        const response = await fetch('/api/recurring-tasks', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(recurringTask)
        });
        if (response.ok) {
          // Refresh tasks to show the recurring instance
          window.location.reload(); // Simple way to refresh
        } else {
          setErr('Failed to create recurring task');
          return;
        }
      } catch (error) {
        setErr('Error creating recurring task');
        return;
      }
    } else {
      // For one-time tasks
      onAddTask({ 
        title,
        time,
        duration: duration || undefined,
        recurrence
      });
    }

    // Reset form
    setTitle('');
    setTime('');
    setDuration('');
    setIsRecurring(false);
    setRecurrenceType('daily');
    setRecurrenceDays([]);
    setRecurrenceInterval(1);
    setRecurrenceEndDate('');
    setErr('');
  };

  return (
    <form onSubmit={doSubmit} className="bg-zinc-800 p-4 rounded-xl border border-zinc-700">
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label htmlFor="title" className="block text-xs mb-1">Task Title</label>
          <input 
            id="title"
            type="text" 
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-2 bg-zinc-700 rounded border-none outline-none focus:ring-1 ring-emerald-500"
            placeholder="What are we doing?"
          />
        </div>
        <div>
          <label htmlFor="time" className="block text-xs mb-1">Time</label>
          <input 
            id="time"
            type="time" 
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="w-full p-2 bg-zinc-700 rounded border-none outline-none focus:ring-1 ring-emerald-500"
          />
        </div>
      </div>

      <div className="mb-4">
        <label htmlFor="duration" className="block text-xs mb-1">Duration (optional)</label>
        <input 
          id="duration"
          type="text" 
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
          className="w-full p-2 bg-zinc-700 rounded border-none outline-none focus:ring-1 ring-emerald-500"
          placeholder="e.g., 30min"
        />
      </div>

      <div className="flex items-center gap-2 mb-4">
        <input 
          type="checkbox" 
          id="recurring"
          checked={isRecurring}
          onChange={(e) => setIsRecurring(e.target.checked)}
          className="w-4 h-4 accent-emerald-500"
        />
        <label htmlFor="recurring" className="text-xs text-zinc-400">Make this a recurring task?</label>
      </div>

      {isRecurring && (
        <div className="mb-4 p-3 bg-zinc-700 rounded">
          <div className="mb-3">
            <label className="block text-xs mb-1">Recurrence Type</label>
            <select 
              value={recurrenceType} 
              onChange={(e) => setRecurrenceType(e.target.value)}
              className="w-full p-2 bg-zinc-600 rounded border-none outline-none focus:ring-1 ring-emerald-500"
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </select>
          </div>

          {recurrenceType === 'weekly' && (
            <div className="mb-3">
              <label className="block text-xs mb-1">Days of the Week</label>
              <div className="flex flex-wrap gap-2">
                {['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].map(day => (
                  <label key={day} className="flex items-center gap-1">
                    <input 
                      type="checkbox" 
                      checked={recurrenceDays.includes(day)}
                      onChange={() => handleDayChange(day)}
                      className="accent-emerald-500"
                    />
                    <span className="text-xs capitalize">{day.slice(0,3)}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {recurrenceType === 'monthly' && (
            <div className="mb-3">
              <label className="block text-xs mb-1">Days of the Month (comma-separated)</label>
              <input 
                type="text" 
                value={recurrenceDays.join(', ')}
                onChange={(e) => setRecurrenceDays(e.target.value.split(',').map(d => d.trim()))}
                className="w-full p-2 bg-zinc-600 rounded border-none outline-none focus:ring-1 ring-emerald-500"
                placeholder="e.g., 1, 15, 30"
              />
            </div>
          )}

          <div className="grid grid-cols-2 gap-4 mb-3">
            <div>
              <label className="block text-xs mb-1">Interval</label>
              <input 
                type="number" 
                min="1"
                value={recurrenceInterval}
                onChange={(e) => setRecurrenceInterval(parseInt(e.target.value))}
                className="w-full p-2 bg-zinc-600 rounded border-none outline-none focus:ring-1 ring-emerald-500"
              />
            </div>
            <div>
              <label className="block text-xs mb-1">End Date (optional)</label>
              <input 
                type="date" 
                value={recurrenceEndDate}
                onChange={(e) => setRecurrenceEndDate(e.target.value)}
                className="w-full p-2 bg-zinc-600 rounded border-none outline-none focus:ring-1 ring-emerald-500"
              />
            </div>
          </div>
        </div>
      )}

      {err && <p className="text-red-400 text-xs mt-1">{err}</p>}
      
      <button className="w-full mt-2 bg-emerald-500 py-2 rounded font-bold hover:bg-emerald-400 transition-colors">
        Add Task
      </button>
    </form>
  );
};

export default TaskForm;
