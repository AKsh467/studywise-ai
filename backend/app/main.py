from fastapi import Request
from fastapi.exceptions import RequestValidationError
from starlette.exceptions import HTTPException as StarletteHTTPException
from starlette.responses import JSONResponse

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.models import Student, Subject, Topic, Exam, Availability
from app.routers import students, subjects, topics, exams, availability
from app.models.study_plan import StudyPlan
from app.routers import study_plans
from app.routers import priorities
from app.routers import schedules
from app.routers import recommendations
from app.routers import study_sessions
from app.routers import dashboard

import os

app = FastAPI(
    title="StudyWise AI",
    description="Personalized Study Planning Assistant API",
    version="1.0.0"
)

allowed_origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]
env_origin = os.getenv("FRONTEND_URL")
if env_origin:
    allowed_origins.append(env_origin)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"] if os.getenv("ALLOW_ALL_ORIGINS", "true").lower() == "true" else allowed_origins,
    allow_origin_regex=r"https://.*(\.vercel\.app|\.onrender\.com|\.netlify\.app|\.railway\.app)",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.exception_handler(StarletteHTTPException)
async def http_exception_handler(request: Request, exc: StarletteHTTPException):
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "success": False,
            "message": "Request failed",
            "detail": exc.detail
        }
    )


@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    return JSONResponse(
        status_code=422,
        content={
            "success": False,
            "message": "Invalid request data",
            "detail": exc.errors()
        }
    )


@app.exception_handler(Exception)
async def general_exception_handler(request: Request, exc: Exception):
    return JSONResponse(
        status_code=500,
        content={
            "success": False,
            "message": "Internal server error",
            "detail": "An unexpected error occurred"
        }
    )

# Register API routers

app.include_router(students.router, prefix="/api/v1")
app.include_router(subjects.router, prefix="/api/v1")
app.include_router(topics.router, prefix="/api/v1")
app.include_router(exams.router, prefix="/api/v1")
app.include_router(availability.router, prefix="/api/v1")
app.include_router(study_plans.router, prefix="/api/v1")
app.include_router(priorities.router, prefix="/api/v1")
app.include_router(schedules.router, prefix="/api/v1")
app.include_router(recommendations.router, prefix="/api/v1")
app.include_router(study_sessions.router, prefix="/api/v1")
app.include_router(dashboard.router, prefix="/api/v1")

@app.get("/")
def home():
    return {
        "success": True,
        "message": "Welcome to StudyWise AI Backend!",
        "data": {
            "application": "StudyWise AI",
            "status": "running"
        }
    }


@app.get("/health")
def health_check():
    return {
        "success": True,
        "message": "Backend is healthy",
        "data": {
            "status": "healthy"
        }
    }
