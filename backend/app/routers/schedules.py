
from datetime import date

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models.student import Student
from app.services.scheduling_service import generate_schedule

router = APIRouter(
    prefix="/students/{student_id}/schedules",
    tags=["Study Schedules"]
)


@router.get("/generate")
def create_schedule(
    student_id: int,
    start_date: date = Query(...),
    end_date: date = Query(...),
    db: Session = Depends(get_db)
):
    student = db.query(Student).filter(
        Student.id == student_id
    ).first()

    if not student:
        raise HTTPException(status_code=404, detail="Student not found")

    if end_date < start_date:
        raise HTTPException(
            status_code=400,
            detail="End date cannot be before start date"
        )

    schedule = generate_schedule(
        db, student_id, start_date, end_date
    )

    return {
        "success": True,
        "message": "Study schedule generated successfully",
        "data": schedule
    }
