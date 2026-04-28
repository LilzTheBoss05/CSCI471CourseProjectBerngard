// src/components/HabitForm.jsx
import { useState } from 'react';

const HabitForm = ({ onSubmit, onCancel }) => {
  const [title, setTitle] = useState('');

  return (
    <form onSubmit={(e) => { e.preventDefault(); onSubmit({ title }); }} className="p-5 bg-zinc-800 rounded-3xl">
      <input 
        className="w-full bg-zinc-900 p-3 rounded-lg text-white mb-3"
        placeholder="Habit Name"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <button className="bg-emerald-500 w-full p-3 rounded-lg font-bold">Save Habit</button>
      <button type="button" onClick={onCancel} className="text-zinc-400 mt-2 block w-full">Cancel</button>
    </form>
  );
};

export default HabitForm;
