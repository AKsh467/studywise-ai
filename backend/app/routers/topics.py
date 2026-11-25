from fastapi import APIRouter, Depends
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models.student import Student
from app.models.subject import Subject
from app.models.topic import Topic
from app.schemas.topic import (
    TopicCreate,
    TopicUpdate,
    TopicResponse
)

router = APIRouter(
    prefix="/students/{student_id}/subjects/{subject_id}/topics",
    tags=["Topics"]
)


def get_owned_subject(db: Session, student_id: int, subject_id: int):
    return db.query(Subject).join(Student).filter(
        Subject.id == subject_id,
        Subject.student_id == student_id
    ).first()


@router.post("/")
def create_topic(
    student_id: int,
    subject_id: int,
    topic_data: TopicCreate,
    db: Session = Depends(get_db)
):
    subject = get_owned_subject(db, student_id, subject_id)

    if not subject:
        return JSONResponse(
            status_code=404,
            content={
                "success": False,
                "message": "Subject not found",
                "detail": "Subject does not belong to this student."
            }
        )

    topic = Topic(
        subject_id=subject_id,
        name=topic_data.name,
        description=topic_data.description
    )

    db.add(topic)
    db.commit()
    db.refresh(topic)

    return {
        "success": True,
        "message": "Topic created successfully",
        "data": TopicResponse.model_validate(topic).model_dump()
    }


@router.get("/")
def list_topics(
    student_id: int,
    subject_id: int,
    db: Session = Depends(get_db)
):
    subject = get_owned_subject(db, student_id, subject_id)

    if not subject:
        return JSONResponse(
            status_code=404,
            content={
                "success": False,
                "message": "Subject not found",
                "detail": "Subject does not belong to this student."
            }
        )

    topics = db.query(Topic).filter(
        Topic.subject_id == subject_id
    ).all()

    return {
        "success": True,
        "message": "Topics retrieved successfully",
        "data": [
            TopicResponse.model_validate(topic).model_dump()
            for topic in topics
        ]
    }


@router.get("/{topic_id}")
def get_topic(
    student_id: int,
    subject_id: int,
    topic_id: int,
    db: Session = Depends(get_db)
):
    topic = db.query(Topic).join(Subject).filter(
        Topic.id == topic_id,
        Topic.subject_id == subject_id,
        Subject.student_id == student_id
    ).first()

    if not topic:
        return JSONResponse(
            status_code=404,
            content={
                "success": False,
                "message": "Topic not found",
                "detail": "Topic does not belong to this student and subject."
            }
        )

    return {
        "success": True,
        "message": "Topic retrieved successfully",
        "data": TopicResponse.model_validate(topic).model_dump()
    }


@router.put("/{topic_id}")
def update_topic(
    student_id: int,
    subject_id: int,
    topic_id: int,
    topic_data: TopicUpdate,
    db: Session = Depends(get_db)
):
    topic = db.query(Topic).join(Subject).filter(
        Topic.id == topic_id,
        Topic.subject_id == subject_id,
        Subject.student_id == student_id
    ).first()

    if not topic:
        return JSONResponse(
            status_code=404,
            content={
                "success": False,
                "message": "Topic not found",
                "detail": "Topic does not belong to this student and subject."
            }
        )

    updates = topic_data.model_dump(exclude_unset=True)

    if not updates:
        return JSONResponse(
            status_code=400,
            content={
                "success": False,
                "message": "No update data provided",
                "detail": "Provide at least one field to update."
            }
        )

    for field, value in updates.items():
        setattr(topic, field, value)

    db.commit()
    db.refresh(topic)

    return {
        "success": True,
        "message": "Topic updated successfully",
        "data": TopicResponse.model_validate(topic).model_dump()
    }


@router.delete("/{topic_id}")
def delete_topic(
    student_id: int,
    subject_id: int,
    topic_id: int,
    db: Session = Depends(get_db)
):
    topic = db.query(Topic).join(Subject).filter(
        Topic.id == topic_id,
        Topic.subject_id == subject_id,
        Subject.student_id == student_id
    ).first()

    if not topic:
        return JSONResponse(
            status_code=404,
            content={
                "success": False,
                "message": "Topic not found",
                "detail": "Topic does not belong to this student and subject."
            }
        )

    db.delete(topic)
    db.commit()

    return {
        "success": True,
        "message": "Topic deleted successfully",
        "data": {
            "id": topic_id,
            "subject_id": subject_id
        }
    }