
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models.student import Student
from app.services.priority_service import get_student_topic_priorities

router = APIRouter(
    prefix="/students/{student_id}/priorities",
    tags=["Topic Priorities"]
)


@router.get("/")
def get_priorities(
    student_id: int,
    db: Session = Depends(get_db)
):
    student = (
        db.query(Student)
        .filter(Student.id == student_id)
        .first()
    )

    if not student:
        raise HTTPException(
            status_code=404,
            detail="Student not found"
        )

    priorities = get_student_topic_priorities(db, student_id)

    return {
        "success": True,
        "message": "Topic priorities calculated successfully",
        "data": priorities
    }
