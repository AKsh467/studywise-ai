# StudyWise AI — Integrated Full-Stack Application

**StudyWise AI is a personalized study planning assistant designed to help college students organize, manage, and accelerate their academic preparation.**

---

## 🏛️ System Architecture

The application is fully integrated across frontend, backend, database, and scheduling engines:

```
studywise-ai/
├── backend/                  # Python 3.11 + FastAPI + SQLAlchemy + SQLite
│   ├── app/
│   │   ├── core/             # database.py, init_db.py
│   │   ├── models/           # Student, Subject, Topic, Exam, Availability, StudyPlan, StudySession
│   │   ├── routers/          # REST API endpoints (/api/v1/...)
│   │   ├── schemas/          # Pydantic v2 validation models
│   │   ├── services/         # scheduling_service, priority_service, recommendation_service, analytics_service
│   │   ├── main.py           # FastAPI application entrypoint with CORS
│   │   └── seed.py           # Database seeding script for sample student data
│   ├── docs/                 # API_CONTRACT.md, DATABASE_SCHEMA.md, PROJECT_HANDOFF_FOR_AI.md
│   ├── tests/                # Pytest integration & endpoint tests
│   ├── studywise.db          # SQLite relational database
│   ├── requirements.txt      # Python dependencies
│   └── .venv/                # Isolated Python 3.11 virtual environment
│
├── frontend/                 # React 19 + Vite + TypeScript + Tailwind CSS v4 + Three.js
│   ├── src/
│   │   ├── api/              # Full typed API client layer connecting to FastAPI
│   │   │   ├── client.ts     # Fetch wrapper with error handling & base URL
│   │   │   ├── students.ts   # Student profile endpoints
│   │   │   ├── subjects.ts   # CRUD endpoints for subjects
│   │   │   ├── topics.ts     # CRUD endpoints for topics & completion toggle
│   │   │   ├── exams.ts      # Examination management endpoints
│   │   │   ├── availability.ts # Weekly availability slots endpoints
│   │   │   ├── studyPlans.ts # Study plan creation and retrieval
│   │   │   ├── priorities.ts # Deterministic priority calculation endpoints
│   │   │   ├── schedules.ts  # Schedule generation engine endpoints
│   │   │   ├── recommendations.ts # AI study recommendation endpoints
│   │   │   ├── studySessions.ts   # Start, complete, and session history
│   │   │   ├── dashboard.ts  # Dashboard telemetry & streak analytics
│   │   │   └── index.ts      # Master API export
│   │   ├── store/
│   │   │   └── useAppStore.ts # Centralized state reactive store with automatic backend sync
│   │   ├── components/       # 3D WebGL components, layout, navigation, badges, modals
│   │   ├── pages/            # 9 interactive modules (Dashboard, Academics, Schedule, Planner, etc.)
│   │   └── types/            # TypeScript interfaces & domain types
│   ├── .env                  # VITE_API_URL=http://localhost:8000/api/v1
│   └── package.json          # Node dependencies & build scripts
│
├── start-all.bat             # 1-click launcher for both backend & frontend
├── start-all.ps1             # PowerShell 1-click launcher
├── run-backend.bat           # Run FastAPI uvicorn server (port 8000)
├── run-backend.ps1           # Run FastAPI uvicorn server (PowerShell)
├── run-frontend.bat          # Run Vite development server (port 5173)
└── run-frontend.ps1          # Run Vite development server (PowerShell)
```

---

## 🚀 Quick Start Guide

### 1. Launch Everything in One Click
Double click `start-all.bat` (or run `./start-all.ps1` in PowerShell).

This starts:
- **FastAPI Backend**: `http://localhost:8000` (Interactive Swagger Docs: `http://localhost:8000/docs`)
- **React Frontend**: `http://localhost:5173`

---

### 2. Manual Commands

#### Start Backend
```powershell
cd backend
.\.venv\Scripts\python.exe -m uvicorn app.main:app --reload --port 8000
```

#### Start Frontend
```powershell
cd frontend
npm run dev
```

---

## ⚡ Integration Highlights

1. **Automatic Backend Synchronization:**
   - On app startup, the frontend automatically connects to `http://localhost:8000/api/v1`.
   - Identifies the active student (default: `Alex Rivera`), fetches subjects, topics, upcoming exams, weekly study availability, and session streaks.
   - Shows live connection status in the header (`FastAPI API v1` live pill) with a manual 1-click refresh option.

2. **Real-time CRUD across Subjects, Topics, and Examinations:**
   - Adding a course, adding/completing a syllabus topic, or adding an examination immediately commits to SQLite database (`studywise.db`) via FastAPI endpoints.

3. **Deterministic Schedule Synthesis:**
   - In the **Neural Synthesis Laboratory (Study Planner)**, clicking "Synthesize Plan" queries the backend `GET /students/{id}/schedules/generate?start_date=...&end_date=...`.
   - The backend scheduling engine combines weekly time slots with weighted topic priority scores to produce a conflict-free study schedule.
   - Committing the plan saves the sprint to the calendar and backend study plan registry.

4. **Curator Intelligence & Signals (Recommendations):**
   - The **AI Insights** page fetches live recommendations from `GET /students/{id}/recommendations/`, prioritizing urgent topics based on exam proximity, target marks, and available weekly study blocks.

5. **Study Session Tracker & Streak Velocity:**
   - Completed study blocks sync through `POST /students/{id}/study-sessions/{session_id}/complete`.
   - Consecutively logged study sessions update the student's study streak and analytics dashboard in real time.
