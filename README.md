# AI UI Generator

Describe a website in plain English, generate it with Google Gemini, edit it with follow-up instructions, run an AI code review, auto-fix issues, and download the result — all from a browser-based "AI coding platform" UI.

## Project Structure

```
ai-ui-generator/
├── frontend/     React + Vite app (http://localhost:5173)
└── backend/      Node + Express + Gemini API (http://localhost:5000)
```

Frontend and backend are **completely independent projects** with their own `package.json`, `node_modules`, and run commands. The Gemini API key lives only in `backend/.env` and is never exposed to the browser.

## Requirements

- Node.js 18+
- A Google Gemini API key ([get one here](https://aistudio.google.com/apikey))
- VS Code (or any editor/terminal)

## Step 1: Open the project

Open the `ai-ui-generator` folder in VS Code.

## Step 2: Start the backend

Open **Terminal 1**:

```bash
cd backend
npm install
```

Create a `.env` file in `backend/` (copy `backend/.env.example`):

```
GEMINI_API_KEY=your_key_here
PORT=5000
```

Then start the server:

```bash
npm start
```

You should see:

```
AI UI Generator backend running on http://localhost:5000
```

## Step 3: Start the frontend

Open **Terminal 2**:

```bash
cd frontend
npm install
npm run dev
```

Open the URL Vite prints — normally **http://localhost:5173**.

## Step 4: Try it out

1. Type a prompt, e.g. `Create a modern portfolio website for a CSE student`, or click one of the example cards.
2. Click **Generate**. The HTML/CSS/JS tabs fill in and the Live Preview updates.
3. Type an instruction like `Add a dark mode button` into the Edit-with-AI bar and click **Apply Edit**.
4. Click **AI Code Review** to have Gemini flag HTML/CSS/JS, accessibility, and responsiveness issues.
5. Click **Fix with AI** to have Gemini resolve the flagged issues automatically.
6. Click **Download Project** to get a `generated-website.zip` containing `index.html`, `style.css`, and `script.js`.

## API Endpoints (backend)

| Method | Endpoint        | Purpose                                   |
|--------|-----------------|--------------------------------------------|
| POST   | `/api/generate` | Generate a new website from a prompt       |
| POST   | `/api/edit`     | Apply a natural-language edit to the code  |
| POST   | `/api/review`   | Get an AI code review with issues          |
| POST   | `/api/fix`      | Auto-fix a given list of review issues     |
| GET    | `/api/health`   | Check server status / whether the key is set |

## Notes

- The Live Preview renders inside a **sandboxed `<iframe>`** (`sandbox="allow-scripts"`, no `allow-same-origin`), so generated code can run its own JavaScript but cannot touch the parent app, your cookies, or the filesystem.
- The backend cleans Gemini's response (strips markdown code fences, tolerates extra prose) and validates that `html`, `css`, and `javascript` are all present before returning it — invalid AI responses produce a clear error instead of broken JSON reaching the frontend.
- Common errors (missing/invalid API key, rate limits, empty prompts, malformed JSON bodies) are all caught and shown as readable toast messages in the UI rather than raw stack traces.
- `backend/.gitignore` and `frontend/.gitignore` both exclude `node_modules/`, `.env`, and `dist/`.

## Troubleshooting

| Problem | Fix |
|---|---|
| "Unable to reach the backend server" | Make sure `npm start` is running in `backend/` on port 5000. |
| "Gemini API key is not configured" | Add `GEMINI_API_KEY` to `backend/.env` and restart the backend. |
| CORS errors in the browser console | Confirm the frontend is running on `http://localhost:5173` (the backend only allows that origin by default). |
| Blank Live Preview | Generate a website first — the preview stays empty until there is code to render. |
