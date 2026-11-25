from datetime import date
from pydantic import BaseModel, ConfigDict, Field


class ExamCreate(BaseModel):
    subject_id: int
    name: str
    exam_date: date
    total_marks: int = Field(gt=0)
    target_marks: int = Field(gt=0)


class ExamUpdate(BaseModel):
    subject_id: int | None = None
    name: str | None = None
    exam_date: date | None = None
    total_marks: int | None = Field(default=None, gt=0)
    target_marks: int | None = Field(default=None, gt=0)


class ExamResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    student_id: int
    subject_id: int
    name: str
    exam_date: date
    total_marks: int
    target_marks: int