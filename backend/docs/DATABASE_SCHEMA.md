## Student Table

| Column | Type | Constraints |
|---|---|---|
| id | Integer | Primary key |
| name | String(100) | Not null |
| email | String(255) | Unique, not null |
| created_at | DateTime | Server default |

## Subject Table

| Column | Type | Constraints |
|---|---|---|
| id | Integer | Primary key |
| student_id | Integer | Foreign key → students.id |
| name | String(100) | Not null |
| description | Text | Nullable |
| color | String(20) | Nullable |
| created_at | DateTime | Server default |

Relationship:
One Student can have multiple Subjects.

## Topic Table

| Column | Type | Constraints |
|---|---|---|
| id | Integer | Primary key |
| subject_id | Integer | Foreign key → subjects.id |
| name | String(150) | Not null |
| description | Text | Nullable |
| is_completed | Boolean | Default false |
| created_at | DateTime | Server default |

Relationship:
One Subject can have multiple Topics.

## Cascade Behaviour

- Student deletion cascades to its subjects through the ORM relationship.
- Subject deletion cascades to its topics through the ORM relationship.

Note: Database schema changes are currently initialized using SQLAlchemy create_all().
Alembic migrations will be used for future schema modifications.

## Exams Table

| Column | Type | Description |
|---|---|---|
| id | Integer | Primary key |
| student_id | Integer | Foreign key to students |
| subject_id | Integer | Foreign key to subjects |
| name | String(150) | Exam name |
| exam_date | Date | Examination date |
| total_marks | Integer | Maximum marks |
| target_marks | Integer | Student's target marks |
| created_at | DateTime | Creation timestamp |

Relationships:
- Each exam belongs to one student.
- Each exam belongs to one subject.
- Students and subjects can have multiple exams.

## Availabilities Table

| Column | Type | Description |
|---|---|---|
| id | Integer | Primary key |
| student_id | Integer | Foreign key to students |
| day_of_week | Integer | Day of week (0–6) |
| start_time | Time | Availability start |
| end_time | Time | Availability end |
| created_at | DateTime | Creation timestamp |

Relationships:
- Each availability slot belongs to one student.
- A student can have multiple availability slots.

## Study Plans Table

| Column | Type | Description |
|---|---|---|
| id | Integer | Primary key |
| student_id | Integer | Foreign key to students |
| name | String(150) | Plan name |
| start_date | Date | Plan start date |
| end_date | Date | Plan end date |
| status | String(20) | Plan status |
| created_at | DateTime | Creation timestamp |

Relationships:
- Each study plan belongs to one student.
- A student can have multiple study plans.