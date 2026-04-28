import { Link, NavLink } from 'react-router-dom';

const Navbar = ({ inboxCount }) => {
  // makes the buttons glow green when you are actually on that page
  // better for user feedback than just boring gray text 
  const linkStyle = ({ isActive }) => 
    isActive 
      ? "bg-zinc-800 text-emerald-400 px-3 py-1 rounded-full transition-all border border-zinc-700" 
      : "text-zinc-500 hover:text-white px-3 py-1 transition-all";

  return (
    // using semantic nav tag for accessibility 
    <nav className="p-4 flex justify-between items-center border-b border-zinc-800 sticky top-0 bg-zinc-900/80 backdrop-blur-md z-50">
      
      {/* clicking the logo always yeets you back to the main timeline */}
      <Link to="/" className="text-xl font-bold tracking-tight">
        Schedu<span className="text-emerald-500">ALL</span>
      </Link>
      
      <div className="flex items-center gap-2 text-sm font-medium">
        {/* NavLink is cracked because it knows which page is active automatically */}
        <NavLink to="/" className={linkStyle}>today</NavLink>
        
        <NavLink to="/habits" className={linkStyle}>habits</NavLink>
        
        {/* the inbox button now shows how many things you still gotta schedule */}
        <button className="flex items-center gap-2 ml-2 bg-zinc-800 hover:bg-zinc-700 px-3 py-1 rounded-lg border border-zinc-700 transition-colors">
          <span className="text-zinc-400">inbox</span>
          
          {/* only show the badge if there is actually stuff in the inbox  */}
          {inboxCount > 0 && (
            <span className="bg-emerald-500 text-black text-[10px] font-bold px-1.5 rounded-full animate-pulse">
              {inboxCount}
            </span>
          )}
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
