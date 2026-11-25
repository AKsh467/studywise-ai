
from datetime import date, datetime, timedelta

from app.models.availability import Availability
from app.services.priority_service import get_student_topic_priorities


def generate_schedule(db, student_id: int, start_date: date, end_date: date):

    if end_date < start_date:
        raise ValueError("End date cannot be before start date")

    priorities = get_student_topic_priorities(db, student_id)

    eligible_topics = [
        item for item in priorities
        if item["priority"]["level"] != "completed"
    ]

    availability_records = (
        db.query(Availability)
        .filter(Availability.student_id == student_id)
        .order_by(Availability.day_of_week, Availability.start_time)
        .all()
    )

    if not availability_records or not eligible_topics:
        return []

    schedule = []
    current_date = start_date
    slot_index = 0

    while current_date <= end_date:

        day_slots = [
            slot for slot in availability_records
            if slot.day_of_week == current_date.weekday()
        ]

        for slot in day_slots:

            topic_data = eligible_topics[
                slot_index % len(eligible_topics)
            ]

            slot_index += 1

            start_datetime = datetime.combine(
                current_date, slot.start_time
            )

            end_datetime = datetime.combine(
                current_date, slot.end_time
            )

            schedule.append({
                "date": current_date.isoformat(),
                "start_time": start_datetime.time().isoformat(),
                "end_time": end_datetime.time().isoformat(),
                "topic_id": topic_data["topic_id"],
                "topic_name": topic_data["topic_name"],
                "subject_name": topic_data["subject_name"],
                "priority": topic_data["priority"]["score"]
            })

        current_date += timedelta(days=1)

    return schedule
