import { config } from 'dotenv';
config();
import Todo from '../models/Todo.js';

(async () => {
  try {
    console.log('\n--- Creating Todo ---');
    let newTodo;
    try {
      newTodo = await Todo.create({
        title: 'Test Task',
        description: 'Test the CRUD functionality',
      });
    } catch (error) {
      console.error('Error creating Todo:', error);
      throw error;
    }
    console.log('Created:', newTodo);

    console.log('\n--- Fetching All Todos ---');
    const allTodos = await Todo.getAll();
    console.log('Todos:', allTodos);

    console.log('\n--- Updating Todo ---');
    const updatedTodo = await Todo.update(newTodo.id, {
      title: 'Updated Test Task',
      description: 'Updated description',
      completed: true
    });
    console.log('Updated:', updatedTodo);

    console.log('\n--- Deleting Todo ---');
    const deleted = await Todo.delete(newTodo.id);
    console.log('Deleted:', deleted);

    console.log('\n--- Fetching All Todos After Delete ---');
    const todosAfterDelete = await Todo.getAll();
    console.log('Remaining Todos:', todosAfterDelete);
    
    console.log('\n✅ All tests passed.\n');
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
})();
