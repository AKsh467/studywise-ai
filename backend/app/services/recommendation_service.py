
from datetime import date, timedelta

from app.models.availability import Availability
from app.services.priority_service import get_student_topic_priorities


def get_study_recommendations(db, student_id: int):

    priorities = get_student_topic_priorities(db, student_id)

    pending_topics = [
        item for item in priorities
        if item["priority"]["level"] != "completed"
    ]

    if not pending_topics:
        return {
            "recommended_topic": None,
            "suggested_slot": None,
            "message": "All topics are completed!"
        }

    # Highest priority topic first
    recommended = pending_topics[0]

    availability_records = (
        db.query(Availability)
        .filter(Availability.student_id == student_id)
        .order_by(Availability.day_of_week, Availability.start_time)
        .all()
    )

    suggested_slot = None
    today = date.today()

    # Find the next available slot within 7 days
    for offset in range(7):
        target_date = today + timedelta(days=offset)

        for slot in availability_records:
            if slot.day_of_week == target_date.weekday():
                suggested_slot = {
                    "date": target_date.isoformat(),
                    "start_time": slot.start_time.isoformat(),
                    "end_time": slot.end_time.isoformat()
                }
                break

        if suggested_slot:
            break

    return {
        "recommended_topic": recommended,
        "suggested_slot": suggested_slot,
        "other_pending_topics": pending_topics[1:],
        "message": (
            "Study the highest-priority topic first"
            if suggested_slot
            else "No available study slot found in the next 7 days"
        )
    }
