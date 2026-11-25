
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models.student import Student
from app.models.study_plan import StudyPlan
from app.schemas.study_plan import (
    StudyPlanCreate,
    StudyPlanUpdate,
    StudyPlanResponse
)

router = APIRouter(
    prefix="/students/{student_id}/study-plans",
    tags=["Study Plans"]
)


def get_student(student_id: int, db: Session):
    student = db.query(Student).filter(Student.id == student_id).first()

    if not student:
        raise HTTPException(status_code=404, detail="Student not found")

    return student


@router.post("/")
def create_study_plan(
    student_id: int,
    plan_data: StudyPlanCreate,
    db: Session = Depends(get_db)
):
    get_student(student_id, db)

    if plan_data.end_date < plan_data.start_date:
        raise HTTPException(
            status_code=400,
            detail="End date cannot be before start date"
        )

    plan = StudyPlan(
        student_id=student_id,
        **plan_data.model_dump()
    )

    db.add(plan)
    db.commit()
    db.refresh(plan)

    return {
        "success": True,
        "message": "Study plan created successfully",
        "data": StudyPlanResponse.model_validate(plan).model_dump()
    }


@router.get("/")
def list_study_plans(
    student_id: int,
    db: Session = Depends(get_db)
):
    get_student(student_id, db)

    plans = (
        db.query(StudyPlan)
        .filter(StudyPlan.student_id == student_id)
        .order_by(StudyPlan.start_date)
        .all()
    )

    return {
        "success": True,
        "message": "Study plans retrieved successfully",
        "data": [
            StudyPlanResponse.model_validate(plan).model_dump()
            for plan in plans
        ]
    }


@router.get("/{plan_id}")
def get_study_plan(
    student_id: int,
    plan_id: int,
    db: Session = Depends(get_db)
):
    plan = (
        db.query(StudyPlan)
        .filter(
            StudyPlan.id == plan_id,
            StudyPlan.student_id == student_id
        )
        .first()
    )

    if not plan:
        raise HTTPException(status_code=404, detail="Study plan not found")

    return {
        "success": True,
        "message": "Study plan retrieved successfully",
        "data": StudyPlanResponse.model_validate(plan).model_dump()
    }


@router.put("/{plan_id}")
def update_study_plan(
    student_id: int,
    plan_id: int,
    update_data: StudyPlanUpdate,
    db: Session = Depends(get_db)
):
    plan = (
        db.query(StudyPlan)
        .filter(
            StudyPlan.id == plan_id,
            StudyPlan.student_id == student_id
        )
        .first()
    )

    if not plan:
        raise HTTPException(status_code=404, detail="Study plan not found")

    updates = update_data.model_dump(exclude_unset=True)

    new_start = updates.get("start_date", plan.start_date)
    new_end = updates.get("end_date", plan.end_date)

    if new_start is not None and new_end is not None and new_end < new_start:
        raise HTTPException(
            status_code=400,
            detail="End date cannot be before start date"
        )

    for key, value in updates.items():
        setattr(plan, key, value)

    db.commit()
    db.refresh(plan)

    return {
        "success": True,
        "message": "Study plan updated successfully",
        "data": StudyPlanResponse.model_validate(plan).model_dump()
    }


@router.delete("/{plan_id}")
def delete_study_plan(
    student_id: int,
    plan_id: int,
    db: Session = Depends(get_db)
):
    plan = (
        db.query(StudyPlan)
        .filter(
            StudyPlan.id == plan_id,
            StudyPlan.student_id == student_id
        )
        .first()
    )

    if not plan:
        raise HTTPException(status_code=404, detail="Study plan not found")

    db.delete(plan)
    db.commit()

    return {
        "success": True,
        "message": "Study plan deleted successfully",
        "data": {"id": plan_id}
    }
