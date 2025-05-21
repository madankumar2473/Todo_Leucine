import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { TodoProvider } from './context/Todocontext';
import Dashboard from './pages/Dashboard';

function App() {
  return (
    <Router>
      <TodoProvider>
        <Routes>
          <Route path="/" element={<Dashboard />} />
        </Routes>
        <ToastContainer position="bottom-right" />
      </TodoProvider>
    </Router>
  );
}

export default App;
