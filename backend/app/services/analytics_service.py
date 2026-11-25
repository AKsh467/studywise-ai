from datetime import date, datetime, timedelta

from sqlalchemy import func
from sqlalchemy.orm import Session

from app.models.student import Student
from app.models.topic import Topic
from app.models.subject import Subject
from app.models.exam import Exam
from app.models.study_session import StudySession


def get_dashboard_analytics(db: Session, student_id: int):

    today = date.today()
    week_start = today - timedelta(days=today.weekday())

    # Total study time
    total_minutes = db.query(
        func.coalesce(func.sum(StudySession.duration_minutes), 0)
    ).filter(
        StudySession.student_id == student_id,
        StudySession.status == "completed"
    ).scalar()

    # Today's study time
    today_minutes = db.query(
        func.coalesce(func.sum(StudySession.duration_minutes), 0)
    ).filter(
        StudySession.student_id == student_id,
        StudySession.status == "completed",
        func.date(StudySession.started_at) == today.isoformat()
    ).scalar()

    # This week's study time
    week_minutes = db.query(
        func.coalesce(func.sum(StudySession.duration_minutes), 0)
    ).filter(
        StudySession.student_id == student_id,
        StudySession.status == "completed",
        func.date(StudySession.started_at) >= week_start.isoformat(),
        func.date(StudySession.started_at) <= today.isoformat()
    ).scalar()

    # Topic progress
    total_topics = db.query(Topic).join(Subject).filter(
        Subject.student_id == student_id
    ).count()

    completed_topics = db.query(Topic).join(Subject).filter(
        Subject.student_id == student_id,
        Topic.is_completed == True
    ).count()

    pending_topics = total_topics - completed_topics

    # Subject-wise progress
    subjects = db.query(Subject).filter(
        Subject.student_id == student_id
    ).all()

    subject_progress = []

    for subject in subjects:
        total = db.query(Topic).filter(
            Topic.subject_id == subject.id
        ).count()

        completed = db.query(Topic).filter(
            Topic.subject_id == subject.id,
            Topic.is_completed == True
        ).count()

        subject_progress.append({
            "subject_id": subject.id,
            "subject_name": subject.name,
            "total_topics": total,
            "completed_topics": completed,
            "progress_percentage": round(
                (completed / total) * 100, 2
            ) if total else 0
        })

    # Upcoming exams
    upcoming_exams = db.query(Exam).filter(
        Exam.student_id == student_id,
        Exam.exam_date >= today
    ).order_by(Exam.exam_date).limit(5).all()

    exams_data = [
        {
            "exam_id": exam.id,
            "exam_name": exam.name,
            "subject_id": exam.subject_id,
            "exam_date": exam.exam_date.isoformat()
        }
        for exam in upcoming_exams
    ]

    # Study streak: consecutive days with completed sessions
    session_dates = db.query(
        func.date(StudySession.started_at)
    ).filter(
        StudySession.student_id == student_id,
        StudySession.status == "completed"
    ).distinct().all()

    studied_dates = {
        date.fromisoformat(item[0])
        for item in session_dates
        if item[0]
    }

    streak = 0
    check_date = today

    if check_date not in studied_dates:
        check_date -= timedelta(days=1)

    while check_date in studied_dates:
        streak += 1
        check_date -= timedelta(days=1)

    return {
        "total_study_minutes": total_minutes,
        "today_study_minutes": today_minutes,
        "weekly_study_minutes": week_minutes,
        "total_topics": total_topics,
        "completed_topics": completed_topics,
        "pending_topics": pending_topics,
        "overall_progress_percentage": round(
            (completed_topics / total_topics) * 100, 2
        ) if total_topics else 0,
        "subject_progress": subject_progress,
        "upcoming_exams": exams_data,
        "study_streak_days": streak
    }