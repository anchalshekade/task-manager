import logo from './logo.svg';
import './App.css';

import React, { useReducer, useState } from 'react';
import './App.css';

// Initial state for useReducer
const initialState = {
  tasks: [],
};

// Reducer function for managing state
const reducer = (state, action) => {
  switch (action.type) {
    case 'ADD_TASK':
      return { ...state, tasks: [...state.tasks, action.payload] };
    case 'DELETE_TASK':
      return { ...state, tasks: state.tasks.filter((_, i) => i !== action.payload) };
    case 'EDIT_TASK':
      const updatedTasks = state.tasks.map((task, i) =>
        i === action.payload.index ? action.payload.task : task
      );
      return { ...state, tasks: updatedTasks };
    default:
      return state;
  }
};

const App = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState('Low');
  const [editIndex, setEditIndex] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const addTask = () => {
    if (!title || !description || !dueDate) {
      alert('All fields are required!');
      return;
    }

    if (state.tasks.some(task => task.title === title)) {
      alert('Task title must be unique!');
      return;
    }

    const newTask = { title, description, dueDate, priority, completed: false };
    dispatch({ type: 'ADD_TASK', payload: newTask });
    resetForm();
  };

  const editTask = () => {
    if (!title || !description || !dueDate) {
      alert('All fields are required!');
      return;
    }

    const updatedTask = { title, description, dueDate, priority, completed: false };
    dispatch({ type: 'EDIT_TASK', payload: { task: updatedTask, index: editIndex } });
    resetForm();
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setDueDate('');
    setPriority('Low');
    setEditIndex(null);
  };

  const startEdit = (index) => {
    const taskToEdit = state.tasks[index];
    setTitle(taskToEdit.title);
    setDescription(taskToEdit.description);
    setDueDate(taskToEdit.dueDate);
    setPriority(taskToEdit.priority);
    setEditIndex(index);
  };

  const deleteTask = (index) => {
    dispatch({ type: 'DELETE_TASK', payload: index });
  };

  const toggleComplete = (index) => {
    const updatedTasks = state.tasks.map((task, i) =>
      i === index ? { ...task, completed: !task.completed } : task
    );
    dispatch({ type: 'EDIT_TASK', payload: { task: updatedTasks[index], index } });
  };

  const filteredTasks = state.tasks.filter(task =>
    task.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="App">
      <h1>Task Manager</h1>
      <input
        type="text"
        placeholder="Search tasks..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <div className="task-form">
        <input
          type="text"
          placeholder="Task Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          placeholder="Task Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        ></textarea>
        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
        />
        <select value={priority} onChange={(e) => setPriority(e.target.value)}>
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>
        <button onClick={editIndex !== null ? editTask : addTask}>
          {editIndex !== null ? 'Update Task' : 'Add Task'}
        </button>
      </div>
      <div className="task-list">
        <h2>Task List</h2>
        {filteredTasks.length === 0 ? (
          <p>No tasks available</p>
        ) : (
          filteredTasks.map((task, index) => (
            <div key={index} className={`task-item ${task.completed ? 'completed' : ''}`}>
              <h3>{task.title} <span>({task.priority})</span></h3>
              <p>{task.description}</p>
              <p>Due Date: {task.dueDate}</p>
              <button onClick={() => startEdit(index)}>Edit</button>
              <button onClick={() => toggleComplete(index)}>
                {task.completed ? 'Undo' : 'Complete'}
              </button>
              <button onClick={() => deleteTask(index)}>Delete</button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default App;



