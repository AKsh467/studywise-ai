# StudyWise AI — API Contract

## 1. Base URL

`http://localhost:8000/api/v1`

Interactive API documentation:

`http://localhost:8000/docs`

All API requests use JSON unless otherwise specified.

## 2. Student Management APIs

Base path: `/students`

| Method | Endpoint | Description |
|---|---|---|
| POST | `/` | Create student |
| GET | `/{student_id}` | Retrieve student |
| PUT | `/{student_id}` | Update student |

Student fields:
- id
- name
- email
- created_at

Validation:
- Email addresses must be unique.

## 3. Subject Management APIs

Base path: `/students/{student_id}/subjects`

| Method | Endpoint | Description |
|---|---|---|
| POST | `/` | Create subject |
| GET | `/` | List subjects |
| GET | `/{subject_id}` | Retrieve subject |
| PUT | `/{subject_id}` | Update subject |
| DELETE | `/{subject_id}` | Delete subject |

Subject fields:
- id
- student_id
- name
- description
- color
- created_at

Subject operations are scoped to the owning student. A subject belonging to another student returns 404.

## 4. Topic Management APIs

Base path: `/students/{student_id}/subjects/{subject_id}/topics`

| Method | Endpoint | Description |
|---|---|---|
| POST | `/` | Create topic |
| GET | `/` | List topics |
| GET | `/{topic_id}` | Retrieve topic |
| PUT | `/{topic_id}` | Update topic |
| DELETE | `/{topic_id}` | Delete topic |

Topic fields:
- id
- subject_id
- name
- description
- is_completed
- created_at

The `is_completed` field tracks topic completion.

Topic operations verify that the subject belongs to the specified student.

## 5. Examination Management APIs

Base path: `/students/{student_id}/exams`

| Method | Endpoint | Description |
|---|---|---|
| POST | `/` | Create exam |
| GET | `/` | List student's exams |
| GET | `/{exam_id}` | Retrieve exam |
| PUT | `/{exam_id}` | Update exam |
| DELETE | `/{exam_id}` | Delete exam |

Exam fields:
- subject_id
- name
- exam_date
- total_marks
- target_marks

Validation:
- Subject must belong to the student.
- Total marks must be greater than zero.
- Target marks must be greater than zero.
- Target marks cannot exceed total marks.
- Exam access is restricted to its owner.

## 6. Weekly Availability Management APIs

Base path: `/students/{student_id}/availability`

| Method | Endpoint | Description |
|---|---|---|
| POST | `/` | Create availability |
| GET | `/` | List weekly availability |
| GET | `/{availability_id}` | Retrieve availability |
| PUT | `/{availability_id}` | Update availability |
| DELETE | `/{availability_id}` | Delete availability |

Fields:
- day_of_week: 0 = Monday through 6 = Sunday
- start_time
- end_time

Validation:
- Student must exist.
- End time must be later than start time.
- Availability records are scoped to their student.

## 7. Study Plan Management APIs

Base path: `/students/{student_id}/study-plans`

| Method | Endpoint | Description |
|---|---|---|
| POST | `/` | Create study plan |
| GET | `/` | List study plans |
| GET | `/{plan_id}` | Retrieve study plan |
| PUT | `/{plan_id}` | Update study plan |
| DELETE | `/{plan_id}` | Delete study plan |

Fields:
- name
- start_date
- end_date
- status (default: draft)

Validation:
- Student must exist.
- End date cannot be before start date.
- Plans are scoped to their student.

## 8. Topic Priority APIs

Endpoint:

`GET /students/{student_id}/priorities/`

Returns:
- Topic ID and name
- Subject information
- Priority score
- Priority level
- Priority explanation

Priority levels:
- High: 70 or above
- Medium: 40–69
- Low: below 40
- Completed: topic already completed

Priority calculation considers exam urgency, target marks and topic completion.

## 9. Study Schedule APIs

Endpoint:

`GET /students/{student_id}/schedules/generate`

Query parameters:
- start_date: Schedule start date (YYYY-MM-DD)
- end_date: Schedule end date (YYYY-MM-DD)

Returns generated study slots containing:
- Date
- Start time
- End time
- Topic ID
- Topic name
- Subject name
- Priority score

The scheduling engine uses student availability and topic priorities to generate suggested study slots.

Generated schedule slots are returned by the API and are not automatically saved as study sessions.

## 10. Study Recommendation APIs

Endpoint:

`GET /students/{student_id}/recommendations/`

Returns:
- Recommended topic
- Topic priority score and level
- Suggested available study slot
- Other pending topics
- Recommendation message

The recommendation engine selects the highest-priority pending topic and searches for an available slot within the next seven days.

## 11. Study Session Management APIs

Base path:

`/students/{student_id}/study-sessions`

| Method | Endpoint | Description |
|---|---|---|
| POST | `/start` | Start a study session |
| POST | `/{session_id}/complete` | Complete a study session |
| GET | `/` | Retrieve study session history |

### Start a session

Request:

```json
{
  "topic_id": 1,
  "study_plan_id": null
}
```

The study plan ID is optional.

### Complete a session

Request:

```json
{
  "ended_at": null
}
```

If `ended_at` is null, the backend records the current time.

Session fields:
- id
- student_id
- topic_id
- study_plan_id
- started_at
- ended_at
- duration_minutes
- status

Validation:
- Student and topic must exist.
- Topic must belong to the specified student.
- Study plan, if provided, must belong to the student.
- Only one active session per student is allowed.
- A session must be in progress before completion.
- End time must be after start time.

## 12. Dashboard Analytics APIs

Endpoint:

`GET /students/{student_id}/dashboard/`

Returns:
- total_study_minutes
- today_study_minutes
- weekly_study_minutes
- total_topics
- completed_topics
- pending_topics
- overall_progress_percentage
- subject_progress
- upcoming_exams
- study_streak_days

Subject progress includes:
- subject_id
- subject_name
- total_topics
- completed_topics
- progress_percentage

Upcoming exams are limited to the next five exams.

Study streak is calculated using consecutive dates with completed study sessions.

## 13. Standard Response Format

### Successful response

```json
{
  "success": true,
  "message": "Operation successful",
  "data": {}
}
```

### Error response

```json
{
  "success": false,
  "message": "Request failed",
  "detail": "Additional error information"
}
```

### Common HTTP status codes

| Status | Meaning |
|---|---|
| 200 | Successful request |
| 400 | Invalid operation |
| 404 | Resource not found or ownership mismatch |
| 409 | Duplicate resource |
| 422 | Request validation error |
| 500 | Unexpected server error |

## 14. Frontend Integration Notes

- Use the actual student ID returned by the backend.
- Use the API base URL for all requests.
- Check the HTTP status and `success` field before processing responses.
- Handle validation and resource errors appropriately.
- Only one active study session is allowed per student.
- The backend currently uses local development configuration.
- Production authentication is not implemented.

For exact request and response schemas, refer to the interactive Swagger documentation at `/docs`.