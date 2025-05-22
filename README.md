# Todo Summary Assistant

A full-stack Todo application with AI-powered summary generation and Slack integration. Built with React (Vite) for the frontend and Node.js (Express) with Supabase and Google Gemini for the backend.

#Application is deployed at this URL address - https://todoaipowered.netlify.app/


## Features

- **CRUD Todo Management:** Add, edit, complete, and delete todos.
- **AI-Powered Summaries:** Generate summaries of your pending todos using Google Gemini.
- **Slack Integration:** Send generated summaries directly to a Slack channel.
- **Persistent Storage:** Uses Supabase as the backend database.

---

## Project Structure
.vscode/ Todo_Backend/ ├── .env ├── index.js ├── package.json └── src/ ├── config/ ├── controllers/ ├── llmservice/ ├── models/ ├── routes/ └── Testcases/ Todo_Frontend/ ├── .env ├── index.html ├── package.json └── src/ ├── App.jsx ├── main.jsx ├── api/ ├── assets/ ├── components/ ├── context/ └── pages

## Prerequisites

- **Node.js** (v18+ recommended)
- **npm** (v9+ recommended)
- **Supabase** account and project
- **Slack** workspace and an incoming webhook
- **Google Gemini API** key

---

## 1. Backend Setup (`Todo_Backend`)

### Install Dependencies

```sh
cd Todo_Backend
npm install
```
Create a .env file in Todo_Backend/ with the following:
```sh
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_service_role_key
GEMINI_API_KEY=your_google_gemini_api_key
SLACK_WEBHOOK_URL=your_slack_webhook_url
PORT=5000
```

1. Get SUPABASE_URL and SUPABASE_KEY from your Supabase project settings.
2. Get GEMINI_API_KEY from Google AI Studio.
3. Set up a Slack Incoming Webhook and use its URL for SLACK_WEBHOOK_URL.

**Database Setup**
1. In Supabase, create a table named Todo with at least these columns:
    **id** (UUID or int, primary key)
    **title** (text)
    **description** (text, optional)
    **completed** (boolean, default: false)
    **created_at** (timestamp, default: now())
    **updated_at** (timestamp, nullable)
**   
Run the Backend**
```sh
npm run dev
```

The backend will start on http://localhost:5000

**## 2. Frontend Setup (Todo_Frontend)**
---
Install Dependencies
```sh
cd Todo_Frontend
npm install
```
Environment Variables

- Create a .env file in Todo_Frontend/ with the following:
- VITE_API_URL=http://localhost:5000/api
- VITE_SUPABASE_URL=your_supabase_url
- VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

- VITE_API_URL should point to your backend API.
- VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are for frontend access if needed.

**Run the Frontend**
```sh
npm run dev
```
-The frontend will start on http://localhost:5173 (default Vite port).

** 3. Usage**
---
- Open http://localhost:5173 in your browser.
- Add, edit, complete, or delete to-dos.
- Click "Generate & Send to Slack" to get an AI-generated summary of your pending todos and send it to your Slack channel.

## 4. Dependencies
---
- Backend
- **Express** - Web server
- **cors** - CORS middleware
- **dotenv** - Environment variable loader
- **@supabase/supabase-js** - Supabase client
-** @google/generative-ai** - Google Gemini API client
- **@slack/webhook** - Slack webhook integration
- **pg** - PostgreSQL client (for Supabase)
- **nodemon** - Dev server auto-reload (dev only)
- Frontend
- **react, react-dom** - UI library
- **react-router-dom** - Routing
- **axios** - HTTP client
- **react-toastify** - Toast notifications
- **@supabase/supabase-js** - (optional, for direct Supabase access)
- **@google/generative-ai** - (optional, for Gemini API)
- **Vite** - Build tool

**5. Testing**
---
- The backend includes a sample test script at src/Testcases/TestModel.js for CRUD operations.
Run with:
```sh
node src/Testcases/TestModel.js
```

**6. Troubleshooting**
---
- Ensure all environment variables are set correctly.
- Make sure your Supabase table name matches the code (Todo).
- Check the CORS settings if you have issues connecting the frontend and backend.
- For Gemini API or Slack errors, check your API keys and webhook URLs.

**7. Credits**
---
- React
- Vite
- Supabase
- Google Gemini
- Slack
---
