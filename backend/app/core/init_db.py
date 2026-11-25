
from app.core.database import Base, engine

from app.models.student import Student
from app.models.subject import Subject
from app.models.topic import Topic
from app.models.exam import Exam
from app.models.availability import Availability
from app.models.study_plan import StudyPlan
from app.models.study_session import StudySession


def initialize_database():
    Base.metadata.create_all(bind=engine)

    print("StudyWise AI database initialized successfully!")
    print("Registered tables:", list(Base.metadata.tables.keys()))


if __name__ == "__main__":
    initialize_database()
