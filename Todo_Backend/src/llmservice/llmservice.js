import { config } from 'dotenv';
import path from 'path';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Load environment variables
config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const generateSummary = async (todos) => {
  try {
    const pendingTodos = todos.filter(todo => !todo.completed);

    if (pendingTodos.length === 0) {
      return 'You have no pending todos. Great job!';
    }

    const todoList = pendingTodos
      .map(todo => `- ${todo.title}${todo.description ? `: ${todo.description}` : ''}`)
      .join('\n');

    const prompt = `
      Here is a list of pending todos:
      ${todoList}

      Please summarize these tasks clearly. Group similar items, highlight priorities, and suggest a good order to do them.
    `;

    const model = genAI.getGenerativeModel({ model: 'gemma-3-12b-it' });

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return text.trim();
  } catch (err) {
    console.error('Gemini LLM error:', err);
    throw new Error('Failed to generate summary with Gemini');
  }
};

export default generateSummary;
