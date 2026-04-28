import { Link } from 'react-router-dom';

const TimelineItem = ({ task }) => {
  return (
    <div className="flex gap-4 mb-2">
      <div className="flex flex-col items-center">
        {/* makes the cool dashed line from structured, its not plagiarism, i said where it's from*/}
        <div className="w-6 h-6 bg-emerald-400 rounded-full flex-shrink-0"></div>
        <div className="w-0.5 h-full bg-zinc-700 border-dashed border-l"></div>
      </div>
      
      <Link to={`/task/${task.id}`} className="bg-zinc-800 p-4 rounded-2xl flex-grow mb-6">
        <p className="text-zinc-500 text-xs">{task.time}</p>
        <h3 className="font-bold text-lg">{task.title}</h3>
      </Link>
    </div>
  );
};

export default TimelineItem;
