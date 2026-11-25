
from datetime import date
from pydantic import BaseModel, ConfigDict, Field, model_validator


class StudyPlanCreate(BaseModel):
    name: str = Field(min_length=1, max_length=150)
    start_date: date
    end_date: date

    @model_validator(mode="after")
    def validate_dates(self):
        if self.end_date < self.start_date:
            raise ValueError("End date cannot be before start date")
        return self


class StudyPlanUpdate(BaseModel):
    name: str | None = Field(default=None, min_length=1, max_length=150)
    start_date: date | None = None
    end_date: date | None = None


class StudyPlanResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    student_id: int
    name: str
    start_date: date
    end_date: date
    status: str
