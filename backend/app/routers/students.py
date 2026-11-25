from fastapi import APIRouter, Depends
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models.student import Student
from app.schemas.student import (
    StudentCreate,
    StudentUpdate,
    StudentResponse
)

router = APIRouter(
    prefix="/students",
    tags=["Students"]
)


@router.post("/")
def create_student(
    student_data: StudentCreate,
    db: Session = Depends(get_db)
):
    # Check whether this email is already registered
    existing_student = db.query(Student).filter(
        Student.email == student_data.email
    ).first()

    if existing_student:
        return JSONResponse(
            status_code=409,
            content={
                "success": False,
                "message": "A student with this email already exists",
                "detail": "Please use a different email address."
            }
        )

    new_student = Student(
        name=student_data.name,
        email=str(student_data.email)
    )

    db.add(new_student)
    db.commit()
    db.refresh(new_student)

    return {
        "success": True,
        "message": "Student profile created successfully",
        "data": StudentResponse.model_validate(new_student).model_dump()
    }


@router.get("/{student_id}")
def get_student(
    student_id: int,
    db: Session = Depends(get_db)
):
    student = db.query(Student).filter(
        Student.id == student_id
    ).first()

    if not student:
        return JSONResponse(
            status_code=404,
            content={
                "success": False,
                "message": "Student not found",
                "detail": f"No student exists with ID {student_id}."
            }
        )

    return {
        "success": True,
        "message": "Student profile retrieved successfully",
        "data": StudentResponse.model_validate(student).model_dump()
    }


@router.put("/{student_id}")
def update_student(
    student_id: int,
    student_data: StudentUpdate,
    db: Session = Depends(get_db)
):
    student = db.query(Student).filter(
        Student.id == student_id
    ).first()

    if not student:
        return JSONResponse(
            status_code=404,
            content={
                "success": False,
                "message": "Student not found",
                "detail": f"No student exists with ID {student_id}."
            }
        )

    updates = student_data.model_dump(exclude_unset=True)

    if not updates:
        return JSONResponse(
            status_code=400,
            content={
                "success": False,
                "message": "No update data provided",
                "detail": "Provide at least one field: name or email."
            }
        )

    if "email" in updates:
        updates["email"] = str(updates["email"])

        existing_student = db.query(Student).filter(
            Student.email == updates["email"],
            Student.id != student_id
        ).first()

        if existing_student:
            return JSONResponse(
                status_code=409,
                content={
                    "success": False,
                    "message": "Email already in use",
                    "detail": "Another student is using this email address."
                }
            )

    for field, value in updates.items():
        setattr(student, field, value)

    db.commit()
    db.refresh(student)

    return {
        "success": True,
        "message": "Student profile updated successfully",
        "data": StudentResponse.model_validate(student).model_dump()
    }