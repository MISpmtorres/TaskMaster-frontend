import React from 'react';
import { useTasks } from '../context/TaskContext';
import { Button } from '@mui/material';

const TaskItem = ({ task }) => {
  const { deleteTask } = useTasks();

  return (
    <div>
      <h3>{task.title}</h3>
      <p>{task.description}</p>
      <p>Due: {task.dueDate}</p>
      <p>Priority: {task.priority}</p>
      <Button onClick={() => deleteTask(task.id)}>Delete</Button>
    </div>
  );
};

export default TaskItem;
