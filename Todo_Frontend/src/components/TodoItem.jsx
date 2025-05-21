import React from 'react';
import { useTodos } from '../context/Todocontext';

const TodoItem = ({ todo }) => {
  const { toggleComplete, removeTodo } = useTodos();

  return (
    <div className={`border p-4 mb-2 rounded ${todo.completed ? 'bg-gray-100' : ''}`}>
      <div className="flex justify-between">
        <div>
          <h3 className={`text-lg font-semibold ${todo.completed ? 'line-through text-gray-500' : ''}`}>
            {todo.title}
          </h3>
          {todo.description && (
            <p className={`text-gray-700 mt-1 ${todo.completed ? 'text-gray-400' : ''}`}>
              {todo.description}
            </p>
          )}
        </div>
        <div className="flex items-start space-x-2">
          <button
            onClick={() => toggleComplete(todo.id, todo.completed)}
            className={`px-2 py-1 rounded ${todo.completed ? 'bg-yellow-500' : 'bg-green-500'} text-white`}
          >
            {todo.completed ? 'Undo' : 'Complete'}
          </button>
          <button
            onClick={() => removeTodo(todo.id)}
            className="px-2 py-1 bg-red-500 text-white rounded"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default TodoItem;
