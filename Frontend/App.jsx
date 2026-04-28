import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import Dashboard from './pages/Dashboard';
import TaskDetails from './pages/TaskDetails';
import Navbar from './components/Navbar';
import Habits from './pages/Habits'; 

function App() {
  // shared state for the main timeline tasks 
  const [tasks, setTasks] = useState([]);
  
  // this is the new inbox state for things that arent scheduled yet
  // give them a duration so the user knows how long they take
  const [inbox, setInbox] = useState([
    { id: 'i1', title: 'finish web lab', duration: '45 min' },
    { id: 'i2', title: 'call mom', duration: '10 min' },
    { id: 'i3', title: 'prep for milestone 1', duration: '1 hr' }
  ]);

  // function to yeet a task out of existence
  const deleteTask = (id) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  // function to update an existing task (like marking it done)
  const updateTask = (id, updatedData) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, ...updatedData } : t));
  };

  return (
    <Router>
      <div className="min-h-screen bg-zinc-900 text-white font-sans">
        {/* passing the inbox count so the nav button can show a badge */}
        <Navbar inboxCount={inbox.length} />
        
        {/* semantic main tag for accessibility */}
        <main className="max-w-xl mx-auto p-5">
          <Routes>
            {/* home page - now takes the inbox data too */}
            <Route 
              path="/" 
              element={
                <Dashboard 
                  tasks={tasks} 
                  setTasks={setTasks} 
                  onDelete={deleteTask} 
                  inbox={inbox} 
                />
              } 
            />
            
            {/* dynamic route using :id  */}
            <Route 
              path="/task/:id" 
              element={<TaskDetails tasks={tasks} onUpdate={updateTask} onDelete={deleteTask} />} 
            />

            {/* the habits page for tracking stuff like drinking water */}
            <Route path="/habits" element={<Habits />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
