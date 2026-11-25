
from sqlalchemy import (
    Column, Integer, String, DateTime, ForeignKey
)
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship

from app.core.database import Base


class StudySession(Base):
    __tablename__ = "study_sessions"

    id = Column(Integer, primary_key=True, index=True)

    student_id = Column(
        Integer,
        ForeignKey("students.id", ondelete="CASCADE"),
        nullable=False,
        index=True
    )

    topic_id = Column(
        Integer,
        ForeignKey("topics.id", ondelete="CASCADE"),
        nullable=False,
        index=True
    )

    study_plan_id = Column(
        Integer,
        ForeignKey("study_plans.id", ondelete="SET NULL"),
        nullable=True
    )

    started_at = Column(DateTime, nullable=False)
    ended_at = Column(DateTime, nullable=True)
    duration_minutes = Column(Integer, nullable=True)

    status = Column(String(20), default="in_progress", nullable=False)

    created_at = Column(
        DateTime,
        server_default=func.now(),
        nullable=False
    )

    student = relationship("Student", back_populates="study_sessions")
    topic = relationship("Topic", back_populates="study_sessions")
    study_plan = relationship("StudyPlan", back_populates="sessions")
