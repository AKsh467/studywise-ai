
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models.student import Student
from app.models.availability import Availability
from app.schemas.availability import (
    AvailabilityCreate,
    AvailabilityUpdate,
    AvailabilityResponse
)

router = APIRouter(
    prefix="/students/{student_id}/availability",
    tags=["Weekly Availability"]
)


def get_student(student_id: int, db: Session):
    student = db.query(Student).filter(Student.id == student_id).first()

    if not student:
        raise HTTPException(status_code=404, detail="Student not found")

    return student


@router.post("/")
def create_availability(
    student_id: int,
    availability_data: AvailabilityCreate,
    db: Session = Depends(get_db)
):
    get_student(student_id, db)

    availability = Availability(
        student_id=student_id,
        **availability_data.model_dump()
    )

    db.add(availability)
    db.commit()
    db.refresh(availability)

    return {
        "success": True,
        "message": "Availability created successfully",
        "data": AvailabilityResponse.model_validate(availability).model_dump()
    }


@router.get("/")
def list_availability(
    student_id: int,
    db: Session = Depends(get_db)
):
    get_student(student_id, db)

    records = (
        db.query(Availability)
        .filter(Availability.student_id == student_id)
        .order_by(Availability.day_of_week, Availability.start_time)
        .all()
    )

    return {
        "success": True,
        "message": "Availability retrieved successfully",
        "data": [
            AvailabilityResponse.model_validate(record).model_dump()
            for record in records
        ]
    }


@router.get("/{availability_id}")
def get_availability(
    student_id: int,
    availability_id: int,
    db: Session = Depends(get_db)
):
    record = (
        db.query(Availability)
        .filter(
            Availability.id == availability_id,
            Availability.student_id == student_id
        )
        .first()
    )

    if not record:
        raise HTTPException(status_code=404, detail="Availability not found")

    return {
        "success": True,
        "message": "Availability retrieved successfully",
        "data": AvailabilityResponse.model_validate(record).model_dump()
    }


@router.put("/{availability_id}")
def update_availability(
    student_id: int,
    availability_id: int,
    update_data: AvailabilityUpdate,
    db: Session = Depends(get_db)
):
    record = (
        db.query(Availability)
        .filter(
            Availability.id == availability_id,
            Availability.student_id == student_id
        )
        .first()
    )

    if not record:
        raise HTTPException(status_code=404, detail="Availability not found")

    updates = update_data.model_dump(exclude_unset=True)

    new_start = updates.get("start_time", record.start_time)
    new_end = updates.get("end_time", record.end_time)

    if new_start is not None and new_end is not None and new_end <= new_start:
        raise HTTPException(
            status_code=400,
            detail="End time must be later than start time"
        )

    for key, value in updates.items():
        setattr(record, key, value)

    db.commit()
    db.refresh(record)

    return {
        "success": True,
        "message": "Availability updated successfully",
        "data": AvailabilityResponse.model_validate(record).model_dump()
    }


@router.delete("/{availability_id}")
def delete_availability(
    student_id: int,
    availability_id: int,
    db: Session = Depends(get_db)
):
    record = (
        db.query(Availability)
        .filter(
            Availability.id == availability_id,
            Availability.student_id == student_id
        )
        .first()
    )

    if not record:
        raise HTTPException(status_code=404, detail="Availability not found")

    db.delete(record)
    db.commit()

    return {
        "success": True,
        "message": "Availability deleted successfully",
        "data": {"id": availability_id}
    }
