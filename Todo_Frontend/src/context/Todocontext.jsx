import React, { createContext, useState, useEffect, useContext } from 'react';
import { getAllTodos, createTodo, updateTodo, deleteTodo } from '../api/Todoapi';
import { toast } from 'react-toastify';

const TodoContext = createContext();

export const useTodos = () => useContext(TodoContext);

export const TodoProvider = ({ children }) => {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      setLoading(true);
      const data = await getAllTodos();
      setTodos(data);
    } catch (error) {
      toast.error('Failed to fetch todos');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const addTodo = async (todoData) => {
    try {
      const newTodo = await createTodo(todoData);
      setTodos([newTodo, ...todos]);
      toast.success('Todo added');
    } catch (error) {
      toast.error('Failed to add todo');
      console.error(error);
    }
  };

  const editTodo = async (id, todoData) => {
    try {
      const updated = await updateTodo(id, todoData);
      setTodos(todos.map(todo => todo.id === id ? updated : todo));
      toast.success('Todo updated');
    } catch (error) {
      toast.error('Failed to update todo');
      console.error(error);
    }
  };

  const removeTodo = async (id) => {
    try {
      await deleteTodo(id);
      setTodos(todos.filter(todo => todo.id !== id));
      toast.success('Todo deleted');
    } catch (error) {
      toast.error('Failed to delete todo');
      console.error(error);
    }
  };

  const toggleComplete = async (id, completed) => {
    return editTodo(id, { completed: !completed });
  };

  return (
    <TodoContext.Provider value={{
      todos,
      loading,
      addTodo,
      editTodo,
      removeTodo,
      toggleComplete,
      fetchTodos
    }}>
      {children}
    </TodoContext.Provider>
  );
};
