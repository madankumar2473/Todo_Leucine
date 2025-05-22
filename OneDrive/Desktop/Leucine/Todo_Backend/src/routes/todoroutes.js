import express from 'express';
const router = express.Router();
// const todoController = require('../controllers/todoController');
import {getAllTodos,createTodo,updateTodo,deleteTodo} from '../controllers/Todocontroller.js';

// CRUD endpoints
router.get('/', getAllTodos);
router.post('/', createTodo);
router.put('/:id', updateTodo);
router.delete('/:id', deleteTodo);

export default router;
