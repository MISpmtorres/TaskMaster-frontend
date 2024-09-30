import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthContext } from './hooks/useAuthContext'; // Ensure this is set up correctly
import { TaskProvider } from './context/TaskContext';

// Pages & components
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Navbar from './components/Navbar';
import Tasks from './pages/Tasks';
import Profile from './pages/Profile';
import Account from './pages/AccountSettings';
import { Container } from '@mui/material';

const App = () => {
  const { user } = useAuthContext();

  return (
    <div className="App">
      <BrowserRouter>
        <Navbar />
        <div className='pages'>
          <TaskProvider>
            <Container>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/signup" element={!user ? <Signup /> : <Navigate to='/' />} />
                <Route path="/login" element={!user ? <Login /> : <Navigate to='/' />} />
                {/* <Route path="/tasks" element={!user ? <Tasks /> : <Navigate to='/' />} /> */}
                <Route path="/tasks" element={<Tasks />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/Account-settings" element={<Account />} />
              </Routes></Container>
          </TaskProvider>
          {/* Uncomment below if you want to render TaskManager when user is logged in */}
          {/* {user && <TaskManager user={user} />} */}
        </div>
      </BrowserRouter>
    </div>
  );
};

export default App;
