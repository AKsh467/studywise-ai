# StudyWise AI — Backend

A personalized study planning assistant that helps students manage subjects, topics, exams, study schedules, and study sessions.

## 1. Technology Stack

- Python 3.11
- FastAPI
- SQLAlchemy
- SQLite
- Pydantic
- Pytest

## 2. Project Setup

### Requirements
- Python 3.11 or later
- pip

### Clone or copy the project

Open the backend folder in VS Code.

### Create a virtual environment

```powershell
python -m venv venv
```

### Activate the virtual environment

```powershell
.\venv\Scripts\Activate.ps1
```

### Install dependencies

```powershell
pip install -r requirements.txt
```

## 3. Run the Backend

From the backend directory, run:

```powershell
uvicorn app.main:app --reload
```

Backend URL:

http://localhost:8000

Interactive API documentation:

http://localhost:8000/docs

Health check:

http://localhost:8000/health

## 4. API Base URL

All application API routes use:

`http://localhost:8000/api/v1`

## 5. Main API Modules

| Module | Purpose |
|---|---|
| Students | Student profile management |
| Subjects | Subject management |
| Topics | Topic management and completion |
| Exams | Examination management |
| Availability | Weekly study availability |
| Study Plans | Study plan management |
| Priorities | Topic priority calculation |
| Schedules | Automatic schedule generation |
| Recommendations | Personalized study recommendations |
| Study Sessions | Start, complete, and view study sessions |
| Dashboard | Study analytics and progress |

See `docs/API_CONTRACT.md` for endpoint details and request examples.

## 6. Database

The project uses SQLite and SQLAlchemy.

The local database file is:

`studywise.db`

Database tables:
- students
- subjects
- topics
- exams
- availabilities
- study_plans
- study_sessions

## 7. Run Automated Tests

Run:

```powershell
python -m pytest -v
```

The test suite currently contains six automated tests.

## 8. Project Structure

```text
backend/
├── app/
│   ├── core/
│   ├── models/
│   ├── schemas/
│   ├── routers/
│   ├── services/
│   └── repositories/
├── docs/
├── tests/
├── README.md
├── requirements.txt
├── pytest.ini
├── .env.example
└── .gitignore
```

## 9. Frontend Integration

The frontend is expected to run separately using React and Vite.

Development frontend URL:

`http://localhost:5173`

Backend API URL:

`http://localhost:8000/api/v1`

See `docs/FRONTEND_INTEGRATION.md` for integration instructions.

## 10. Development Notes

- This project currently uses local development configuration.
- No production authentication system is configured.
- Student-owned resources are scoped by student ID.
- The scheduler generates suggested slots; it does not automatically save them as study sessions.
- The dashboard calculates study statistics from completed study sessions.

## 11. Project Status

Backend development phases 1–4 are being completed.

Prepared for frontend integration by the React development team.