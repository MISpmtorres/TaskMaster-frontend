import React, { useEffect, useState } from 'react';
import { fetchTasks, createTask } from '../api';

const ViewTasks = ({ userId }) => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({ title: '', description: '', dueDate: '', priority: 'medium', status: 'pending' });
  const [error, setError] = useState(null);

  useEffect(() => {
    const getTasks = async () => {
      try {
        const fetchedTasks = await fetchTasks(userId);
        setTasks(fetchedTasks);
      } catch (err) {
        setError(err.message);
      }
    };
    getTasks();
  }, [userId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const createdTask = await createTask({ ...newTask, userId });
      setTasks([...tasks, createdTask]);
      setNewTask({ title: '', description: '', dueDate: '', priority: 'medium', status: 'pending' });
    } catch (err) {
      setError(err.message);
    }
  };

  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h2>Your Tasks</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Title" value={newTask.title} onChange={e => setNewTask({ ...newTask, title: e.target.value })} required />
        <textarea placeholder="Description" value={newTask.description} onChange={e => setNewTask({ ...newTask, description: e.target.value })} required />
        <input type="date" value={newTask.dueDate} onChange={e => setNewTask({ ...newTask, dueDate: e.target.value })} required />
        <select value={newTask.priority} onChange={e => setNewTask({ ...newTask, priority: e.target.value })}>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
        <button type="submit">Add Task</button>
      </form>
      <ul>
        {tasks.map(task => (
          <li key={task._id}>{task.title} - {task.status}</li>
        ))}
      </ul>
    </div>
  );
};

export default ViewTasks;
