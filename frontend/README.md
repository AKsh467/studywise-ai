# StudyWise AI — Frontend

> **Prismatic Atelier Edition** • Personalized AI-Powered Academic Planning Assistant for College Students.

StudyWise AI is a modern EdTech academic companion designed to answer four critical student questions:
1. **WHAT** should I study?
2. **WHEN** should I study?
3. **HOW MUCH** have I completed?
4. **WHAT** should I focus on next?

The application features the **Prismatic Atelier** visual identity — combining experimental editorial layouts, holographic/iridescent design systems, and 5 interactive Three.js WebGL experiences with deterministic study planning and adaptive schedule recovery.

---

## ⚡ Quick Start

### Prerequisites
- **Node.js**: `v18.0.0` or higher (Node 20+ / 22+ recommended)
- **npm**: `v9.0.0` or higher

### 1. Installation
Extract the zip package, open a terminal in the project root directory, and install dependencies:

```bash
npm install
```

### 2. Run Development Server
Start the local Vite development server with Hot Module Replacement (HMR):

```bash
npm run dev
```

Open your browser and navigate to:
```
http://localhost:5173/
```

### 3. Production Build & Preview
To create an optimized production build:

```bash
npm run build
```

To preview the built production bundle locally:

```bash
npm run preview
```

### 4. Code Quality & Linting
Run static analysis via Oxlint:

```bash
npm run lint
```

---

## 🧭 Key Features & Architecture

StudyWise AI comprises nine fully-functional, interactive modules sharing centralized application state persisted in `localStorage`:

1. **Academic Cockpit (Dashboard)** (`src/pages/Dashboard.tsx`)
   - Editorial asymmetric layout with live status indicators.
   - Interactive 3D Central Core (`Hero3DCore`) with mouse-parallax articulation.
   - Differentiated statistical collage: Syllabus Mastered Monolith, Daily Streak Pass Ticket, Nearest Evaluation Capsule, and Specimen Pill.
   - Daily focus agenda with session completion confetti and 7-day velocity stream.

2. **Curriculum & Syllabi Atlas (Academics)** (`src/pages/Academics.tsx`)
   - Specimen classification layout for active college courses.
   - Dynamic 3D Crystal Totem (`SubjectTotem3D`) reflecting course hue.
   - Concept taxonomy checklist, credit badges, and milestone examination scheduler.

3. **Time-Space Availability Matrix** (`src/pages/StudyAvailability.tsx`)
   - 7-day recurring focus matrix with daily toggle and capacity meter.
   - Cognitive workload cap controls and Pomodoro focus quantum presets.
   - Custom time-slot creator and quick archetypes (Early Dawn, Twilight, Balanced).

4. **Neural Synthesis Laboratory (AI Study Planner)** (`src/pages/StudyPlanner.tsx`)
   - Multi-step deterministic pathfinding terminal with `NeuralPlanner3D`.
   - Syllabus scope selection, horizon sprints (7, 14, 21 days), and daily hour limits.
   - Generates conflict-free study sessions with explainable rationales and one-click calendar commit.

5. **Dimensional Agenda & Sessions (Schedule)** (`src/pages/Schedule.tsx`)
   - Multi-perspective agenda: Day, Week, and List views.
   - Filter by course and completion status (Upcoming, Completed, Missed, Adapted).
   - Real-time session status toggles with celebration confetti.
   - Manual session scheduling dialog.

6. **Generative Mastery Telemetry (Progress Tracker)** (`src/pages/ProgressTracker.tsx`)
   - Multi-tiered holographic radar with `ProgressHologram3D`.
   - Course syllabus completion comparisons and 7-day velocity charts (Recharts).
   - Milestone achievement credentials for consistency and mastery.

7. **Quantum Schedule Recovery (Adaptive Planner)** (`src/pages/AdaptivePlanner.tsx`)
   - Automated breach detection for missed study blocks.
   - Dynamic 3D Warp Tunnel (`AdaptiveWarp3D`).
   - Side-by-side Before-and-After schedule rebalancing proposal with one-click application.
   - Built-in simulation trigger for live demonstrations.

8. **Curator Intelligence & Signals (AI Insights)** (`src/pages/AIInsights.tsx`)
   - Categorized diagnostic signals (Exam Alerts, Missed Blocks, Pacing, Consistency).
   - Structured guidance: *What is occurring*, *Cognitive rationale*, and direct jump actions.

9. **Student Dossier & Configuration (Profile & Settings)** (`src/pages/ProfileSettings.tsx`)
   - Academic credentials (Degree, Institution, Semester, Academic Year).
   - Workload defaults and session duration preference.
   - One-click reset to realistic sample demo data or storage clear.

10. **Global Command Palette** (`src/components/layout/CommandPalette.tsx`)
    - Press **`Ctrl + K`** (or **`Cmd + K`** on macOS) from anywhere to search courses, topics, exams, or jump instantly between modules.

---

## 🎨 Tech Stack

| Technology | Purpose |
| :--- | :--- |
| **React 19** | Component-driven declarative UI architecture |
| **TypeScript 7** | End-to-end type safety and data models |
| **Vite 8** | High-performance build tool and fast HMR |
| **Tailwind CSS v4** | Utility-first styling with `@tailwindcss/vite` |
| **Three.js** | Five custom interactive WebGL 3D scenes |
| **Recharts** | Reactive analytics visualizations and telemetry |
| **Lucide React** | Editorial iconography system |
| **Canvas Confetti** | Celebration feedback on session and plan completion |
| **date-fns** | Chronological and time calculations |

---

## 📂 Project Structure

```
StudyWise/
├── public/                 # Static assets & favicons
├── src/
│   ├── assets/             # Brand graphics & icons
│   ├── components/
│   │   ├── 3d/             # Three.js WebGL experiences
│   │   │   ├── AdaptiveWarp3D.tsx
│   │   │   ├── Hero3DCore.tsx
│   │   │   ├── NeuralPlanner3D.tsx
│   │   │   ├── ProgressHologram3D.tsx
│   │   │   └── SubjectTotem3D.tsx
│   │   ├── common/         # Badges, Modals, reusable UI elements
│   │   └── layout/         # Header, Sidebar, CommandPalette
│   ├── data/               # Realistic college mock dataset (Stanford CS)
│   ├── pages/              # Nine core module views
│   ├── services/           # Deterministic planner & adaptive algorithms
│   │   ├── adaptiveScheduler.ts
│   │   ├── analyticsService.ts
│   │   ├── plannerEngine.ts
│   │   └── recommendationEngine.ts
│   ├── store/              # Centralized Zustand-like store with localStorage persistence
│   ├── types/              # Domain models (Subject, Topic, Session, Exam)
│   ├── App.tsx             # Root application shell & routing
│   ├── index.css           # Prismatic Atelier design tokens & surfaces
│   └── main.tsx            # Application entry point
├── index.html              # HTML template with typography imports
├── package.json            # Dependencies & build scripts
├── tsconfig.json           # TypeScript configuration
├── vite.config.ts          # Vite configuration with Tailwind CSS v4 plugin
└── README.md               # Documentation & teammate guide
```

---

## 💾 Local Storage Persistence

All application data (subjects, topics, examinations, availability, study sessions, profile settings) is persisted automatically in your browser's `localStorage` under the key `studywise_academic_state_v2`. If you wish to reset back to the default Stanford CS curriculum demo state, go to **Profile & Settings** and click **"Reset to Realistic College Demo Data"**.
