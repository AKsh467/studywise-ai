
from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models.study_session import StudySession
from app.models.topic import Topic
from app.models.student import Student
from app.models.study_plan import StudyPlan
from app.schemas.study_session import (
    StudySessionCreate,
    StudySessionComplete,
    StudySessionResponse
)

router = APIRouter(
    prefix="/students/{student_id}/study-sessions",
    tags=["Study Sessions"]
)


@router.post("/start")
def start_session(
    student_id: int,
    data: StudySessionCreate,
    db: Session = Depends(get_db)
):
    student = db.query(Student).filter(Student.id == student_id).first()
    if not student:
        raise HTTPException(404, "Student not found")

    topic = db.query(Topic).join(
        Topic.subject
    ).filter(
        Topic.id == data.topic_id,
        Topic.subject.has(student_id=student_id)
    ).first()

    if not topic:
        raise HTTPException(404, "Topic not found")

    if data.study_plan_id is not None:
        plan = db.query(StudyPlan).filter(
            StudyPlan.id == data.study_plan_id,
            StudyPlan.student_id == student_id
        ).first()

        if not plan:
            raise HTTPException(404, "Study plan not found")

    active = db.query(StudySession).filter(
        StudySession.student_id == student_id,
        StudySession.status == "in_progress"
    ).first()

    if active:
        raise HTTPException(400, "An active session already exists")

    session = StudySession(
        student_id=student_id,
        topic_id=data.topic_id,
        study_plan_id=data.study_plan_id,
        started_at=datetime.now(timezone.utc).replace(tzinfo=None),
        status="in_progress"
    )

    db.add(session)
    db.commit()
    db.refresh(session)

    return {
        "success": True,
        "message": "Study session started",
        "data": StudySessionResponse.model_validate(session).model_dump()
    }


@router.post("/{session_id}/complete")
def complete_session(
    student_id: int,
    session_id: int,
    data: StudySessionComplete,
    db: Session = Depends(get_db)
):
    session = db.query(StudySession).filter(
        StudySession.id == session_id,
        StudySession.student_id == student_id
    ).first()

    if not session:
        raise HTTPException(404, "Study session not found")

    if session.status != "in_progress":
        raise HTTPException(400, "Session is not in progress")

    end_time = data.ended_at or datetime.now(timezone.utc).replace(tzinfo=None)

    if end_time.tzinfo is not None:
        end_time = end_time.astimezone(timezone.utc).replace(tzinfo=None)

    if end_time <= session.started_at:
        raise HTTPException(400, "End time must be after start time")

    session.ended_at = end_time
    session.duration_minutes = int(
        (end_time - session.started_at).total_seconds() / 60
    )
    session.status = "completed"

    db.commit()
    db.refresh(session)

    return {
        "success": True,
        "message": "Study session completed",
        "data": StudySessionResponse.model_validate(session).model_dump()
    }


@router.get("/")
def list_sessions(
    student_id: int,
    db: Session = Depends(get_db)
):
    sessions = db.query(StudySession).filter(
        StudySession.student_id == student_id
    ).order_by(StudySession.started_at.desc()).all()

    return {
        "success": True,
        "message": "Study sessions retrieved",
        "data": [
            StudySessionResponse.model_validate(s).model_dump()
            for s in sessions
        ]
    }
