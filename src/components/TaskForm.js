import React, { useState, useContext } from 'react';
import {
  TextField,
  Button,
  FormControl,
  Select,
  MenuItem,
  Snackbar,
  Alert,
  Grid,
  Typography,
  InputLabel,
} from '@mui/material';
import { createTask } from '../api';
import { AuthContext } from '../context/AuthContext';

const TaskForm = ({ onSubmit, initialData }) => {
  const { user } = useContext(AuthContext);
  const [title, setTitle] = useState(initialData?.title || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [dueDate, setDueDate] = useState(initialData?.dueDate || '');
  const [priority, setPriority] = useState(initialData?.priority || 'Low');
  const [status, setStatus] = useState(initialData?.status || 'Pending');
  const [error, setError] = useState('');

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setDueDate('');
    setPriority('Low');
    setStatus('Pending');
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!user) {
      setError('User is not authenticated');
      return;
    }

    const userData = JSON.parse(localStorage.getItem('user'));
    const userid = userData ? userData.user.id : null;

    if (!userid) {
      setError('User ID is required. Please log in again.');
      return;
    }

    if (!title || !description || !dueDate || !priority || !status) {
      setError('Please fill in all fields.');
      return;
    }

    const taskData = {
      title,
      description,
      dueDate,
      priority,
      status,
      userId: userid,
    };

    try {
      const newTask = await createTask(taskData);
      if (onSubmit) {
        onSubmit(newTask);
      }
      resetForm();
    } catch (err) {
      setError('Failed to create task. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ margin: '20px' }}>
      <Typography variant="h6" gutterBottom>
        Create a New Task
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            label="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            fullWidth
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            multiline
            rows={4}
            fullWidth
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Due Date"
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            required
            fullWidth
            InputLabelProps={{ shrink: true }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth variant="outlined" required>
            <InputLabel>Priority</InputLabel>
            <Select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              label="Priority"
              required
            >
              <MenuItem value="Low">Low</MenuItem>
              <MenuItem value="Medium">Medium</MenuItem>
              <MenuItem value="High">High</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth variant="outlined" required>
            <InputLabel>Status</InputLabel>
            <Select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              label="Status"
              required
            >
              <MenuItem value="Pending">Pending</MenuItem>
              <MenuItem value="In Progress">In Progress</MenuItem>
              <MenuItem value="Completed">Completed</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <Button type="submit" variant="contained" color="primary" style={{ marginRight: '10px' }}>
            Save Task
          </Button>
          <Button type="button" onClick={resetForm} variant="outlined" color="secondary">
            Reset
          </Button>
        </Grid>
      </Grid>
      <Snackbar open={!!error} autoHideDuration={6000} onClose={() => setError('')}>
        <Alert onClose={() => setError('')} severity="error">{error}</Alert>
      </Snackbar>
    </form>
  );
};

export default TaskForm;
