from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models.student import Student
from app.services.analytics_service import get_dashboard_analytics

router = APIRouter(
    prefix="/students/{student_id}/dashboard",
    tags=["Dashboard"]
)


@router.get("/")
def get_dashboard(
    student_id: int,
    db: Session = Depends(get_db)
):
    student = db.query(Student).filter(
        Student.id == student_id
    ).first()

    if not student:
        raise HTTPException(404, "Student not found")

    analytics = get_dashboard_analytics(db, student_id)

    return {
        "success": True,
        "message": "Dashboard analytics retrieved",
        "data": analytics
    }