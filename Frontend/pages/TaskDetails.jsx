import { useParams, Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';

const TaskDetails = ({ tasks, onUpdate, onDelete }) => {
  // getting the id from the url (like /task/1)
  const { id } = useParams();
  const navigate = useNavigate(); 
  
  // finding the specific task in the shared state array
  const task = tasks.find(t => t.id === id);

  // local state to handle editing the title AND the time
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task?.title || '');
  const [editTime, setEditTime] = useState(task?.time || ''); // new state for time

  // if someone types a fake id in the url, it shows this error state 
  if (!task) {
    return (
      <div className="text-center mt-20">
        <p className="text-zinc-500">oops... that task doesnt exist</p>
        <Link to="/" className="text-emerald-500 underline">go back home</Link>
      </div>
    );
  }

  const handleSave = () => {
    // saving both the title and the time to the shared state
    onUpdate(id, { title: editTitle, time: editTime });
    setIsEditing(false);
  };

  const handleDelete = () => {
    onDelete(id);
    navigate('/'); // taking them back to the main timeline after deleting
  };

  return (
    <div className="mt-10 animate-in fade-in duration-500">
      <Link to="/" className="text-sm text-zinc-500 hover:text-emerald-500 transition-colors">
        ← back to schedule
      </Link>
      
      <div className="mt-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-4 h-10 bg-emerald-500 rounded-full"></div>
            {isEditing ? (
              <input 
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                className="text-4xl font-extrabold bg-transparent border-b-2 border-emerald-500 outline-none"
              />
            ) : (
              <h1 className="text-4xl font-extrabold">{task.title}</h1>
            )}
          </div>

          <div className="flex gap-2">
            {isEditing ? (
              <button onClick={handleSave} className="text-xs bg-emerald-600 px-3 py-1 rounded-lg uppercase font-bold">save</button>
            ) : (
              <button onClick={() => setIsEditing(true)} className="text-xs bg-zinc-700 px-3 py-1 rounded-lg uppercase font-bold">edit</button>
            )}
            <button onClick={handleDelete} className="text-xs bg-red-900/40 text-red-400 px-3 py-1 rounded-lg uppercase font-bold">delete</button>
          </div>
        </div>
        
        <div className="bg-zinc-800/50 p-6 rounded-3xl border border-zinc-800">
          <p className="text-zinc-400 mb-2 uppercase text-xs font-bold tracking-widest">time slot</p>
          
          {/* if editing show the time picker, otherwise show the text */}
          {isEditing ? (
            <input 
              type="time"
              value={editTime}
              onChange={(e) => setEditTime(e.target.value)}
              className="text-xl mb-4 bg-zinc-700 p-2 rounded border border-zinc-600 outline-none"
            />
          ) : (
            <p className="text-xl mb-4">{task.time}</p>
          )}

          <p className="text-zinc-400 mb-2 uppercase text-xs font-bold tracking-widest">status</p>
          <p className="text-sm mb-6">{task.repeating ? "🔄 repeats daily" : "📍 one-time task"}</p>
          
          <p className="text-zinc-400 mb-2 uppercase text-xs font-bold tracking-widest">notes</p>
          <p className="text-zinc-300 italic">
            {task.note || "no notes added for this task yet... maybe add some later?"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default TaskDetails;
