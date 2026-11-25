from fastapi import APIRouter, Depends
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models.student import Student
from app.models.subject import Subject
from app.models.exam import Exam
from app.schemas.exam import ExamCreate, ExamUpdate, ExamResponse

router = APIRouter(
    prefix="/students/{student_id}/exams",
    tags=["Examinations"]
)


def error_response(status_code, message, detail):
    return JSONResponse(
        status_code=status_code,
        content={
            "success": False,
            "message": message,
            "detail": detail
        }
    )


def get_exam(db, student_id, exam_id):
    return db.query(Exam).filter(
        Exam.id == exam_id,
        Exam.student_id == student_id
    ).first()


@router.post("/")
def create_exam(
    student_id: int,
    exam_data: ExamCreate,
    db: Session = Depends(get_db)
):
    student = db.query(Student).filter(
        Student.id == student_id
    ).first()

    if not student:
        return error_response(404, "Student not found", "Student does not exist.")

    subject = db.query(Subject).filter(
        Subject.id == exam_data.subject_id,
        Subject.student_id == student_id
    ).first()

    if not subject:
        return error_response(
            404, "Subject not found",
            "Subject does not belong to this student."
        )

    if exam_data.target_marks > exam_data.total_marks:
        return error_response(
            400, "Invalid target marks",
            "Target marks cannot exceed total marks."
        )

    exam = Exam(
        student_id=student_id,
        subject_id=exam_data.subject_id,
        name=exam_data.name,
        exam_date=exam_data.exam_date,
        total_marks=exam_data.total_marks,
        target_marks=exam_data.target_marks
    )

    db.add(exam)
    db.commit()
    db.refresh(exam)

    return {
        "success": True,
        "message": "Examination created successfully",
        "data": ExamResponse.model_validate(exam).model_dump()
    }


@router.get("/")
def list_exams(
    student_id: int,
    db: Session = Depends(get_db)
):
    student = db.query(Student).filter(
        Student.id == student_id
    ).first()

    if not student:
        return error_response(404, "Student not found", "Student does not exist.")

    exams = db.query(Exam).filter(
        Exam.student_id == student_id
    ).order_by(Exam.exam_date).all()

    return {
        "success": True,
        "message": "Examinations retrieved successfully",
        "data": [
            ExamResponse.model_validate(exam).model_dump()
            for exam in exams
        ]
    }


@router.get("/{exam_id}")
def get_exam_details(
    student_id: int,
    exam_id: int,
    db: Session = Depends(get_db)
):
    exam = get_exam(db, student_id, exam_id)

    if not exam:
        return error_response(404, "Examination not found", "Examination does not exist.")

    return {
        "success": True,
        "message": "Examination retrieved successfully",
        "data": ExamResponse.model_validate(exam).model_dump()
    }


@router.put("/{exam_id}")
def update_exam(
    student_id: int,
    exam_id: int,
    exam_data: ExamUpdate,
    db: Session = Depends(get_db)
):
    exam = get_exam(db, student_id, exam_id)

    if not exam:
        return error_response(404, "Examination not found", "Examination does not exist.")

    updates = exam_data.model_dump(exclude_unset=True)

    if not updates:
        return error_response(400, "No update data", "Provide at least one field.")

    new_subject_id = updates.get("subject_id", exam.subject_id)
    new_total = updates.get("total_marks", exam.total_marks)
    new_target = updates.get("target_marks", exam.target_marks)

    if new_target > new_total:
        return error_response(
            400, "Invalid target marks",
            "Target marks cannot exceed total marks."
        )

    if "subject_id" in updates:
        subject = db.query(Subject).filter(
            Subject.id == new_subject_id,
            Subject.student_id == student_id
        ).first()

        if not subject:
            return error_response(
                404, "Subject not found",
                "Subject does not belong to this student."
            )

    for field, value in updates.items():
        setattr(exam, field, value)

    db.commit()
    db.refresh(exam)

    return {
        "success": True,
        "message": "Examination updated successfully",
        "data": ExamResponse.model_validate(exam).model_dump()
    }


@router.delete("/{exam_id}")
def delete_exam(
    student_id: int,
    exam_id: int,
    db: Session = Depends(get_db)
):
    exam = get_exam(db, student_id, exam_id)

    if not exam:
        return error_response(404, "Examination not found", "Examination does not exist.")

    db.delete(exam)
    db.commit()

    return {
        "success": True,
        "message": "Examination deleted successfully",
        "data": {
            "id": exam_id,
            "student_id": student_id
        }
    }