# VoxCortex AI — Autonomous Voice Memory & Cognitive Multi-Agent Intelligence

<p align="center">
  <img src="frontend/public/voxcortex_logo.jpg" alt="VoxCortex AI Logo" width="180" style="border-radius: 20px; box-shadow: 0 8px 32px rgba(139, 92, 246, 0.25);" />
</p>

> **A production-grade, voice-powered memory intelligence platform that captures spoken conversations, maintains persistent semantic memories in Qdrant Cloud, automatically extracts actionable tasks and deadlines, and coordinates Lyzr multi-agent reasoning to answer user queries with grounded citations.**

---

## 1. System Architecture

```mermaid
graph TD
    subgraph Ingestion & Voice Streams
        OMI["Mobile Phone App / Webhooks"] -->|POST /omi/conversation| FASTAPI["FastAPI Core (:8001)"]
        MIC["Browser Microphone Studio"] -->|Web Speech API| WEB["React 19 Dashboard UI"]
        WEB -->|POST /api/transcripts| FASTAPI
    end

    subgraph FastAPI Core
        FASTAPI --> ORCH["Agent Orchestrator"]
        ORCH --> CORR["Correlation ID & Tracing Engine"]
    end

    subgraph Multi-Agent Network (Lyzr)
        ORCH --> MGR["1. Manager Agent"]
        MGR --> SUM["2. Summarizer Agent"]
        MGR --> TSK["3. Task Extractor Agent"]
        MGR --> MEM["4. Memory Assistant Agent"]
    end

    subgraph Vector & State Storage
        ORCH --> EMB["FastEmbed / BAAI Engine (384D)"]
        EMB --> QDR["AI Memory Vault (Qdrant Cloud)"]
        ORCH --> STORE["Local /tmp Store (JSON)"]
    end

    subgraph Frontend Application (:5173)
        DASH["Overview Dashboard"] <--> FASTAPI
        CHAT["Cortex Memory Assistant (RAG)"] <--> FASTAPI
        VAULT["Voice Memory Vault & Export"] <--> FASTAPI
        TASKS["Tasks & Action Items"] <--> FASTAPI
        OMILAB["Mobile Voice Sync & Simulator"] <--> FASTAPI
        AGENTS["Agent Observability"] <--> FASTAPI
        PRIV["Settings & Governance"] <--> FASTAPI
    end
```

---

## 2. Key Features

- **Omi Wearable Sync & Simulator**: Direct webhook integration for the Omi necklace wearable and mobile app (`POST /omi/conversation`), complete with an in-app interactive test simulator, payload inspector, and copy-paste cURL/PowerShell commands.
- **In-Browser Voice Recording Studio**: Live speech recognition directly in your browser with real-time waveform animation—no external wearable required.
- **Lyzr Multi-Agent Network**:
  1. **Manager Agent**: Evaluates request classification (ingestion vs query) and routes execution to worker agents.
  2. **Summarizer Agent**: Condenses spoken transcripts into executive summaries, key topics, and verified facts.
  3. **Task Extractor Agent**: Parses dialogue for commitments, assignees, priorities, and deadlines.
  4. **Memory Assistant Agent**: RAG contextual reasoner delivering grounded answers with memory citations and similarity scores.
- **Qdrant Cloud Vector Storage**: Semantic vector retrieval filtered strictly by `user_id`, guaranteeing tenant isolation.
- **Cognitive Memory Export**: One-click download of your entire memory vault as structured JSON or as a formatted Markdown Executive Digest.
- **Universal Vercel Monorepo Deployment**: Seamlessly deployable on Vercel as a unified full-stack project (React frontend + Python serverless backend).

---

## 3. Directory Layout

```
voxcortex-ai/
├── api/
│   └── index.py                  # Vercel Serverless Function entrypoint (FastAPI)
├── frontend/                     # React 19 + Vite + TypeScript + Tailwind CSS
│   ├── src/
│   │   ├── components/
│   │   │   ├── VoxCortexLogo.tsx # Custom scalable high-tech vector logo
│   │   │   ├── Sidebar.tsx
│   │   │   ├── TopNav.tsx
│   │   │   └── NewMemoryModal.tsx# Ingest modal with live mic dictation
│   │   ├── pages/                # 7 Dashboard Workflows
│   │   │   ├── Dashboard.tsx
│   │   │   ├── ChatAssistant.tsx
│   │   │   ├── VoiceMemories.tsx # Vault with JSON/MD export
│   │   │   ├── TasksPage.tsx
│   │   │   ├── OmiSyncHub.tsx    # Omi hardware lab & simulator
│   │   │   ├── AgentControlCenter.tsx
│   │   │   └── SettingsPage.tsx
│   │   ├── services/api.ts       # Unified API client
│   │   ├── types/index.ts
│   │   └── App.tsx
│   └── package.json
├── backend/                      # Python FastAPI Backend
│   ├── app/
│   │   ├── config.py             # Pydantic Settings
│   │   ├── main.py               # FastAPI entry point & CORS
│   │   ├── models/schemas.py     # Pydantic data schemas
│   │   ├── services/
│   │   │   ├── storage.py        # Persistent atomic store
│   │   │   ├── embedding_service.py # FastEmbed / OpenAI vectors
│   │   │   ├── qdrant_service.py # Qdrant Cloud client
│   │   │   ├── lyzr_service.py   # Lyzr multi-agent API caller
│   │   │   ├── agent_orchestrator.py
│   │   │   └── omi_service.py    # Omi webhook receiver & parser
│   │   └── routers/              # REST & Webhook endpoints
│   ├── requirements.txt
│   └── .env                      # Kept private, gitignored
├── package.json                  # Root monorepo build script
├── requirements.txt              # Root Python dependencies for Vercel
├── vercel.json                   # Universal Vercel deployment routing
├── VERCEL_DEPLOYMENT.md          # Comprehensive deployment guide
└── README.md
```

---

## 4. Local Quick Start

### Prerequisites
- **Node.js** (v18+)
- **Python** (v3.10+)

### Step 1: Start Backend
```powershell
cd backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
python -m uvicorn app.main:app --reload --port 8000
```
- Interactive Swagger UI: [http://localhost:8000/docs](http://localhost:8000/docs)
- Health Check: [http://localhost:8000/health](http://localhost:8000/health)

### Step 2: Start Frontend
```powershell
cd frontend
npm install
npm run dev
```
Open **[http://localhost:5173](http://localhost:5173)** in your browser.

---

## 5. Deploying to Vercel

VoxCortex AI deploys with zero extra configuration:

1. Import your GitHub repository into [Vercel](https://vercel.com/new).
2. Keep Root Directory as `./`.
3. In **Project Settings** → **Environment Variables**, add:
   - `LYZR_API_KEY`, `LYZR_MANAGER_AGENT_ID`, `LYZR_SUMMARIZER_AGENT_ID`, `LYZR_TASK_AGENT_ID`, `LYZR_MEMORY_AGENT_ID`
   - `QDRANT_URL`, `QDRANT_API_KEY`, `QDRANT_COLLECTION`
   - `EMBEDDING_PROVIDER` (default: `fastembed`)
4. Click **Deploy**. Both the Vite frontend and FastAPI backend will build and deploy together automatically!

See [VERCEL_DEPLOYMENT.md](VERCEL_DEPLOYMENT.md) for full instructions.
