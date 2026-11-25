from datetime import date, datetime, time, timedelta
from app.core.database import SessionLocal, Base, engine
from app.models.student import Student
from app.models.subject import Subject
from app.models.topic import Topic
from app.models.exam import Exam
from app.models.availability import Availability
from app.models.study_session import StudySession


def seed_database():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    try:
        # Check if student already exists
        existing_student = db.query(Student).filter(Student.email == "alex.rivera@stanford.edu").first()
        if existing_student:
            print(f"Student '{existing_student.name}' already exists (ID: {existing_student.id}). Database already seeded!")
            return existing_student.id

        # 1. Create Student
        student = Student(
            name="Alex Rivera",
            email="alex.rivera@stanford.edu"
        )
        db.add(student)
        db.commit()
        db.refresh(student)
        print(f"Created student: {student.name} (ID: {student.id})")

        # 2. Create Subjects
        subjects_data = [
            {
                "name": "Artificial Intelligence & Machine Learning",
                "description": "CS 229",
                "color": "#5145E8"
            },
            {
                "name": "Distributed Systems & Cloud Computing",
                "description": "CS 244",
                "color": "#7C3AED"
            },
            {
                "name": "Database Systems & Storage Engines",
                "description": "CS 145",
                "color": "#0D9488"
            },
            {
                "name": "Design & Analysis of Algorithms",
                "description": "CS 161",
                "color": "#D97706"
            },
            {
                "name": "Computer & Network Security",
                "description": "CS 155",
                "color": "#FF735E"
            }
        ]

        created_subjects = []
        for s_data in subjects_data:
            subj = Subject(
                student_id=student.id,
                name=s_data["name"],
                description=s_data["description"],
                color=s_data["color"]
            )
            db.add(subj)
            db.commit()
            db.refresh(subj)
            created_subjects.append(subj)

        # 3. Create Topics for each subject
        topics_by_subject = [
            # Subj 1: AI & ML
            [
                ("Loss Functions, Backpropagation & Adam Optimizer", "Derivation of gradient descent and chain rule.", True),
                ("Convolutional Neural Networks & ResNet Residuals", "Kernel operations, pooling layers, and vanishing gradients.", True),
                ("Transformers, Self-Attention & Positional Encodings", "Query-Key-Value mechanism and multi-head attention.", False),
                ("Reinforcement Learning & Bellman Optimality", "Markov Decision Processes (MDPs), Q-Learning, and policy gradients.", False),
            ],
            # Subj 2: Distributed Systems
            [
                ("Raft Consensus Algorithm & Leader Election", "State machine replication, heartbeat logs, and split brain prevention.", True),
                ("CAP Theorem, PACELC & Consistency Models", "Strong vs eventual consistency, vector clocks, and linearizability.", False),
                ("Distributed Transactions & Two-Phase Commit", "Atomic commit protocols, prepare/commit phases, and recovery logs.", False),
            ],
            # Subj 3: Database Systems
            [
                ("B+ Tree Indexing & Buffer Pool Management", "Disk page layout, internal node splitting, and LRU cache eviction.", True),
                ("ACID Transactions & Strict 2PL Concurrency", "Conflict serializability, write-ahead logging (WAL), and ARIES recovery.", False),
                ("Query Optimization & Relational Algebra", "Cost-based optimizer, join algorithms (Hash Join, Sort-Merge).", False),
            ],
            # Subj 4: Algorithms
            [
                ("Dynamic Programming on Trees & DAGs", "Optimal substructure, memoization tables, and topological ordering.", True),
                ("Max Flow & Min-Cut Theorem", "Ford-Fulkerson algorithm, Edmonds-Karp, and residual networks.", False),
                ("NP-Completeness & Reductions", "Polynomial-time reductions, SAT, 3-SAT, Vertex Cover, and Clique.", False),
            ],
            # Subj 5: Security
            [
                ("RSA Cryptography & Diffie-Hellman Key Exchange", "Modular arithmetic, Euler totient, and discrete logarithm problem.", True),
                ("TLS 1.3 Handshake & Public Key Infrastructure", "Certificate authorities, forward secrecy, and session tickets.", False),
                ("Memory Safety, Buffer Overflows & ROP Chains", "Stack layout, canary defense, and return-oriented programming.", False),
            ]
        ]

        created_topics = []
        for subj, t_list in zip(created_subjects, topics_by_subject):
            for name, desc, completed in t_list:
                topic = Topic(
                    subject_id=subj.id,
                    name=name,
                    description=desc,
                    is_completed=completed
                )
                db.add(topic)
                db.commit()
                db.refresh(topic)
                created_topics.append(topic)

        # 4. Create Examinations
        today = date.today()
        exams_data = [
            (created_subjects[0].id, "Midterm Examination", today + timedelta(days=5), 100, 92),
            (created_subjects[1].id, "Midterm Evaluation", today + timedelta(days=12), 100, 88),
            (created_subjects[2].id, "Final Written Exam", today + timedelta(days=18), 100, 90),
            (created_subjects[3].id, "Comprehensive Test", today + timedelta(days=25), 100, 95),
            (created_subjects[4].id, "Lab Assessment", today + timedelta(days=32), 100, 85)
        ]

        for s_id, name, exam_date, total, target in exams_data:
            exam = Exam(
                student_id=student.id,
                subject_id=s_id,
                name=name,
                exam_date=exam_date,
                total_marks=total,
                target_marks=target
            )
            db.add(exam)
        db.commit()

        # 5. Create Weekly Availability Slots (Mon-Fri 09:00-11:00, 14:00-16:00; Sat 10:00-12:00)
        availabilities_data = [
            (0, time(9, 0), time(11, 0)),
            (0, time(14, 0), time(16, 0)),
            (1, time(9, 0), time(11, 0)),
            (1, time(14, 0), time(16, 0)),
            (2, time(9, 0), time(11, 0)),
            (2, time(14, 0), time(16, 0)),
            (3, time(9, 0), time(11, 0)),
            (3, time(14, 0), time(16, 0)),
            (4, time(9, 0), time(11, 0)),
            (4, time(14, 0), time(16, 0)),
            (5, time(10, 0), time(12, 0)),
        ]

        for dow, start, end in availabilities_data:
            avail = Availability(
                student_id=student.id,
                day_of_week=dow,
                start_time=start,
                end_time=end
            )
            db.add(avail)
        db.commit()

        # 6. Create completed study sessions for streak and history
        for i in range(7):
            past_day = datetime.now() - timedelta(days=i, hours=2)
            past_session = StudySession(
                student_id=student.id,
                topic_id=created_topics[i % len(created_topics)].id,
                started_at=past_day - timedelta(minutes=90),
                ended_at=past_day,
                duration_minutes=90,
                status="completed"
            )
            db.add(past_session)
        db.commit()

        print("Database seeded with sample student, subjects, topics, exams, availability, and sessions!")
        return student.id
    finally:
        db.close()


if __name__ == "__main__":
    seed_database()
