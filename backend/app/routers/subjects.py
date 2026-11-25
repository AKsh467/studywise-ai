from fastapi import APIRouter, Depends
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models.student import Student
from app.models.subject import Subject
from app.schemas.subject import (
    SubjectCreate,
    SubjectUpdate,
    SubjectResponse
)

router = APIRouter(
    prefix="/students/{student_id}/subjects",
    tags=["Subjects"]
)


def get_student_or_none(db: Session, student_id: int):
    return db.query(Student).filter(
        Student.id == student_id
    ).first()


@router.post("/")
def create_subject(
    student_id: int,
    subject_data: SubjectCreate,
    db: Session = Depends(get_db)
):
    student = get_student_or_none(db, student_id)

    if not student:
        return JSONResponse(
            status_code=404,
            content={
                "success": False,
                "message": "Student not found",
                "detail": f"No student exists with ID {student_id}."
            }
        )

    new_subject = Subject(
        student_id=student_id,
        name=subject_data.name,
        description=subject_data.description,
        color=subject_data.color
    )

    db.add(new_subject)
    db.commit()
    db.refresh(new_subject)

    return {
        "success": True,
        "message": "Subject created successfully",
        "data": SubjectResponse.model_validate(new_subject).model_dump()
    }


@router.get("/")
def list_subjects(
    student_id: int,
    db: Session = Depends(get_db)
):
    student = get_student_or_none(db, student_id)

    if not student:
        return JSONResponse(
            status_code=404,
            content={
                "success": False,
                "message": "Student not found",
                "detail": f"No student exists with ID {student_id}."
            }
        )

    subjects = db.query(Subject).filter(
        Subject.student_id == student_id
    ).all()

    return {
        "success": True,
        "message": "Subjects retrieved successfully",
        "data": [
            SubjectResponse.model_validate(subject).model_dump()
            for subject in subjects
        ]
    }


@router.get("/{subject_id}")
def get_subject(
    student_id: int,
    subject_id: int,
    db: Session = Depends(get_db)
):
    subject = db.query(Subject).filter(
        Subject.id == subject_id,
        Subject.student_id == student_id
    ).first()

    if not subject:
        return JSONResponse(
            status_code=404,
            content={
                "success": False,
                "message": "Subject not found",
                "detail": "This subject does not exist for the specified student."
            }
        )

    return {
        "success": True,
        "message": "Subject retrieved successfully",
        "data": SubjectResponse.model_validate(subject).model_dump()
    }


@router.put("/{subject_id}")
def update_subject(
    student_id: int,
    subject_id: int,
    subject_data: SubjectUpdate,
    db: Session = Depends(get_db)
):
    subject = db.query(Subject).filter(
        Subject.id == subject_id,
        Subject.student_id == student_id
    ).first()

    if not subject:
        return JSONResponse(
            status_code=404,
            content={
                "success": False,
                "message": "Subject not found",
                "detail": "This subject does not exist for the specified student."
            }
        )

    updates = subject_data.model_dump(exclude_unset=True)

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
        setattr(subject, field, value)

    db.commit()
    db.refresh(subject)

    return {
        "success": True,
        "message": "Subject updated successfully",
        "data": SubjectResponse.model_validate(subject).model_dump()
    }


@router.delete("/{subject_id}")
def delete_subject(
    student_id: int,
    subject_id: int,
    db: Session = Depends(get_db)
):
    subject = db.query(Subject).filter(
        Subject.id == subject_id,
        Subject.student_id == student_id
    ).first()

    if not subject:
        return JSONResponse(
            status_code=404,
            content={
                "success": False,
                "message": "Subject not found",
                "detail": "This subject does not exist for the specified student."
            }
        )

    db.delete(subject)
    db.commit()

    return {
        "success": True,
        "message": "Subject deleted successfully",
        "data": {
            "id": subject_id,
            "student_id": student_id
        }
    }