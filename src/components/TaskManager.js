// src/components/TaskManager.js
import React, { useEffect, useState } from 'react';
import { fetchAllTasks } from '../api';
//import TaskForm from '../components/TaskForm';
import TaskList from '../components/TaskList';
import SearchFilter from '../components/SearchFilter';

const TaskManager = ({ user }) => {
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);

  useEffect(() => {
    const loadTasks = async () => {
      if (user) {
        //const token = localStorage.getItem('token');
        //const token = localStorage.getItem('token');
        //console.log('Taskmanager token kanu: ' + token)
        const token = '66f299b93ce6379aa5a72946';
        const tasks = await fetchAllTasks(token);
        setTasks(tasks);
        setFilteredTasks(tasks);
      }
    };
    loadTasks();
  }, [user]);
  //console.log('Taskmanager user kanu: ' + user)
  //token = '66f299b93ce6379aa5a72946';
  const handleSearch = (query) => {
    const lowercasedQuery = query.toLowerCase();
    const filtered = tasks.filter(task =>
      task.title.toLowerCase().includes(lowercasedQuery) ||
      task.description.toLowerCase().includes(lowercasedQuery)
    );
    setFilteredTasks(filtered);
  };

  //const handleTaskSubmit = (newTask) => {
  //  setTasks([...tasks, newTask]);
  //  setFilteredTasks([...tasks, newTask]);
  //};

  const handleTaskDelete = (taskId) => {
    setTasks(tasks.filter(task => task._id !== taskId));
    setFilteredTasks(filteredTasks.filter(task => task._id !== taskId));
  };

  return (
    <>
      <h1>Manage Tasks</h1>
      {/* <TaskForm onSubmit={handleTaskSubmit} /> */}
      <SearchFilter onSearch={handleSearch} />
      <TaskList tasks={filteredTasks} onDelete={handleTaskDelete} />
    </>
  );
};

export default TaskManager;
