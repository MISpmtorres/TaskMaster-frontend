import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import { useAuthContext } from '../hooks/useAuthContext';

const Navbar = () => {
  const { user, logout } = useAuthContext();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/'); // Redirect to the home page after logout
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component={Link} to="/" style={{ flexGrow: 1, textDecoration: 'none', color: 'white' }}>
          TaskMaster
        </Typography>
        
        {user ? (
          <>
            <Button component={Link} to="/" color="inherit">Home</Button>
            <Button component={Link} to="/tasks" color="inherit">Tasks</Button>
            <Button component={Link} to="/profile" color="inherit">Profile</Button>
            <Button onClick={handleLogout} color="inherit">Logout</Button>
          </>
        ) : null} {/* Render nothing if not logged in */}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
