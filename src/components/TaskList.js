import React, { useEffect, useState } from 'react';
import {
  List,
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
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
import { fetchAllTasksNoAuth, deleteTask, updateTask } from '../api';
import { format, parseISO } from 'date-fns';

const priorities = ['Low', 'Medium', 'High'];
const statuses = ['Pending', 'In Progress', 'Completed'];

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [error, setError] = useState('');
  const [selectedTask, setSelectedTask] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [taskDueDate, setTaskDueDate] = useState('');
  const [taskPriority, setTaskPriority] = useState('');
  const [taskStatus, setTaskStatus] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [dueDateFilter, setDueDateFilter] = useState('');
  const [loading, setLoading] = useState(true); // New loading state

  const userData = JSON.parse(localStorage.getItem('user'));
  const userid2 = userData ? userData.user.id : null;

  useEffect(() => {
    const loadTasks = async () => {
      setLoading(true); // Start loading
      try {
        const tasksData = await fetchAllTasksNoAuth();
        const filteredTasks = tasksData.filter(task => task.userId === userid2);
        setTasks(filteredTasks);
        setFilteredTasks(filteredTasks);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false); // Stop loading
      }
    };

    if (userid2) {
      loadTasks();
    }
  }, [userid2]);

  useEffect(() => {
    const results = tasks
      .filter(task =>
        (task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          task.description.toLowerCase().includes(searchTerm.toLowerCase())) &&
        (statusFilter ? task.status === statusFilter : true) &&
        (priorityFilter ? task.priority === priorityFilter : true) &&
        (dueDateFilter ? task.dueDate === dueDateFilter : true)
      )
      .sort((a, b) => {
        const statusOrder = { 'Pending': 1, 'In Progress': 2, 'Completed': 3 };
        return statusOrder[a.status] - statusOrder[b.status];
      });

    setFilteredTasks(results);
  }, [searchTerm, tasks, statusFilter, priorityFilter, dueDateFilter]);

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
    setTaskTitle('');
    setTaskDescription('');
    setTaskDueDate('');
    setTaskPriority('');
    setTaskStatus('');
  };

  const handleUpdateTask = async () => {
    if (selectedTask) {
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

  const formatDate = (dateString) => {
    return format(parseISO(dateString), 'MMMM dd, yyyy');
  };

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" style={{ flexGrow: 1 }}>
            Task List
          </Typography>
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

      <Grid container spacing={2} style={{ padding: '16px' }}>
        <Grid item xs={12} md={4}>
          <TextField
            select
            label="Filter by Status"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            fullWidth
            margin="normal"
            variant="outlined"
          >
            <MenuItem value="">All</MenuItem>
            {statuses.map((status) => (
              <MenuItem key={status} value={status}>
                {status}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid item xs={12} md={4}>
          <TextField
            select
            label="Filter by Priority"
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            fullWidth
            margin="normal"
            variant="outlined"
          >
            <MenuItem value="">All</MenuItem>
            {priorities.map((priority) => (
              <MenuItem key={priority} value={priority}>
                {priority}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid item xs={12} md={4}>
          <TextField
            label="Filter by Due Date"
            type="date"
            value={dueDateFilter}
            onChange={(e) => setDueDateFilter(e.target.value)}
            fullWidth
            margin="normal"
            variant="outlined"
            InputLabelProps={{ shrink: true }}
          />
        </Grid>
      </Grid>

      <Typography variant="h5" gutterBottom style={{ padding: '16px' }}>
        Tasks
      </Typography>
      {loading ? (
        <CircularProgress />
      ) : filteredTasks.length > 0 ? (
        <Grid container spacing={2}>
          {filteredTasks.map((task) => (
            <Grid item xs={12} sm={6} md={4} key={task._id}>
              <Card>
                <CardContent>
                  <Typography variant="h6">{task.title}</Typography>
                  <Typography color="textSecondary" gutterBottom>
                    {`${task.description} | Due: ${formatDate(task.dueDate)} | Status: ${task.status}`}
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
            {priorities.map((option) => (
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
            {statuses.map((option) => (
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
    </>
  );
};

export default TaskList;
