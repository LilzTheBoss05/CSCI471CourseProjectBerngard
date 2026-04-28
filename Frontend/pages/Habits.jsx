import { useState, useEffect } from 'react';
import { apiFetch } from '../services/api';
import HabitCard from '../components/HabitCard';
import HabitForm from '../components/HabitForm';

const Habits = () => {
  const [habits, setHabits] = useState([]);
  const [loading, setLoading] = useState(true);
  // editingHabit can be null (viewing), true (creating), or an object (editing existing)
  const [editingHabit, setEditingHabit] = useState(null);

  // Fetch habits from the backend using your api service
  const loadHabits = async () => {
    try {
      const res = await apiFetch('/habits');
      if (res.ok) {
        const data = await res.json();
        setHabits(data);
      }
    } catch (err) {
      console.error('Error loading habits:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHabits();
  }, []);

  // Combined function to Create (POST) or Update (PUT)
  const handleSave = async (habitData) => {
    const isEditing = typeof editingHabit === 'object';
    const endpoint = isEditing ? `/habits/${editingHabit._id}` : '/habits';
    const method = isEditing ? 'PUT' : 'POST';

    const res = await apiFetch(endpoint, {
      method,
      body: JSON.stringify(habitData)
    });

    if (res.ok) {
      setEditingHabit(null);
      loadHabits(); // Refresh the list
    }
  };

  const handleDelete = async (id) => {
    const res = await apiFetch(`/habits/${id}`, { method: 'DELETE' });
    if (res.ok) loadHabits();
  };

  const handleToggle = async (id) => {
    const res = await apiFetch(`/habits/${id}/toggle`, { method: 'PATCH' });
    if (res.ok) loadHabits();
  };

  if (loading) return <div className="text-center mt-10 text-white">Loading your habits...</div>;

  return (
    <div className="max-w-xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-white">My Habits</h1>
      
      {editingHabit ? (
        // Form Mode
        <HabitForm 
          habit={typeof editingHabit === 'object' ? editingHabit : null} 
          onSubmit={handleSave} 
          onCancel={() => setEditingHabit(null)} 
        />
      ) : (
        // List Mode
        <>
          <button 
            onClick={() => setEditingHabit(true)} 
            className="w-full bg-emerald-600 p-4 rounded-xl text-white font-bold mb-6 hover:bg-emerald-500 transition-colors"
          >
            + Create New Habit
          </button>
          
          {habits.length === 0 ? (
            <p className="text-zinc-500 text-center">No habits found. Create your first one!</p>
          ) : (
            habits.map(h => (
              <HabitCard 
                key={h._id} 
                habit={h} 
                onEdit={() => setEditingHabit(h)}
                onToggle={() => handleToggle(h._id)} 
                onDelete={() => handleDelete(h._id)} 
              />
            ))
          )}
        </>
      )}
    </div>
  );
};

export default Habits;
