## Phase 3.2 — Priority Calculation

Priority score = Exam Urgency + Target Marks Ambition + Completion Score.

Exam urgency:
- 0–3 days: 60
- 4–7 days: 50
- 8–14 days: 40
- 15–30 days: 25
- More than 30 days: 10
- No upcoming exam: 10

Target marks ambition:
- Target percentage / 5, capped at 20.

Completion:
- Incomplete topic: 20
- Completed topic: score 0 overall.

Priority levels:
- High: 70–100
- Medium: 40–69
- Low: 0–39

Topics are sorted by descending priority score.

## Phase 3.3 — Scheduling Engine

Status: Implemented and tested

- Reads student weekly availability.
- Retrieves topic priorities.
- Excludes completed topics.
- Distributes eligible topics across available slots.
- Generates sessions between requested start and end dates.
- Sorts topics by priority before assignment.

API:
GET /api/v1/students/{student_id}/schedules/generate

Parameters:
- start_date
- end_date

Testing:
- Two Monday sessions successfully generated.
- Availability: 09:00–12:00.
- Topic priority: 78.

## Phase 3.4 — Recommendation Engine

- Selects the highest-priority incomplete topic.
- Finds the next available weekly study slot within 7 days.
- Returns other pending topics.
- Reports when no availability exists.

Testing:
- Arrays recommended with priority 78 (high).
- November 2, 09:00–12:00 suggested slot verified.