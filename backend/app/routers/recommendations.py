
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models.student import Student
from app.services.recommendation_service import get_study_recommendations

router = APIRouter(
    prefix="/students/{student_id}/recommendations",
    tags=["Study Recommendations"]
)


@router.get("/")
def get_recommendations(
    student_id: int,
    db: Session = Depends(get_db)
):
    student = db.query(Student).filter(
        Student.id == student_id
    ).first()

    if not student:
        raise HTTPException(status_code=404, detail="Student not found")

    recommendations = get_study_recommendations(db, student_id)

    return {
        "success": True,
        "message": "Study recommendations generated successfully",
        "data": recommendations
    }
