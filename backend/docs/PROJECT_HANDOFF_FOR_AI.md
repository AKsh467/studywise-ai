# STUDYWISE AI — COMPLETE PROJECT HANDOVER FOR AI

## 1. Project Overview

StudyWise AI is a personalized study planning assistant.

The application helps students:
- Manage subjects and topics.
- Track topic completion.
- Manage upcoming examinations.
- Set weekly study availability.
- Generate personalized study schedules.
- Calculate topic priorities.
- Receive study recommendations.
- Track study sessions and study duration.
- Monitor progress through a dashboard.

The project has two main parts:

1. Backend: Developed using Python, FastAPI, SQLAlchemy and SQLite.
2. Frontend: To be developed using React by Kartik.

The frontend must communicate with the existing backend APIs. Do not unnecessarily recreate backend business logic in React.

## 2. Instructions for the AI Coding Assistant

Before writing any code:

1. Inspect the complete project folder.
2. Read `backend/README.md`.
3. Read all files inside `backend/docs/`.
4. Inspect `backend/app/routers/` to understand actual API endpoints.
5. Inspect `backend/app/schemas/` to understand exact request and response fields.
6. Inspect `backend/app/models/` to understand database relationships.
7. Inspect `backend/app/services/` to understand the business logic.
8. Inspect `backend/tests/` to understand tested functionality.

Important rules:

- Do not invent API endpoints.
- Do not assume request fields without checking Pydantic schemas.
- Do not change backend code unless explicitly requested.
- Reuse the existing backend APIs.
- Keep frontend code organized into reusable components.
- Handle loading states, errors, empty states and successful responses.
- Do not hardcode student IDs.
- Keep the frontend and backend independently runnable.
- Ask before making major architectural changes.
- Build incrementally and verify each feature before moving to the next.

## 3. Backend Technology

- Python 3.11
- FastAPI
- SQLAlchemy
- SQLite
- Pydantic
- Pytest

Backend URL:

`http://localhost:8000`

API base URL:

`http://localhost:8000/api/v1`

Swagger documentation:

`http://localhost:8000/docs`

## 4. Backend Architecture

The backend follows a layered architecture.

| Folder | Responsibility |
|---|---|
| `app/core/` | Database and configuration |
| `app/models/` | Database models |
| `app/schemas/` | Request and response validation |
| `app/routers/` | API endpoints |
| `app/services/` | Business logic |
| `app/repositories/` | Data access layer, if implemented |
| `app/utils/` | Shared utilities, if implemented |

Important service files:

- `priority_service.py`
- `scheduling_service.py`
- `recommendation_service.py`
- `analytics_service.py`

## 5. Frontend Dashboard — Recommended Structure

Build a clean, modern student dashboard.

### A. Main Dashboard

Display:

- Welcome message
- Total study time
- Today's study time
- Weekly study time
- Overall topic completion percentage
- Study streak
- Upcoming exams
- Subject-wise progress

Backend API:

`GET /students/{student_id}/dashboard/`

### B. Subjects

Students should be able to:

- View all subjects.
- Add subjects.
- Edit subjects.
- Delete subjects.
- Open a subject to see its topics.

Backend APIs:

- `GET /students/{student_id}/subjects/`
- `POST /students/{student_id}/subjects/`
- `PUT /students/{student_id}/subjects/{subject_id}`
- `DELETE /students/{student_id}/subjects/{subject_id}`

### C. Topics

Students should be able to:

- View topics within a subject.
- Add topics.
- Edit topics.
- Delete topics.
- Mark topics as completed.
- View topic priority.

Backend APIs:

- `GET /students/{student_id}/subjects/{subject_id}/topics/`
- `POST /students/{student_id}/subjects/{subject_id}/topics/`
- `PUT /students/{student_id}/subjects/{subject_id}/topics/{topic_id}`
- `DELETE /students/{student_id}/subjects/{subject_id}/topics/{topic_id}`
- `GET /students/{student_id}/priorities/`

### D. Examinations

Students should be able to:

- Add examinations.
- Select the relevant subject.
- Enter exam dates.
- Enter total and target marks.
- Edit and delete examinations.
- View upcoming exams.

Backend APIs:

- `GET /students/{student_id}/exams/`
- `POST /students/{student_id}/exams/`
- `PUT /students/{student_id}/exams/{exam_id}`
- `DELETE /students/{student_id}/exams/{exam_id}`

### E. Weekly Availability

Students should be able to:

- Select days of the week.
- Set available start and end times.
- Edit availability.
- Delete availability.

Backend APIs:

- `GET /students/{student_id}/availability/`
- `POST /students/{student_id}/availability/`
- `PUT /students/{student_id}/availability/{availability_id}`
- `DELETE /students/{student_id}/availability/{availability_id}`

### F. Study Plans

Students should be able to:

- Create a study plan.
- Set a start date and end date.
- View existing plans.
- Edit and delete plans.

Backend APIs:

- `GET /students/{student_id}/study-plans/`
- `POST /students/{student_id}/study-plans/`
- `PUT /students/{student_id}/study-plans/{plan_id}`
- `DELETE /students/{student_id}/study-plans/{plan_id}`

### G. Study Schedule

Students should be able to:

- Select a date range.
- Generate a study schedule.
- View allocated study slots.
- See the assigned topic, subject and priority.

Backend API:

`GET /students/{student_id}/schedules/generate`

Query parameters:

- `start_date`
- `end_date`

Important: The current scheduling engine generates suggested slots but does not automatically save them as study sessions.

### H. Recommendations

Display:

- Highest-priority recommended topic.
- Suggested available study slot.
- Other pending topics.
- Recommendation message.

Backend API:

`GET /students/{student_id}/recommendations/`

### I. Study Timer / Study Sessions

Students should be able to:

- Start a study session.
- See that a session is active.
- Complete a session.
- View session duration.
- View previous study sessions.

Backend APIs:

Start:

`POST /students/{student_id}/study-sessions/start`

Complete:

`POST /students/{student_id}/study-sessions/{session_id}/complete`

History:

`GET /students/{student_id}/study-sessions/`

Only one active session per student is allowed.

### J. Student Profile

Provide a profile section showing student information.

Backend APIs:

- `POST /students/`
- `GET /students/{student_id}`
- `PUT /students/{student_id}`

## 6. API Integration Rules

All API calls must use:

`http://localhost:8000/api/v1`

Example:

```javascript
const API_BASE_URL = "http://localhost:8000/api/v1";

const response = await fetch(
  `${API_BASE_URL}/students/1/dashboard/`
);

const result = await response.json();

if (!response.ok || !result.success) {
  throw new Error(result.message || "Request failed");
}

console.log(result.data);
```

The example student ID is illustrative. Use the actual student ID returned by the backend.

Successful responses generally follow:

```json
{
  "success": true,
  "message": "Request successful",
  "data": {}
}
```

Error responses generally follow:

```json
{
  "success": false,
  "message": "Request failed",
  "detail": "Error details"
}
```

Validation errors use HTTP 422.

Always inspect the actual endpoint schema in Swagger before implementing forms.

## 7. Recommended Frontend Development Order

Build in this order:

1. Project setup and API configuration.
2. Student profile and initial student creation.
3. Dashboard layout and analytics.
4. Subject management.
5. Topic management.
6. Examination management.
7. Weekly availability management.
8. Study plans.
9. Priority display.
10. Schedule generation.
11. Recommendations.
12. Study timer and session history.
13. Final UI improvements and testing.

Do not build every screen simultaneously.

Complete and verify each feature before proceeding.

## 8. Important Backend Limitations

The current backend is a working local development backend, not a production-ready deployment.

Known limitations:

- Production authentication is not implemented.
- The frontend must currently identify the student using a student ID.
- Generated schedules are not persisted automatically.
- Scheduling uses priority-based rotation rather than workload optimization.
- Adaptive rescheduling is not fully implemented.
- SQLite is used for local development.

Do not represent these features as already implemented.

## 9. Running the Project

Backend:

```powershell
cd backend
python -m venv venv
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt
uvicorn app.main:app --reload
```

Frontend:

Use the frontend project's own setup instructions and package configuration.

The expected Vite development origin is:

`http://localhost:5173`

Backend Swagger:

`http://localhost:8000/docs`

## 10. Final Objective

Build a complete, responsive React frontend for StudyWise AI that connects to the existing FastAPI backend.

The frontend should be:
- Modern and professional.
- Easy to navigate.
- Responsive on desktop and mobile.
- Consistent in design.
- Connected to real backend data.
- Built using reusable React components.
- Functional rather than just a static UI mockup.

The final result should be a working full-stack StudyWise AI application.

Before declaring completion, test all major user flows against the running backend.