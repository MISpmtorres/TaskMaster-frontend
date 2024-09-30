import React, { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  CardActions,
  IconButton,
  Typography,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  AppBar,
  Toolbar,
  InputBase,
  CircularProgress,
  Grid,
  Container,
  Box,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
import { fetchAllTasksNoAuth, deleteTask, updateTask, createTask } from '../api';
import { format, parseISO } from 'date-fns';

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [error, setError] = useState('');
  const [selectedTask, setSelectedTask] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [taskDueDate, setTaskDueDate] = useState('');
  const [taskPriority, setTaskPriority] = useState('');
  const [taskStatus, setTaskStatus] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('');
  const [filterPriority, setFilterPriority] = useState('');
  const [filterDueDate, setFilterDueDate] = useState('');

  const userData = JSON.parse(localStorage.getItem('user'));
  const userid2 = userData ? userData.user.id : null;

  useEffect(() => {
    const loadTasks = async () => {
      setLoading(true);
      try {
        const tasksData = await fetchAllTasksNoAuth();
        const filteredTasks = tasksData.filter(task => task.userId === userid2);
        setTasks(filteredTasks);
        setFilteredTasks(filteredTasks);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (userid2) {
      loadTasks();
    }
  }, [userid2]);

  useEffect(() => {
    const results = tasks.filter(task => {
      const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = !filterStatus || filterStatus === '' || task.status === filterStatus;
      const matchesPriority = !filterPriority || filterPriority === '' || task.priority === filterPriority;
      const matchesDueDate = !filterDueDate || (task.dueDate && parseISO(task.dueDate).toISOString().split('T')[0] === filterDueDate);

      return matchesSearch && matchesStatus && matchesPriority && matchesDueDate;
    });

    setFilteredTasks(results);
  }, [searchTerm, tasks, filterStatus, filterPriority, filterDueDate]);

  const handleDelete = async (taskId) => {
    try {
      await deleteTask(taskId);
      setTasks(tasks.filter(task => task._id !== taskId));
    } catch (err) {
      setError(err.message);
    }
  };

  const handleTaskClick = (task) => {
    setSelectedTask(task);
    setTaskTitle(task.title);
    setTaskDescription(task.description);
    setTaskDueDate(task.dueDate ? parseISO(task.dueDate).toISOString().split('T')[0] : '');
    setTaskPriority(task.priority);
    setTaskStatus(task.status);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedTask(null);
    resetTaskFields();
  };

  const handleCloseCreateDialog = () => {
    setOpenCreateDialog(false);
    resetTaskFields();
  };

  const resetTaskFields = () => {
    setTaskTitle('');
    setTaskDescription('');
    setTaskDueDate('');
    setTaskPriority('');
    setTaskStatus('');
  };

  const validateTaskFields = () => {
    return taskTitle && taskDescription && taskDueDate && taskPriority && taskStatus;
  };

  const handleUpdateTask = async () => {
    if (selectedTask) {
      if (!validateTaskFields()) {
        setError('Please fill in all fields.');
        return;
      }
      try {
        await updateTask(selectedTask._id, {
          title: taskTitle,
          description: taskDescription,
          dueDate: taskDueDate,
          priority: taskPriority,
          status: taskStatus,
        });
        setTasks(tasks.map(task =>
          task._id === selectedTask._id
            ? { ...task, title: taskTitle, description: taskDescription, dueDate: taskDueDate, priority: taskPriority, status: taskStatus }
            : task
        ));
        handleCloseDialog();
      } catch (err) {
        setError(err.message);
      }
    }
  };

  const handleCreateTask = async () => {
    if (!validateTaskFields()) {
      setError('Please fill in all fields.');
      return;
    }
    try {
      const newTask = {
        title: taskTitle,
        description: taskDescription,
        dueDate: taskDueDate,
        priority: taskPriority,
        status: taskStatus,
        userId: userid2
      };
      const createdTask = await createTask(newTask);
      setTasks([...tasks, createdTask]);
      handleCloseCreateDialog();
    } catch (err) {
      setError(err.message);
    }
  };

  const formatDate = (dateString) => {
    return format(parseISO(dateString), 'MMMM dd, yyyy');
  };

  return (
    <Container maxWidth="lg">
      <AppBar position="sticky">
        <Toolbar>
          <Typography variant="h6" style={{ flexGrow: 1 }}>
            Task List
          </Typography>
          <Button color="inherit" onClick={() => setOpenCreateDialog(true)}>New Task</Button>
          <div style={{ position: 'relative', marginRight: '16px' }}>
            <SearchIcon style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} />
            <InputBase
              placeholder="Search…"
              inputProps={{ 'aria-label': 'search' }}
              style={{ paddingLeft: '36px', border: '1px solid white', borderRadius: '4px', color: 'white' }}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </Toolbar>
      </AppBar>

      <Box my={4}>
        <Typography variant="h5" gutterBottom>
          Tasks
        </Typography>
        <Box mb={2}>
          <TextField
            select
            label="Status"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            fullWidth
            margin="dense"
            variant="outlined"
          >
            <MenuItem value="">All</MenuItem>
            {['Pending', 'In Progress', 'Completed'].map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            select
            label="Priority"
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            fullWidth
            margin="dense"
            variant="outlined"
          >
            <MenuItem value="">All</MenuItem>
            {['Low', 'Medium', 'High'].map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            type="date"
            label="Due Date"
            value={filterDueDate}
            onChange={(e) => setFilterDueDate(e.target.value)}
            fullWidth
            margin="dense"
            variant="outlined"
            InputLabelProps={{
              shrink: true,
            }}
          />
        </Box>

        {loading ? (
          <CircularProgress />
        ) : filteredTasks.length > 0 ? (
          <Grid container spacing={3}>
            {filteredTasks.map((task) => (
              <Grid item xs={12} sm={6} md={4} key={task._id}>
                <Card elevation={3} style={{ transition: '0.3s', '&:hover': { boxShadow: '0 4px 20px rgba(0,0,0,0.2)' } }}>
                  <CardContent>
                    <Typography variant="h6">{task.title}</Typography>
                    <Typography color="textSecondary" gutterBottom>
                      {`${task.description} | Due: ${formatDate(task.dueDate)} | Status: ${task.status} | Priority: ${task.priority}`}
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button size="small" onClick={() => handleTaskClick(task)}>Edit</Button>
                    <IconButton edge="end" onClick={(e) => { e.stopPropagation(); handleDelete(task._id); }}>
                      <DeleteIcon />
                    </IconButton>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Typography>No tasks found.</Typography>
        )}
      </Box>

      <Snackbar open={!!error} autoHideDuration={6000} onClose={() => setError('')}>
        <Alert onClose={() => setError('')} severity="error">
          {error}
        </Alert>
      </Snackbar>

      {/* Dialog for Updating Task Details */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Update Task</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Task Title"
            type="text"
            fullWidth
            variant="outlined"
            value={taskTitle}
            onChange={(e) => setTaskTitle(e.target.value)}
          />
          <TextField
            margin="dense"
            label="Task Description"
            type="text"
            fullWidth
            variant="outlined"
            multiline
            rows={4}
            value={taskDescription}
            onChange={(e) => setTaskDescription(e.target.value)}
          />
          <TextField
            margin="dense"
            label="Due Date"
            type="date"
            fullWidth
            variant="outlined"
            value={taskDueDate}
            onChange={(e) => setTaskDueDate(e.target.value)}
            InputLabelProps={{
              shrink: true,
            }}
          />
          <TextField
            select
            label="Priority"
            value={taskPriority}
            onChange={(e) => setTaskPriority(e.target.value)}
            fullWidth
            margin="dense"
            variant="outlined"
          >
            {['Low', 'Medium', 'High'].map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            select
            label="Status"
            value={taskStatus}
            onChange={(e) => setTaskStatus(e.target.value)}
            fullWidth
            margin="dense"
            variant="outlined"
          >
            {['Pending', 'In Progress', 'Completed'].map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={handleUpdateTask} color="primary">
            Update
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog for Creating New Task */}
      <Dialog open={openCreateDialog} onClose={handleCloseCreateDialog}>
        <DialogTitle>Create New Task</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Task Title"
            type="text"
            fullWidth
            variant="outlined"
            value={taskTitle}
            onChange={(e) => setTaskTitle(e.target.value)}
          />
          <TextField
            margin="dense"
            label="Task Description"
            type="text"
            fullWidth
            variant="outlined"
            multiline
            rows={4}
            value={taskDescription}
            onChange={(e) => setTaskDescription(e.target.value)}
          />
          <TextField
            margin="dense"
            label="Due Date"
            type="date"
            fullWidth
            variant="outlined"
            value={taskDueDate}
            onChange={(e) => setTaskDueDate(e.target.value)}
            InputLabelProps={{
              shrink: true,
            }}
          />
          <TextField
            select
            label="Priority"
            value={taskPriority}
            onChange={(e) => setTaskPriority(e.target.value)}
            fullWidth
            margin="dense"
            variant="outlined"
          >
            {['Low', 'Medium', 'High'].map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            select
            label="Status"
            value={taskStatus}
            onChange={(e) => setTaskStatus(e.target.value)}
            fullWidth
            margin="dense"
            variant="outlined"
          >
            {['Pending', 'In Progress', 'Completed'].map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseCreateDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={handleCreateTask} color="primary">
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default TaskList;
