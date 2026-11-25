
from datetime import date


def calculate_priority(
    exam_date: date | None,
    target_marks: int = 0,
    total_marks: int = 100,
    is_completed: bool = False
) -> dict:

    if is_completed:
        return {
            "score": 0,
            "level": "completed",
            "reason": "Topic already completed"
        }

    urgency_score = 10

    if exam_date:
        days_left = (exam_date - date.today()).days

        if days_left < 0:
            urgency_score = 0
        elif days_left <= 3:
            urgency_score = 60
        elif days_left <= 7:
            urgency_score = 50
        elif days_left <= 14:
            urgency_score = 40
        elif days_left <= 30:
            urgency_score = 25
        else:
            urgency_score = 10

    ambition_score = 0

    if total_marks > 0:
        target_percentage = (target_marks / total_marks) * 100
        ambition_score = min(20, int(target_percentage / 5))

    completion_score = 20

    score = urgency_score + ambition_score + completion_score
    score = min(100, score)

    if score >= 70:
        level = "high"
    elif score >= 40:
        level = "medium"
    else:
        level = "low"

    return {
        "score": score,
        "level": level,
        "reason": "Based on exam urgency, target marks and completion status"
    }


from app.models.topic import Topic
from app.models.subject import Subject
from app.models.exam import Exam


def get_student_topic_priorities(db, student_id: int):
    today = date.today()

    topics = (
        db.query(Topic, Subject)
        .join(Subject, Topic.subject_id == Subject.id)
        .filter(Subject.student_id == student_id)
        .all()
    )

    exams = (
        db.query(Exam)
        .filter(
            Exam.student_id == student_id,
            Exam.exam_date >= today
        )
        .order_by(Exam.exam_date)
        .all()
    )

    # Find the nearest upcoming exam for each subject
    subject_exams = {}

    for exam in exams:
        if exam.subject_id not in subject_exams:
            subject_exams[exam.subject_id] = exam

    results = []

    for topic, subject in topics:
        exam = subject_exams.get(subject.id)

        priority = calculate_priority(
            exam_date=exam.exam_date if exam else None,
            target_marks=exam.target_marks if exam else 0,
            total_marks=exam.total_marks if exam else 100,
            is_completed=topic.is_completed
        )

        results.append({
            "topic_id": topic.id,
            "topic_name": topic.name,
            "subject_id": subject.id,
            "subject_name": subject.name,
            "exam_date": exam.exam_date if exam else None,
            "priority": priority
        })

    results.sort(
        key=lambda item: item["priority"]["score"],
        reverse=True
    )

    return results
