import React, { useState, useContext } from 'react';
import { TextField, Button, FormControl, Select, MenuItem, Snackbar, Alert, Grid, Typography } from '@mui/material';
import { createTask } from '../api'; // Adjust this import
import { AuthContext } from '../context/AuthContext'; // Adjust this import
//import { useAuthContext } from '../hooks/useAuthContext'; // Adjust the path as necessary


const TaskForm = ({ onSubmit, initialData }) => {
    const { user } = useContext(AuthContext);
    //const { user2 } = useAuthContext(); // Get user from context
    const [title, setTitle] = useState(initialData?.title || '');
    const [description, setDescription] = useState(initialData?.description || '');
    const [dueDate, setDueDate] = useState(initialData?.dueDate || '');
    const [priority, setPriority] = useState(initialData?.priority || 'low');
    const [status, setStatus] = useState(initialData?.status || 'pending');
    const [error, setError] = useState('');

    //console.log('Checking token in localStorage:' + user.token);
    
    const resetForm = () => {
        setTitle('');
        setDescription('');
        setDueDate('');
        setPriority('low');
        setStatus('pending');
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!user) {
            setError('User is not authenticated');
            console.error('User is not authenticated');
            return; // Prevent submission if user is not authenticated
        }

        const userData = JSON.parse(localStorage.getItem('user'));
        const userid = userData ? userData.user.id : null; // Safely access the user ID
        //const userToken = userData ? userData.user.token : null; // Safely access the user ID



        //console.log('checking token: ', JSON.stringify(userToken, null, 2));
        //console.log('checking token: ' + userData)
        if (!userid) {
            setError('userid is required. Please log in again.');
            return;
        }
        const token = user.token;
        if (!token) {
            setError('Token is required. Please log in again.');
            return;
        }


        if (!title || !description || !dueDate) {
            setError('Please fill in all fields.');
            return;
        }
        //console.log('UserId: ' + userid);
        const taskData = {
            title,
            description,
            dueDate,
            priority,
            status,
            userId: userid, // Get user ID from context
        };

        try {
            const newTask = await createTask(taskData, token);

            if (onSubmit) {
                onSubmit(newTask);
            }
            resetForm();
        } catch (err) {
            setError('Failed to create task. Please try again.');
            console.error('Error creating task:', err);
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
                    <FormControl fullWidth>
                        <Select value={priority} onChange={(e) => setPriority(e.target.value)}>
                            <MenuItem value="low">Low</MenuItem>
                            <MenuItem value="medium">Medium</MenuItem>
                            <MenuItem value="high">High</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <FormControl fullWidth>
                        <Select value={status} onChange={(e) => setStatus(e.target.value)}>
                            <MenuItem value="pending">Pending</MenuItem>
                            <MenuItem value="completed">Completed</MenuItem>
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
