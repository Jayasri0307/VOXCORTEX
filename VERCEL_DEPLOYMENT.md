# Deploying VoxCortex AI to Vercel (Universal Monorepo)

VoxCortex AI is engineered to deploy seamlessly to [Vercel](https://vercel.com) as a unified full-stack monorepo combining:
1. **Frontend**: React + Vite + TypeScript Single Page Application (built into `frontend/dist`)
2. **Backend**: Python FastAPI ASGI Serverless Function (served via `api/index.py`)

---

## 1. Zero-Config One-Click Vercel Deployment

1. Push your repository to GitHub.
2. In the [Vercel Dashboard](https://vercel.com/new), click **Import** on your repo.
3. Keep the **Root Directory** as `./` (default).
4. Vercel automatically detects the build command from root `package.json` (`cd frontend && npm install && npm run build`) and uses `frontend/dist` as the output directory.

---

## 2. Environment Variables Configuration

In **Project Settings** → **Environment Variables**, configure the following keys:

| Environment Variable | Description | Source |
|---|---|---|
| `LYZR_API_KEY` | Lyzr Studio API Key | [Lyzr Studio](https://studio.lyzr.ai) |
| `LYZR_MANAGER_AGENT_ID` | Lyzr Manager Agent UUID | Lyzr Agents |
| `LYZR_SUMMARIZER_AGENT_ID` | Lyzr Summarizer Agent UUID | Lyzr Agents |
| `LYZR_TASK_AGENT_ID` | Lyzr Task Extractor Agent UUID | Lyzr Agents |
| `LYZR_MEMORY_AGENT_ID` | Lyzr Memory Assistant Agent UUID | Lyzr Agents |
| `QDRANT_URL` | Qdrant Cloud Cluster Endpoint | [Qdrant Cloud](https://cloud.qdrant.io) |
| `QDRANT_API_KEY` | Qdrant Cloud API Key | Qdrant Cloud |
| `QDRANT_COLLECTION` | Collection name (e.g., `mindflow_memories`) | Default: `mindflow_memories` |
| `EMBEDDING_PROVIDER` | `fastembed` (default, no key needed) or `openai` | Default: `fastembed` |
| `EMBEDDING_API_KEY` | OpenAI API key (only if using `EMBEDDING_PROVIDER=openai`) | Optional |
| `OMI_WEBHOOK_SECRET` | Custom shared webhook authentication token | Optional |

> [!NOTE]
> Leave `VITE_API_BASE_URL` empty. In production, frontend API calls use same-origin relative URLs (`/api/...`, `/health`, `/omi`), which Vercel rewrites to `api/index.py`.

---

## 3. Architecture & Routing Matrix

The root [`vercel.json`](vercel.json) routes incoming requests seamlessly:

```
User Request
    │
    ├── /api/* ──────────────► api/index.py (FastAPI ASGI Serverless Function)
    ├── /health ─────────────► api/index.py
    ├── /omi & /omi/* ───────► api/index.py (Omi Hardware Webhook Ingestion)
    ├── /docs ───────────────► api/index.py (Interactive Swagger API Explorer)
    └── /* (all other) ──────► frontend/dist/index.html (React Vite SPA)
```

---

## 4. Local Development

You can run both services together or separately:

### Run Separately (Standard Local Dev)
- **FastAPI Backend**:
  ```powershell
  cd backend
  .\.venv\Scripts\Activate.ps1
  python -m uvicorn app.main:app --port 8001
  ```
- **React Vite Frontend**:
  ```powershell
  cd frontend
  npm run dev
  ```
  Vite's dev proxy forwards `/api`, `/health`, and `/omi` to `http://127.0.0.1:8001`.

### Run Unified with Vercel CLI
```bash
npm install -g vercel
vercel dev
```
