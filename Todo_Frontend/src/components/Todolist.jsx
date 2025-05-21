import React from 'react';
import { useTodos } from '../context/Todocontext';
import TodoItem from './TodoItem';

const TodoList = () => {
  const { todos, loading } = useTodos();

  if (loading) {
    return <div className="text-center py-4">Loading todos...</div>;
  }

  if (todos.length === 0) {
    return <div className="text-center py-4">No todos yet. Add some!</div>;
  }

  return (
    <div>
      {todos.map(todo => (
        <TodoItem key={todo.id} todo={todo} />
      ))}
    </div>
  );
};

export default TodoList;
