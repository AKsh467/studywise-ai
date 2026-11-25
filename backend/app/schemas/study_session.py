
from datetime import datetime
from pydantic import BaseModel, ConfigDict


class StudySessionCreate(BaseModel):
    topic_id: int
    study_plan_id: int | None = None


class StudySessionComplete(BaseModel):
    ended_at: datetime | None = None


class StudySessionResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    student_id: int
    topic_id: int
    study_plan_id: int | None
    started_at: datetime
    ended_at: datetime | None
    duration_minutes: int | None
    status: str
