from pydantic import BaseModel, ConfigDict


class SubjectCreate(BaseModel):
    name: str
    description: str | None = None
    color: str | None = None


class SubjectUpdate(BaseModel):
    name: str | None = None
    description: str | None = None
    color: str | None = None


class SubjectResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    student_id: int
    name: str
    description: str | None
    color: str | None