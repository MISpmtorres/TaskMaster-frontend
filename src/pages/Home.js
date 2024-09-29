import React, { useState } from 'react';
import { Container, Typography, Button, Grid, Paper, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import TaskForm from '../components/TaskForm';
import { useAuthContext } from '../hooks/useAuthContext'; // Import the auth context

const Home = () => {
  const [open, setOpen] = useState(false);
  const { user } = useAuthContext(); // Get the user from the auth context

  const handleTaskSubmit = (taskData) => {
    // Add your logic to save the task (API call)
    console.log('Task Submitted:', taskData);
    setOpen(false); // Close the form after submission
  };

  return (
    <Container component="main" maxWidth="md" style={{ marginTop: '20px' }}>
      <Paper elevation={3} style={{ padding: '20px' }}>
        <Typography variant="h4" align="center" gutterBottom>
          Welcome to the TaskMaster!
        </Typography>
        <Typography variant="body1" align="center" paragraph>
          Your ultimate companion for productivity and organization. Manage your tasks effortlessly, set priorities, and stay on top of your deadlines. Whether you’re working on personal projects or collaborating with a team, we’re here to help you achieve your goals and boost your efficiency. 
          Let’s turn your to-do list into a done list!
        </Typography>

        {/* Conditional rendering for buttons based on authentication status */}
        {user ? (
          <Grid container spacing={2} justifyContent="center">
            <Grid item>
              <Button variant="contained" color="primary" href="/tasks">
                View Tasks
              </Button>
            </Grid>
            <Grid item>
              <Button variant="outlined" color="primary" onClick={() => setOpen(true)}>
                Add Task
              </Button>
            </Grid>
          </Grid>
        ) : (
          <Grid container spacing={2} justifyContent="center">
            <Grid item>
              <Button variant="contained" color="primary" href="/login">
                Login
              </Button>
            </Grid>
            <Grid item>
              <Button variant="outlined" color="primary" href="/signup">
                Signup
              </Button>
            </Grid>
          </Grid>
        )}
      </Paper>

      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Add New Task</DialogTitle>
        <DialogContent>
          <TaskForm onSubmit={handleTaskSubmit} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)} color="secondary">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Home;
