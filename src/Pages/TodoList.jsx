import React, { useState, useEffect } from 'react';
import './css/todo.css';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import axios from 'axios';
import Alert from '@mui/material/Alert';
import CheckIcon from '@mui/icons-material/Check';

const TodoList = () => {
  const [todo, setTodo] = useState('')
  const [status, setStatus] = useState(false)
  const [todoArray, setTodoArray] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState('');

  useEffect(() => {
    getTodo();
  }, []);

  const postTodo = async () => {
    try {
      await axios.post("https://todo-server-ec2-rxqo.onrender.com/csbs/addtodo", { todo })
      setTodo('')
      setStatus(true)
      getTodo()
      setTimeout(() => setStatus(false), 3000);
    } catch (err) {
      console.error(err);
    }
  }

  const getTodo = async () => {
    try {
      const response = await axios.get('https://todo-server-ec2-rxqo.onrender.com/csbs/gettodo')
      setTodoArray(response.data)
    } catch (err) {
      console.error(err);
    }
  }

  const deleteTodo = async (id) => {
    try {
      await axios.delete(`https://todo-server-ec2-rxqo.onrender.com/csbs/deletetodo/${id}`)
      getTodo()
    } catch (err) {
      console.error(err);
    }
  }

  const startEdit = (id, currentText) => {
    setEditingId(id);
    setEditText(currentText);
  }

  const cancelEdit = () => {
    setEditingId(null);
    setEditText('');
  }

  const saveEdit = async (id) => {
    try {
      await axios.put(`https://todo-server-ec2-rxqo.onrender.com/csbs/updatetodo/${id}`, { todo: editText })
      setEditingId(null);
      setEditText('');
      getTodo()
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div className='todoList'>
      <Typography variant="h1" gutterBottom>
        Todo
      </Typography>
      <Box sx={{ width: 500, maxWidth: '100%' }} className='box'>
        <TextField fullWidth label="Enter Todo" id="todo-input " value={todo} onChange={(e) => setTodo(e.target.value)} />
        <Stack direction="row" spacing={2}>
          <Button variant="contained" className='but' onClick={postTodo}>Add Todo</Button>
        </Stack>
      </Box>

      {
        status && (
          <div style={{
            position: "fixed",
            top: "20px",
            right: "20px",
            zIndex: "9999"
          }}>
            <Alert icon={<CheckIcon fontSize="inherit" />} severity="success">
              Todo has been posted
            </Alert>
          </div>
        )
      }
      <div>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {
            todoArray.map((res) => (
              <li key={res._id} style={{ 
                display: 'flex', 
                alignItems: 'center', 
                marginBottom: '10px', 
                padding: '10px', 
                border: '1px solid #ddd', 
                borderRadius: '5px' 
              }}>
                {editingId === res._id ? (
                  <>
                    <TextField 
                      value={editText} 
                      onChange={(e) => setEditText(e.target.value)}
                      size="small"
                      style={{ flex: 1, marginRight: '10px' }}
                    />
                    <IconButton onClick={() => saveEdit(res._id)} color="primary">
                      <SaveIcon />
                    </IconButton>
                    <IconButton onClick={cancelEdit} color="secondary">
                      <CancelIcon />
                    </IconButton>
                  </>
                ) : (
                  <>
                    <h3 style={{ flex: 1, margin: 0 }}>{res.todo}</h3>
                    <IconButton onClick={() => startEdit(res._id, res.todo)} color="primary">
                      <EditIcon />
                    </IconButton>
                    <IconButton onClick={() => deleteTodo(res._id)} color="error">
                      <DeleteIcon />
                    </IconButton>
                  </>
                )}
              </li>
            ))
          }
        </ul>
      </div>
    </div>
  );
};

export default TodoList;