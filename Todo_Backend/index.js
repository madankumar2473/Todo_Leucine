import express, { json } from 'express';
import cors from 'cors';
import { config } from 'dotenv';
import router from './src/routes/todoroutes.js';
import summaryRoutes from './src/routes/summaryroutes.js';

// Load environment variables
config();

// Initialize app
const app = express();
const PORT = process.env.PORT || 3000; // Fallback to 3000 if PORT is undefined

// Middleware
app.use(cors());
app.use(express.json());
app.use('/api/todos', router); // Use the todo routes
app.use('/api/summarize', summaryRoutes); // Use the summary routes

// Basic test route
app.get('/', (req, res) => {
  res.send('Todo Summary Backend is running');
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


