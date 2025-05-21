import React from 'react';
import TodoForm from '../components/Todoform';
import TodoList from '../components/Todolist';
import Summarybutton from '../components/summarybutton';
const Dashboard = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Todo Summary Assistant</h1>

      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-xl font-semibold mb-4">Add New Todo</h2>
        <TodoForm />
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Your Todos</h2>
        <TodoList />
      </div>

      <div className="mb-6">
           <Summarybutton />
      </div>
    </div>
  );
};

export default Dashboard;
