
from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship

from app.core.database import Base


class Student(Base):
    __tablename__ = "students"

    id = Column(Integer, primary_key=True, index=True)

    name = Column(String(100), nullable=False)

    email = Column(
        String(255),
        unique=True,
        index=True,
        nullable=False
    )

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False
    )

    subjects = relationship(
        "Subject",
        back_populates="student",
        cascade="all, delete-orphan"
    )
    
    exams = relationship(
    "Exam",
    back_populates="student",
    cascade="all, delete-orphan"
    )

    availabilities = relationship(
    "Availability",
    back_populates="student",
    cascade="all, delete-orphan"
    )

    study_plans = relationship(
    "StudyPlan",
    back_populates="student",
    cascade="all, delete-orphan"
    )

    study_sessions = relationship(
    "StudySession",
    back_populates="student",
    cascade="all, delete-orphan"
    )
