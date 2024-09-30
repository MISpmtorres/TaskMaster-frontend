import React from 'react';
import { Container, Typography, Button, Grid, Paper } from '@mui/material';

const Profile = () => {
  const userData = JSON.parse(localStorage.getItem('user')); // Get user data from local storage
  const user = {
    name: userData ? userData.user.name : "Guest",
    email: userData ? userData.user.email : "Not available",
    tasksCompleted: userData ? userData.user.tasksCompleted : 0,
    tasksInProgress: userData ? userData.user.tasksInProgress : 0,
  };

  return (
    <Container component="main" maxWidth="md" style={{ marginTop: '20px' }}>
      <Paper elevation={3} style={{ padding: '20px' }}>
        <Typography variant="h4" align="center" gutterBottom>
          Welcome to Your Profile, {user.name}!
        </Typography>
        <Typography variant="body1" align="center" paragraph>
          "The secret to getting ahead is getting started." – Mark Twain
        </Typography>
        
        <Grid container spacing={3} justifyContent="center">
          <Grid item xs={12} md={6}>
            <Paper elevation={2} style={{ padding: '15px', textAlign: 'center' }}>
              <Typography variant="h6">Email:</Typography>
              <Typography variant="body1">{user.email}</Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper elevation={2} style={{ padding: '15px', textAlign: 'center' }}>
              <Typography variant="h6">Task Statistics:</Typography>
              <Typography variant="body1">Tasks Completed: {user.tasksCompleted}</Typography>
              <Typography variant="body1">Tasks In Progress: {user.tasksInProgress}</Typography>
            </Paper>
          </Grid>
        </Grid>

        <Typography variant="h5" align="center" style={{ marginTop: '20px' }}>
          "Success is the sum of small efforts, repeated day in and day out." – Robert Collier
        </Typography>

        <Grid container spacing={2} justifyContent="center" style={{ marginTop: '20px' }}>
          <Grid item>
            <Button variant="contained" color="primary" href="/tasks">
              View My Tasks
            </Button>
          </Grid>
          <Grid item>
            <Button variant="outlined" color="secondary" href="/account-settings">
              Account Settings
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default Profile;
