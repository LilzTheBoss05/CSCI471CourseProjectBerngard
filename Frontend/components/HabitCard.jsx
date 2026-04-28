// src/components/HabitCard.jsx
const HabitCard = ({ habit, onEdit, onToggle, onDelete }) => {
  return (
    <div className="bg-zinc-800 p-5 rounded-3xl mb-4 border border-zinc-700 flex justify-between items-center">
      <div>
        <h3 className="text-white text-lg font-bold">{habit.title}</h3>
        <p className="text-zinc-400 text-sm capitalize">{habit.frequency}</p>
      </div>
      
      <div className="flex gap-2">
        <button onClick={onToggle} className="text-emerald-400">Done</button>
        <button onClick={onEdit} className="text-blue-400">Edit</button>
        <button onClick={onDelete} className="text-red-400">Delete</button>
      </div>
    </div>
  );
};

export default HabitCard;
