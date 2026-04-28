import { useEffect, useState } from 'react';
import { apiFetch } from '../services/api'; 
import TimelineItem from '../components/TimelineItem';
import TaskForm from '../components/TaskForm';

const Dashboard = ({ tasks, setTasks, inbox, setInbox, selectedDate }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Helper function to convert time string (e.g., "7:30 am") to minutes since midnight
  const parseTimeToMinutes = (timeStr) => {
    if (!timeStr) return 0;
    const [time, modifier] = timeStr.toLowerCase().split(' ');
    let [hours, minutes] = time.split(':').map(Number);
    if (modifier === 'pm' && hours !== 12) hours += 12;
    if (modifier === 'am' && hours === 12) hours = 0;
    return (hours * 60) + minutes;
  };

  // Sort tasks by time
  const sortedTasks = [...tasks].sort((a, b) => {
    return parseTimeToMinutes(a.time) - parseTimeToMinutes(b.time);
  });

  // Handle editing an inbox item
  const handleEdit = async (item) => {
    const newTitle = prompt("Edit your task:", item.title);
    if (!newTitle || newTitle === item.title) return;

    try {
      const res = await apiFetch(`/tasks/${item.id}`, {
        method: 'PUT',
        body: JSON.stringify({ ...item, title: newTitle })
      });
      if (res.ok) {
        const updatedItem = await res.json();
        setInbox(inbox.map(i => i.id === item.id ? updatedItem : i));
      }
    } catch (err) {
      console.error("Failed to edit task:", err);
    }
  };

  // Handle deleting from inbox
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this item?")) return;
    try {
      const res = await apiFetch(`/tasks/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setInbox(inbox.filter(i => i.id !== id));
      }
    } catch (err) {
      console.error("Failed to delete task:", err);
    }
  };

  // Handle creating new item in inbox
  const handleAddToInbox = async () => {
    const title = prompt("What's on your mind?");
    if (!title) return;
    try {
      const res = await apiFetch('/tasks', {
        method: 'POST',
        body: JSON.stringify({ title, status: 'inbox', date: selectedDate })
      });
      if (res.ok) {
        const newTask = await res.json();
        setInbox([...inbox, newTask]);
      }
    } catch (err) {
      console.error("Failed to add to inbox:", err);
    }
  };

  useEffect(() => {
    setLoading(false);
  }, []);

  if (loading) return <div className="flex justify-center mt-20 italic text-zinc-500 animate-pulse">getting your day ready...</div>;
  if (error) return <p className="text-red-400 text-center mt-10">{error}</p>;

  return (
    <section className="animate-in fade-in duration-500">
      
      {/* Inbox Section */}
      <div className="mb-10">
        <div className="flex justify-end mb-4">
          <button 
            onClick={handleAddToInbox}
            className="text-[10px] text-emerald-400 hover:text-emerald-300 font-bold uppercase tracking-widest"
          >
            + Add New
          </button>
        </div>

        {inbox && inbox.length > 0 && (
          <div className="flex gap-3 overflow-x-auto pb-4 no-scrollbar">
            {inbox.map(item => (
              <div 
                key={item.id} 
                className="bg-zinc-800 p-4 rounded-3xl min-w-[140px] border border-zinc-700/50 flex flex-col justify-between"
              >
                <div>
                  <p className="text-emerald-400 text-[10px] font-mono mb-1">{item.duration || '0m'}</p>
                  <h4 className="font-bold text-sm truncate">{item.title}</h4>
                </div>
                <div className="flex justify-end gap-2 mt-3">
                  <button onClick={() => handleEdit(item)} className="text-[10px] text-zinc-500 hover:text-emerald-400">Edit</button>
                  <button onClick={() => handleDelete(item.id)} className="text-[10px] text-zinc-500 hover:text-red-400">Delete</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Task Creation Form */}
      <TaskForm onAddTask={async (newTask) => {
        const res = await apiFetch('/tasks', {
          method: 'POST',
          body: JSON.stringify({ ...newTask, date: selectedDate })
        });
        if (res.ok) {
          const createdTask = await res.json();
          setTasks([...tasks, createdTask]);
        }
      }} />
      
      {/* Today's Timeline Section */}
      <div className="mt-12">
        <h2 className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest mb-8">
          today's timeline
        </h2>
        <div className="space-y-2">
          {sortedTasks.map(t => (
            <TimelineItem key={t.id} task={t} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Dashboard;
