import sys
import os
import pptx
from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN
from pptx.enum.shapes import MSO_SHAPE

def create_deck(output_path):
    prs = Presentation()
    prs.slide_width = Inches(13.333)
    prs.slide_height = Inches(7.5)
    blank_layout = prs.slide_layouts[6]

    # Theme Colors
    COLOR_BG_DARK = RGBColor(15, 23, 42)      # Slate 900
    COLOR_CARD_DARK = RGBColor(30, 41, 59)    # Slate 800
    COLOR_BG_LIGHT = RGBColor(248, 250, 252)  # Slate 50
    COLOR_CARD_LIGHT = RGBColor(255, 255, 255)# White
    COLOR_BORDER_LIGHT = RGBColor(226, 232, 240) # Slate 200
    
    COLOR_PRIMARY = RGBColor(53, 72, 212)     # Royal Blue (#3548D4)
    COLOR_ACCENT = RGBColor(166, 108, 255)    # Purple/Lilac (#A66CFF)
    COLOR_LIME = RGBColor(16, 185, 129)       # Emerald Mint (#10B981)
    COLOR_AMBER = RGBColor(245, 158, 11)      # Amber (#F59E0B)
    COLOR_CORAL = RGBColor(239, 68, 68)       # Red/Coral
    
    COLOR_TEXT_DARK = RGBColor(15, 23, 42)
    COLOR_TEXT_MUTED = RGBColor(100, 116, 139)
    COLOR_TEXT_LIGHT = RGBColor(255, 255, 255)
    COLOR_TEXT_LIGHT_MUTED = RGBColor(203, 213, 225)

    def set_shape_flat(shape, fill_color, border_color=None, border_width=1):
        shape.fill.solid()
        shape.fill.fore_color.rgb = fill_color
        if border_color:
            shape.line.color.rgb = border_color
            shape.line.width = Pt(border_width)
        else:
            shape.line.fill.background()

    def add_header(slide, slide_num_str, title_text, category_text="AGILE SOFTWARE DEVELOPMENT • PHASE 2 EVALUATION"):
        # Header banner
        header_bg = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(0), Inches(0), Inches(13.333), Inches(1.15))
        set_shape_flat(header_bg, COLOR_PRIMARY)

        # Category / Subtitle
        cat_box = slide.shapes.add_textbox(Inches(0.8), Inches(0.12), Inches(10), Inches(0.3))
        tf_cat = cat_box.text_frame
        tf_cat.word_wrap = True
        p_cat = tf_cat.paragraphs[0]
        p_cat.text = category_text.upper()
        p_cat.font.size = Pt(10)
        p_cat.font.bold = True
        p_cat.font.color.rgb = RGBColor(214, 239, 114) # Lime accent
        p_cat.font.name = "Calibri"

        # Main Title
        title_box = slide.shapes.add_textbox(Inches(0.8), Inches(0.38), Inches(10.5), Inches(0.65))
        tf_t = title_box.text_frame
        tf_t.word_wrap = True
        p_t = tf_t.paragraphs[0]
        p_t.text = title_text
        p_t.font.size = Pt(22)
        p_t.font.bold = True
        p_t.font.color.rgb = COLOR_TEXT_LIGHT
        p_t.font.name = "Calibri"

        # Slide Number Badge
        badge = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(11.8), Inches(0.25), Inches(0.8), Inches(0.65))
        set_shape_flat(badge, RGBColor(30, 41, 59), RGBColor(166, 108, 255), 1.5)
        tf_b = badge.text_frame
        p_b = tf_b.paragraphs[0]
        p_b.text = slide_num_str
        p_b.alignment = PP_ALIGN.CENTER
        p_b.font.size = Pt(14)
        p_b.font.bold = True
        p_b.font.color.rgb = COLOR_TEXT_LIGHT
        p_b.font.name = "Calibri"

    # ==========================================
    # SLIDE 1: COVER PAGE (ELEGANT HERO TITLE & CONSISTENT THEME)
    # ==========================================
    slide1 = prs.slides.add_slide(blank_layout)
    set_shape_flat(slide1.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(0), Inches(0), Inches(13.333), Inches(7.5)), COLOR_BG_LIGHT)

    # Top Left Decorative Accent Bar
    top_bar = slide1.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(0), Inches(0), Inches(13.333), Inches(0.12))
    set_shape_flat(top_bar, COLOR_PRIMARY)

    # Institution Pill Badge
    pill1 = slide1.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(1.0), Inches(0.6), Inches(6.8), Inches(0.42))
    set_shape_flat(pill1, RGBColor(238, 242, 255), RGBColor(199, 210, 254), 1.2) # Soft Indigo Tint
    p_pill = pill1.text_frame.paragraphs[0]
    p_pill.text = "BENNETT UNIVERSITY • SCSET | AGILE SOFTWARE DEVELOPMENT"
    p_pill.alignment = PP_ALIGN.CENTER
    p_pill.font.size = Pt(11)
    p_pill.font.bold = True
    p_pill.font.color.rgb = COLOR_PRIMARY

    # Right JIRA Pill Badge
    pill_jira = slide1.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(10.5), Inches(0.6), Inches(1.8), Inches(0.42))
    set_shape_flat(pill_jira, RGBColor(238, 242, 255), RGBColor(199, 210, 254), 1.2)
    p_pj = pill_jira.text_frame.paragraphs[0]
    p_pj.text = "JIRA KEY: SAP"
    p_pj.alignment = PP_ALIGN.CENTER
    p_pj.font.size = Pt(11)
    p_pj.font.bold = True
    p_pj.font.color.rgb = COLOR_PRIMARY

    # Prominent Hero Title Block
    title_box1 = slide1.shapes.add_textbox(Inches(0.95), Inches(1.2), Inches(11.5), Inches(1.8))
    tf1 = title_box1.text_frame
    tf1.word_wrap = True
    
    p1 = tf1.paragraphs[0]
    p1.text = "StudyWise AI"
    p1.font.size = Pt(54)
    p1.font.bold = True
    p1.font.color.rgb = COLOR_PRIMARY
    p1.font.name = "Calibri"

    p_sub1 = tf1.add_paragraph()
    p_sub1.text = "Personalized Study Planning Assistant"
    p_sub1.font.size = Pt(22)
    p_sub1.font.bold = True
    p_sub1.font.color.rgb = RGBColor(79, 70, 229) # Vibrant Indigo
    p_sub1.font.name = "Calibri"

    # Subtle Accent Line Divider
    div_line = slide1.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(1.0), Inches(3.2), Inches(11.333), Inches(0.04))
    set_shape_flat(div_line, RGBColor(226, 232, 240)) # Slate 200

    # Two Structured Content Cards Below
    c_top = Inches(3.5)
    c_h = Inches(3.4)

    # Left Card: Project Team
    card_team = slide1.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(1.0), c_top, Inches(6.2), c_h)
    set_shape_flat(card_team, COLOR_CARD_LIGHT, COLOR_BORDER_LIGHT, 1.5)
    tf_team = card_team.text_frame
    tf_team.word_wrap = True
    
    p_th = tf_team.paragraphs[0]
    p_th.text = "PROJECT TEAM (BATCH B-39)"
    p_th.font.size = Pt(13)
    p_th.font.bold = True
    p_th.font.color.rgb = COLOR_PRIMARY
    
    members = [
        ("Aksh Kumar Mishra", "S24CSEU1700", "Agile Project Manager & Planning Logic Developer"),
        ("Kartik Tyagi", "S24CSEU0643", "Frontend Developer (UI/UX & React Vite)"),
        ("Ritwick Kuchhal", "S24CSEU1691", "Backend Developer (FastAPI, SQLite & API Integration)")
    ]
    for name, roll, role in members:
        p_m = tf_team.add_paragraph()
        p_m.text = f"\n• {name}  [{roll}]"
        p_m.font.size = Pt(12)
        p_m.font.bold = True
        p_m.font.color.rgb = COLOR_TEXT_DARK
        
        p_r = tf_team.add_paragraph()
        p_r.text = f"   Role: {role}"
        p_r.font.size = Pt(10.5)
        p_r.font.color.rgb = COLOR_TEXT_MUTED

    # Right Card: Project & Evaluation Details
    card_eval = slide1.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(7.6), c_top, Inches(4.7), c_h)
    set_shape_flat(card_eval, COLOR_CARD_LIGHT, COLOR_BORDER_LIGHT, 1.5)
    tf_eval = card_eval.text_frame
    tf_eval.word_wrap = True
    
    p_eh = tf_eval.paragraphs[0]
    p_eh.text = "PROJECT & JIRA DETAILS"
    p_eh.font.size = Pt(13)
    p_eh.font.bold = True
    p_eh.font.color.rgb = COLOR_PRIMARY

    eval_items = [
        ("Faculty / Evaluator:", "Sachin Kumar"),
        ("Course:", "Agile Software Development"),
        ("Batch / Section:", "B-39 (SCSET, Bennett University)"),
        ("JIRA Project Name:", "StudyWise AI project (SAP)"),
        ("JIRA Board URL:", "akshmishra.atlassian.net/.../SAP/boards/203")
    ]
    for label, val in eval_items:
        p_l = tf_eval.add_paragraph()
        p_l.text = f"\n• {label}"
        p_l.font.size = Pt(11)
        p_l.font.bold = True
        p_l.font.color.rgb = COLOR_TEXT_DARK
        
        p_v = tf_eval.add_paragraph()
        p_v.text = f"   {val}"
        p_v.font.size = Pt(10.5)
        p_v.font.color.rgb = COLOR_TEXT_MUTED

    # ==========================================
    # SLIDE 2: PROJECT OVERVIEW & AGILE FRAMEWORK
    # ==========================================
    slide2 = prs.slides.add_slide(blank_layout)
    set_shape_flat(slide2.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(0), Inches(0), Inches(13.333), Inches(7.5)), COLOR_BG_LIGHT)
    add_header(slide2, "02", "Project Overview & Agile Framework")

    # 3 Columns
    col_w = Inches(3.65)
    gap = Inches(0.4)
    start_x = Inches(0.8)
    top_y = Inches(1.5)
    col_h = Inches(5.4)

    # Col 1: Problem & Vision
    c1 = slide2.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, start_x, top_y, col_w, col_h)
    set_shape_flat(c1, COLOR_CARD_LIGHT, COLOR_BORDER_LIGHT, 1.5)
    tf = c1.text_frame
    tf.word_wrap = True
    p = tf.paragraphs[0]
    p.text = "THE PROBLEM & SOLUTION"
    p.font.size = Pt(14)
    p.font.bold = True
    p.font.color.rgb = COLOR_PRIMARY
    
    items_c1 = [
        ("Academic Struggle", "Students struggle to organize multi-subject courses, finish syllabi on time, and maintain consistent focus."),
        ("StudyWise AI Vision", "A centralized assistant providing personalized study planning, deterministic scheduling, and progress telemetry."),
        ("Key Value Proposition", "Goes beyond a static timetable to answer: What to study, When to study, How much is completed, and What to prioritize next.")
    ]
    for h, b in items_c1:
        p_h = tf.add_paragraph()
        p_h.text = f"\n• {h}:"
        p_h.font.size = Pt(12)
        p_h.font.bold = True
        p_h.font.color.rgb = COLOR_TEXT_DARK
        p_b = tf.add_paragraph()
        p_b.text = f"  {b}"
        p_b.font.size = Pt(11)
        p_b.font.color.rgb = COLOR_TEXT_MUTED

    # Col 2: Technology Stack
    c2 = slide2.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, start_x + col_w + gap, top_y, col_w, col_h)
    set_shape_flat(c2, COLOR_CARD_LIGHT, COLOR_BORDER_LIGHT, 1.5)
    tf = c2.text_frame
    tf.word_wrap = True
    p = tf.paragraphs[0]
    p.text = "SYSTEM ARCHITECTURE"
    p.font.size = Pt(14)
    p.font.bold = True
    p.font.color.rgb = COLOR_PRIMARY

    items_c2 = [
        ("Frontend Application", "React 19, Vite, TypeScript, Tailwind CSS v4, Lucide Icons, Three.js 3D WebGL visuals."),
        ("Backend Services", "Python 3.11, FastAPI REST API framework, Pydantic v2 validation models."),
        ("Database Engine", "SQLite relational database managed with SQLAlchemy ORM."),
        ("Dev & Agile Tooling", "Jira Software Cloud, Git version control, GitHub repository, Pytest suite.")
    ]
    for h, b in items_c2:
        p_h = tf.add_paragraph()
        p_h.text = f"\n• {h}:"
        p_h.font.size = Pt(12)
        p_h.font.bold = True
        p_h.font.color.rgb = COLOR_TEXT_DARK
        p_b = tf.add_paragraph()
        p_b.text = f"  {b}"
        p_b.font.size = Pt(11)
        p_b.font.color.rgb = COLOR_TEXT_MUTED

    # Col 3: Scrum & DoD
    c3 = slide2.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, start_x + (col_w + gap) * 2, top_y, col_w, col_h)
    set_shape_flat(c3, COLOR_CARD_LIGHT, COLOR_BORDER_LIGHT, 1.5)
    tf = c3.text_frame
    tf.word_wrap = True
    p = tf.paragraphs[0]
    p.text = "SCRUM PROCESS & DoD"
    p.font.size = Pt(14)
    p.font.bold = True
    p.font.color.rgb = COLOR_PRIMARY

    items_c3 = [
        ("Agile Methodology", "Scrum Framework with 2-week sprint cadences across 4 planned sprints."),
        ("Definition of Done (DoD)", "1. Features coded to acceptance criteria\n2. Relevant unit & integration tests pass\n3. Full-stack integration verified\n4. Zero critical defects remain\n5. Committed to GitHub & Jira updated."),
        ("Sprint Retrospectives", "Bi-weekly reviews tracking team velocity, blockers, and process optimizations.")
    ]
    for h, b in items_c3:
        p_h = tf.add_paragraph()
        p_h.text = f"\n• {h}:"
        p_h.font.size = Pt(12)
        p_h.font.bold = True
        p_h.font.color.rgb = COLOR_TEXT_DARK
        p_b = tf.add_paragraph()
        p_b.text = f"  {b}"
        p_b.font.size = Pt(11)
        p_b.font.color.rgb = COLOR_TEXT_MUTED

    # ==========================================
    # SLIDE 3: PRODUCT BACKLOG & EPICS
    # ==========================================
    slide3 = prs.slides.add_slide(blank_layout)
    set_shape_flat(slide3.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(0), Inches(0), Inches(13.333), Inches(7.5)), COLOR_BG_LIGHT)
    add_header(slide3, "03", "Product Backlog & Epic Breakdown (JIRA: SAP)")

    # 4 Stat Metric Cards at Top
    m_w = Inches(2.7)
    m_h = Inches(1.1)
    m_gap = Inches(0.31)
    m_y = Inches(1.4)
    metrics = [
        ("TOTAL EPICS", "5", "Feature Domains", COLOR_PRIMARY),
        ("USER STORIES", "15", "All User Stories Done", COLOR_ACCENT),
        ("STORY POINTS", "70 / 70", "100% Completion Rate", COLOR_LIME),
        ("SPRINT CYCLES", "4 Sprints", "Zero Carry-Over Items", COLOR_AMBER)
    ]
    for i, (label, val, sub, color) in enumerate(metrics):
        mx = start_x + (m_w + m_gap) * i
        mc = slide3.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, mx, m_y, m_w, m_h)
        set_shape_flat(mc, COLOR_CARD_LIGHT, COLOR_BORDER_LIGHT, 1.5)
        mtf = mc.text_frame
        mtf.word_wrap = True
        mp1 = mtf.paragraphs[0]
        mp1.text = label
        mp1.font.size = Pt(10)
        mp1.font.bold = True
        mp1.font.color.rgb = COLOR_TEXT_MUTED
        
        mp2 = mtf.add_paragraph()
        mp2.text = val
        mp2.font.size = Pt(20)
        mp2.font.bold = True
        mp2.font.color.rgb = color
        
        mp3 = mtf.add_paragraph()
        mp3.text = sub
        mp3.font.size = Pt(9)
        mp3.font.color.rgb = COLOR_TEXT_MUTED

    # 5 Epic Breakdown Cards
    e_y = Inches(2.7)
    e_h = Inches(4.3)
    e_w = Inches(2.2)
    e_gap = Inches(0.18)
    
    epics_data = [
        ("SAP-1", "Academic Management", "18 Pts • Sprint 1", [
            "SAP-6: Create Student Profile (2 pts)",
            "SAP-7: Manage Subjects (5 pts)",
            "SAP-8: Manage Topics (6 pts)",
            "SAP-9: Manage Examinations (5 pts)"
        ], COLOR_PRIMARY),
        ("SAP-2", "Study Planning", "20 Pts • Sprint 2", [
            "SAP-10: Set Availability (3 pts)",
            "SAP-11: Create Study Plan (3 pts)",
            "SAP-12: Generate Schedule (8 pts)",
            "SAP-13: View Calendar (6 pts)"
        ], COLOR_ACCENT),
        ("SAP-3", "Progress Management", "16 Pts • Sprint 3", [
            "SAP-14: Track Study Sessions (5 pts)",
            "SAP-15: Monitor Progress (5 pts)",
            "SAP-17: Mark Missed Sessions (3 pts)"
        ], COLOR_LIME),
        ("SAP-4", "Adaptive Scheduling", "8 Pts • Sprint 4", [
            "SAP-18: Adjust Study Schedule (8 pts)",
            "Non-linear workload rebalancing",
            "Missed session recovery engine"
        ], COLOR_AMBER),
        ("SAP-5", "Analytics & Insights", "8 Pts • Sprints 3-4", [
            "SAP-16: View Study Analytics (3 pts)",
            "SAP-19: Study Recommendations (5 pts)",
            "SAP-20: Academic Dashboard (3 pts)"
        ], COLOR_CORAL)
    ]

    for i, (key, title, pts_sprint, stories, col) in enumerate(epics_data):
        ex = start_x + (e_w + e_gap) * i
        ec = slide3.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, ex, e_y, e_w, e_h)
        set_shape_flat(ec, COLOR_CARD_LIGHT, COLOR_BORDER_LIGHT, 1.5)
        etf = ec.text_frame
        etf.word_wrap = True
        
        ep1 = etf.paragraphs[0]
        ep1.text = key
        ep1.font.size = Pt(11)
        ep1.font.bold = True
        ep1.font.color.rgb = col
        
        ep2 = etf.add_paragraph()
        ep2.text = title
        ep2.font.size = Pt(12)
        ep2.font.bold = True
        ep2.font.color.rgb = COLOR_TEXT_DARK
        
        ep3 = etf.add_paragraph()
        ep3.text = pts_sprint
        ep3.font.size = Pt(10)
        ep3.font.color.rgb = COLOR_TEXT_MUTED
        
        for st in stories:
            ep_s = etf.add_paragraph()
            ep_s.text = f"\n✓ {st}"
            ep_s.font.size = Pt(10)
            ep_s.font.color.rgb = COLOR_TEXT_DARK

    # ==========================================
    # SLIDE 4: SPRINT 1 & SPRINT 2 DELIVERABLES
    # ==========================================
    slide4 = prs.slides.add_slide(blank_layout)
    set_shape_flat(slide4.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(0), Inches(0), Inches(13.333), Inches(7.5)), COLOR_BG_LIGHT)
    add_header(slide4, "04", "Sprint Execution & Deliverables: Sprints 1 & 2")

    panel_w = Inches(5.6)
    panel_h = Inches(5.5)
    
    # Left Panel: Sprint 1
    p1_card = slide4.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, start_x, top_y, panel_w, panel_h)
    set_shape_flat(p1_card, COLOR_CARD_LIGHT, COLOR_BORDER_LIGHT, 1.5)
    tf1 = p1_card.text_frame
    tf1.word_wrap = True
    
    pt1 = tf1.paragraphs[0]
    pt1.text = "SPRINT 1: ACADEMIC FOUNDATION"
    pt1.font.size = Pt(15)
    pt1.font.bold = True
    pt1.font.color.rgb = COLOR_PRIMARY
    
    s1_details = [
        ("Sprint Cadence & Goal", "10 Oct – 24 Oct 2026 | Goal Met: YES\nEstablish student profile, subjects, topics, and examinations."),
        ("Committed vs Completed", "18 Story Points Committed • 18 Story Points Completed (100%)"),
        ("Delivered User Stories", "• SAP-6: Create Student Profile (2 pts) — Kartik Tyagi\n• SAP-7: Manage Subjects (5 pts) — Ritwick Kuchhal\n• SAP-8: Manage Topics (6 pts) — Ritwick Kuchhal\n• SAP-9: Manage Examinations (5 pts) — Ritwick Kuchhal"),
        ("Demonstrated Deliverables", "1. Academic Dossier: Student profile management & storage.\n2. Course Atlas: Subject catalog with color accents & metadata.\n3. Topic Taxonomy: Sub-topic concept checklist & hierarchy.\n4. Examination Milestone Registry: Target marks & test schedules."),
        ("Sprint Retrospective", "What went well: All 4 stories done, clear role split.\nImprovement: Increase inter-team updates & test documentation.")
    ]
    for h, b in s1_details:
        ph = tf1.add_paragraph()
        ph.text = f"\n• {h}:"
        ph.font.size = Pt(11)
        ph.font.bold = True
        ph.font.color.rgb = COLOR_TEXT_DARK
        pb = tf1.add_paragraph()
        pb.text = f"  {b}"
        pb.font.size = Pt(10)
        pb.font.color.rgb = COLOR_TEXT_MUTED

    # Right Panel: Sprint 2
    p2_card = slide4.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, start_x + panel_w + gap, top_y, panel_w, panel_h)
    set_shape_flat(p2_card, COLOR_CARD_LIGHT, COLOR_BORDER_LIGHT, 1.5)
    tf2 = p2_card.text_frame
    tf2.word_wrap = True
    
    pt2 = tf2.paragraphs[0]
    pt2.text = "SPRINT 2: STUDY PLANNING & CALENDAR"
    pt2.font.size = Pt(15)
    pt2.font.bold = True
    pt2.font.color.rgb = COLOR_ACCENT

    s2_details = [
        ("Sprint Cadence & Goal", "2 Nov – 7 Nov 2026 | Goal Met: YES\nDefine availability, generate study plans and schedules in calendar."),
        ("Committed vs Completed", "20 Story Points Committed • 20 Story Points Completed (100%)"),
        ("Delivered User Stories", "• SAP-10: Set Study Availability (3 pts) — Ritwick Kuchhal\n• SAP-11: Create Study Plan (3 pts) — Aksh Mishra\n• SAP-12: Generate Study Schedule (8 pts) — Aksh Mishra\n• SAP-13: View Schedule Calendar (6 pts) — Kartik Tyagi"),
        ("Demonstrated Deliverables", "1. Time-Space Matrix: Weekly 7-day availability matrix & focus slots.\n2. Plan Generator: Heuristic schedule synthesis with date horizons.\n3. Scheduling Engine: Conflict-free time slot & priority allocation.\n4. Dimensional Calendar: Multi-perspective day, week & list agenda."),
        ("Sprint Retrospective", "What went well: Complex scheduling algorithm implemented.\nImprovement: Continuous integration testing between UI & API.")
    ]
    for h, b in s2_details:
        ph = tf2.add_paragraph()
        ph.text = f"\n• {h}:"
        ph.font.size = Pt(11)
        ph.font.bold = True
        ph.font.color.rgb = COLOR_TEXT_DARK
        pb = tf2.add_paragraph()
        pb.text = f"  {b}"
        pb.font.size = Pt(10)
        pb.font.color.rgb = COLOR_TEXT_MUTED

    # ==========================================
    # SLIDE 5: SPRINT 3 & SPRINT 4 DELIVERABLES
    # ==========================================
    slide5 = prs.slides.add_slide(blank_layout)
    set_shape_flat(slide5.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(0), Inches(0), Inches(13.333), Inches(7.5)), COLOR_BG_LIGHT)
    add_header(slide5, "05", "Sprint Execution & Deliverables: Sprints 3 & 4")

    # Left Panel: Sprint 3
    p3_card = slide5.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, start_x, top_y, panel_w, panel_h)
    set_shape_flat(p3_card, COLOR_CARD_LIGHT, COLOR_BORDER_LIGHT, 1.5)
    tf3 = p3_card.text_frame
    tf3.word_wrap = True
    
    pt3 = tf3.paragraphs[0]
    pt3.text = "SPRINT 3: PROGRESS TRACKING & ANALYTICS"
    pt3.font.size = Pt(15)
    pt3.font.bold = True
    pt3.font.color.rgb = COLOR_LIME

    s3_details = [
        ("Sprint Cadence & Goal", "9 Nov – 15 Nov 2026 | Goal Met: YES\nTrack completed sessions, monitor progress, view analytics & missed slots."),
        ("Committed vs Completed", "16 Story Points Committed • 16 Story Points Completed (100%)"),
        ("Delivered User Stories", "• SAP-14: Track Study Sessions (5 pts) — Ritwick Kuchhal\n• SAP-15: Monitor Study Progress (5 pts) — Ritwick Kuchhal\n• SAP-16: View Study Analytics (3 pts) — Kartik Tyagi\n• SAP-17: Mark Missed Sessions (3 pts) — Ritwick Kuchhal"),
        ("Demonstrated Deliverables", "1. Study Session Logging: Live session start, complete, & duration tracking.\n2. Progress Monitoring: Subject-wise completion rate & concept tallies.\n3. Telemetry Visuals: Recharts study velocity & syllabus completion.\n4. Missed Session Handling: Mark unattended study blocks for recovery."),
        ("Sprint Retrospective", "What went well: High precision in progress calculation formulas.\nImprovement: Automate detection of missed sessions based on time.")
    ]
    for h, b in s3_details:
        ph = tf3.add_paragraph()
        ph.text = f"\n• {h}:"
        ph.font.size = Pt(11)
        ph.font.bold = True
        ph.font.color.rgb = COLOR_TEXT_DARK
        pb = tf3.add_paragraph()
        pb.text = f"  {b}"
        pb.font.size = Pt(10)
        pb.font.color.rgb = COLOR_TEXT_MUTED

    # Right Panel: Sprint 4
    p4_card = slide5.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, start_x + panel_w + gap, top_y, panel_w, panel_h)
    set_shape_flat(p4_card, COLOR_CARD_LIGHT, COLOR_BORDER_LIGHT, 1.5)
    tf4 = p4_card.text_frame
    tf4.word_wrap = True
    
    pt4 = tf4.paragraphs[0]
    pt4.text = "SPRINT 4: ADAPTIVE INTELLIGENCE & DASHBOARD"
    pt4.font.size = Pt(15)
    pt4.font.bold = True
    pt4.font.color.rgb = COLOR_AMBER

    s4_details = [
        ("Sprint Cadence & Goal", "16 Nov – 22 Nov 2026 | Goal Met: YES\nImplement adaptive rescheduling, recommendations & academic dashboard."),
        ("Committed vs Completed", "16 Story Points Committed • 16 Story Points Completed (100%)"),
        ("Delivered User Stories", "• SAP-18: Adjust Study Schedule (8 pts) — Aksh Mishra\n• SAP-19: Generate Study Recommendations (5 pts) — Aksh Mishra\n• SAP-20: View Academic Dashboard (3 pts) — Kartik Tyagi"),
        ("Demonstrated Deliverables", "1. Adaptive Recovery: Workload rebalancing for missed study sessions.\n2. AI Insights Engine: Topic priority scoring based on exam proximity.\n3. Academic Cockpit: Central dashboard with streak pass ticket & exams.\n4. Daily Focus Agenda: Today's study blocks with confetti celebration."),
        ("Sprint Retrospective", "What went well: All 70 planned story points successfully finished!\nImprovement: Transition to real-world pilot user feedback.")
    ]
    for h, b in s4_details:
        ph = tf4.add_paragraph()
        ph.text = f"\n• {h}:"
        ph.font.size = Pt(11)
        ph.font.bold = True
        ph.font.color.rgb = COLOR_TEXT_DARK
        pb = tf4.add_paragraph()
        pb.text = f"  {b}"
        pb.font.size = Pt(10)
        pb.font.color.rgb = COLOR_TEXT_MUTED

    # ==========================================
    # SLIDE 6: SPRINT METRICS & VELOCITY ANALYSIS
    # ==========================================
    slide6 = prs.slides.add_slide(blank_layout)
    set_shape_flat(slide6.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(0), Inches(0), Inches(13.333), Inches(7.5)), COLOR_BG_LIGHT)
    add_header(slide6, "06", "Agile Performance Metrics & Velocity Analysis")

    # Table of Sprints (Left Column, Width 5.6)
    table_card = slide6.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, start_x, top_y, Inches(6.0), Inches(5.5))
    set_shape_flat(table_card, COLOR_CARD_LIGHT, COLOR_BORDER_LIGHT, 1.5)
    ttf = table_card.text_frame
    ttf.word_wrap = True
    tp = ttf.paragraphs[0]
    tp.text = "SPRINT VELOCITY & BURNDOWN AUDIT"
    tp.font.size = Pt(14)
    tp.font.bold = True
    tp.font.color.rgb = COLOR_PRIMARY

    # Add Table
    table_shape = slide6.shapes.add_table(5, 4, start_x + Inches(0.2), top_y + Inches(0.8), Inches(5.6), Inches(2.8))
    table = table_shape.table
    table.columns[0].width = Inches(2.2)
    table.columns[1].width = Inches(1.1)
    table.columns[2].width = Inches(1.1)
    table.columns[3].width = Inches(1.2)

    headers = ["Sprint Name", "Committed", "Completed", "Goal Met?"]
    for j, h in enumerate(headers):
        cell = table.cell(0, j)
        cell.fill.solid()
        cell.fill.fore_color.rgb = COLOR_PRIMARY
        p = cell.text_frame.paragraphs[0]
        p.text = h
        p.font.size = Pt(11)
        p.font.bold = True
        p.font.color.rgb = COLOR_TEXT_LIGHT

    rows_data = [
        ("Sprint 1 – Academic Foundation", "18 pts", "18 pts", "YES (100%)"),
        ("Sprint 2 – Study Planning", "20 pts", "20 pts", "YES (100%)"),
        ("Sprint 3 – Progress Tracking", "16 pts", "16 pts", "YES (100%)"),
        ("Sprint 4 – Adaptive Intelligence", "16 pts", "16 pts", "YES (100%)")
    ]
    for i, row in enumerate(rows_data):
        for j, val in enumerate(row):
            cell = table.cell(i+1, j)
            p = cell.text_frame.paragraphs[0]
            p.text = val
            p.font.size = Pt(10)
            if j == 3:
                p.font.bold = True
                p.font.color.rgb = COLOR_LIME
            else:
                p.font.color.rgb = COLOR_TEXT_DARK

    # Summary underneath table
    summary_box = slide6.shapes.add_textbox(start_x + Inches(0.2), top_y + Inches(3.8), Inches(5.6), Inches(1.4))
    stf = summary_box.text_frame
    stf.word_wrap = True
    sp1 = stf.paragraphs[0]
    sp1.text = "• Total Story Points: 70 Planned / 70 Completed"
    sp1.font.size = Pt(12)
    sp1.font.bold = True
    sp1.font.color.rgb = COLOR_TEXT_DARK
    sp2 = stf.add_paragraph()
    sp2.text = "• Average Team Velocity: 17.5 Story Points / Sprint"
    sp2.font.size = Pt(12)
    sp2.font.bold = True
    sp2.font.color.rgb = COLOR_ACCENT
    sp3 = stf.add_paragraph()
    sp3.text = "• Scope Change Rate: 0.0% (Stable backlog commitment)"
    sp3.font.size = Pt(11)
    sp3.font.color.rgb = COLOR_TEXT_MUTED

    # Right Column: Insights & Interpretation (Width 5.6)
    right_card = slide6.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, start_x + Inches(6.3), top_y, Inches(5.4), Inches(5.5))
    set_shape_flat(right_card, COLOR_CARD_LIGHT, COLOR_BORDER_LIGHT, 1.5)
    rtf = right_card.text_frame
    rtf.word_wrap = True
    rp = rtf.paragraphs[0]
    rp.text = "AGILE CHART INTERPRETATION"
    rp.font.size = Pt(14)
    rp.font.bold = True
    rp.font.color.rgb = COLOR_PRIMARY

    interpretations = [
        ("Burndown Trajectory Analysis", "In Sprints 1 through 4, actual remaining points moved down along the guideline to zero. There were no mid-sprint scope creep spikes or stalled bottlenecks, demonstrating disciplined task completion."),
        ("Velocity Consistency", "Team delivered 18, 20, 16, and 16 points across Sprints 1–4. The slight variation reflects differences in algorithm complexity (Sprint 2 schedule generator: 8 pts) versus UI refinement."),
        ("Capacity Planning Validity", "The 17.5 pts/sprint velocity baseline establishes reliable forecasting for future Phase 3 feature development."),
        ("Definition of Done Verification", "Zero carry-over stories confirms that acceptance criteria, code reviews, and integration verification were properly enforced before sprint closure.")
    ]
    for h, b in interpretations:
        rph = rtf.add_paragraph()
        rph.text = f"\n• {h}:"
        rph.font.size = Pt(11)
        rph.font.bold = True
        rph.font.color.rgb = COLOR_TEXT_DARK
        rpb = rtf.add_paragraph()
        rpb.text = f"  {b}"
        rpb.font.size = Pt(10)
        rpb.font.color.rgb = COLOR_TEXT_MUTED

    # ==========================================
    # SLIDE 7: JIRA LABS 1, 2, 3
    # ==========================================
    slide7 = prs.slides.add_slide(blank_layout)
    set_shape_flat(slide7.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(0), Inches(0), Inches(13.333), Inches(7.5)), COLOR_BG_LIGHT)
    add_header(slide7, "07", "JIRA Lab Coverage: Labs 1, 2 & 3 (Boards & Flow Analytics)")

    # 3 Column Cards
    col3_w = Inches(3.65)
    
    # Lab 1
    l1_c = slide7.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, start_x, top_y, col3_w, col_h)
    set_shape_flat(l1_c, COLOR_CARD_LIGHT, COLOR_BORDER_LIGHT, 1.5)
    tf = l1_c.text_frame
    tf.word_wrap = True
    p = tf.paragraphs[0]
    p.text = "LAB 1: SCRUM VS KANBAN"
    p.font.size = Pt(13)
    p.font.bold = True
    p.font.color.rgb = COLOR_PRIMARY
    
    l1_items = [
        ("JIRA Issue Key", "SAP-21 (Done)"),
        ("Objective", "Analyze and compare Scrum and Kanban boards on planning, backlogs, WIP, and reports."),
        ("Scrum Board", "Organized into fixed 2-week sprints with committed story points and burndown charts."),
        ("Kanban Board", "Configured continuous queue with To Do, In Progress, Done columns."),
        ("Decision & Rationale", "Selected Scrum as primary framework due to iterative milestone targets and sprint planning estimation.")
    ]
    for h, b in l1_items:
        ph = tf.add_paragraph()
        ph.text = f"\n• {h}:"
        ph.font.size = Pt(11)
        ph.font.bold = True
        ph.font.color.rgb = COLOR_TEXT_DARK
        pb = tf.add_paragraph()
        pb.text = f"  {b}"
        pb.font.size = Pt(10)
        pb.font.color.rgb = COLOR_TEXT_MUTED

    # Lab 2
    l2_c = slide7.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, start_x + col3_w + gap, top_y, col3_w, col_h)
    set_shape_flat(l2_c, COLOR_CARD_LIGHT, COLOR_BORDER_LIGHT, 1.5)
    tf = l2_c.text_frame
    tf.word_wrap = True
    p = tf.paragraphs[0]
    p.text = "LAB 2: BURNDOWN & VELOCITY"
    p.font.size = Pt(13)
    p.font.bold = True
    p.font.color.rgb = COLOR_ACCENT

    l2_items = [
        ("JIRA Issue Key", "SAP-22 (Done)"),
        ("Objective", "Generate and interpret Burndown and Velocity reports across multiple sprints."),
        ("Sprint 1 Burndown", "Tracked 18 points burned down to 0 over 2-week cycle with all 4 stories delivered."),
        ("Sprint 2 Burndown", "Tracked 20 points burned down to 0; verified planning logic deliverable."),
        ("Velocity Metric", "Achieved an average of 17.5 story points per sprint across all 4 sprints, demonstrating steady output.")
    ]
    for h, b in l2_items:
        ph = tf.add_paragraph()
        ph.text = f"\n• {h}:"
        ph.font.size = Pt(11)
        ph.font.bold = True
        ph.font.color.rgb = COLOR_TEXT_DARK
        pb = tf.add_paragraph()
        pb.text = f"  {b}"
        pb.font.size = Pt(10)
        pb.font.color.rgb = COLOR_TEXT_MUTED

    # Lab 3
    l3_c = slide7.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, start_x + (col3_w + gap) * 2, top_y, col3_w, col_h)
    set_shape_flat(l3_c, COLOR_CARD_LIGHT, COLOR_BORDER_LIGHT, 1.5)
    tf = l3_c.text_frame
    tf.word_wrap = True
    p = tf.paragraphs[0]
    p.text = "LAB 3: KANBAN ANALYTICS"
    p.font.size = Pt(13)
    p.font.bold = True
    p.font.color.rgb = COLOR_LIME

    l3_items = [
        ("JIRA Issue Key", "SAP-23 (Done)"),
        ("Objective", "Cumulative Flow Diagram (CFD) and Control Chart to identify workflow bottlenecks."),
        ("CFD Findings", "Tracked 23 total work items across To Do, In Progress, In Review, Testing, Done. Verified steady flow into Done."),
        ("Control Chart Findings", "Average cycle time: 6 days 23 hours; minimum/median < 1 minute; rolling average 12.5 days."),
        ("Bottleneck Prevention", "Identified and resolved work stagnation in 'In Review' via automated transitions.")
    ]
    for h, b in l3_items:
        ph = tf.add_paragraph()
        ph.text = f"\n• {h}:"
        ph.font.size = Pt(11)
        ph.font.bold = True
        ph.font.color.rgb = COLOR_TEXT_DARK
        pb = tf.add_paragraph()
        pb.text = f"  {b}"
        pb.font.size = Pt(10)
        pb.font.color.rgb = COLOR_TEXT_MUTED

    # ==========================================
    # SLIDE 8: JIRA LABS 4, 5, 6
    # ==========================================
    slide8 = prs.slides.add_slide(blank_layout)
    set_shape_flat(slide8.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(0), Inches(0), Inches(13.333), Inches(7.5)), COLOR_BG_LIGHT)
    add_header(slide8, "08", "JIRA Lab Coverage: Labs 4, 5 & 6 (Automation, JQL & Dashboards)")

    # Lab 4
    l4_c = slide8.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, start_x, top_y, col3_w, col_h)
    set_shape_flat(l4_c, COLOR_CARD_LIGHT, COLOR_BORDER_LIGHT, 1.5)
    tf = l4_c.text_frame
    tf.word_wrap = True
    p = tf.paragraphs[0]
    p.text = "LAB 4: AUTOMATION RULES"
    p.font.size = Pt(13)
    p.font.bold = True
    p.font.color.rgb = COLOR_PRIMARY

    l4_items = [
        ("JIRA Issue Keys", "SAP-24, SAP-25 (Done)"),
        ("Auto-Assignment Rule", "Trigger: Work Item Created\nAction: Assign work item to user who triggered event (tested with SAP-25 in 1.03s)."),
        ("Auto-Transition Rule", "Trigger: Work Item Created\nAction: Automatically transition newly created items to 'In Progress'."),
        ("Audit Log Verification", "Both automation rules verified through Jira Audit Log with Success status and zero execution failures.")
    ]
    for h, b in l4_items:
        ph = tf.add_paragraph()
        ph.text = f"\n• {h}:"
        ph.font.size = Pt(11)
        ph.font.bold = True
        ph.font.color.rgb = COLOR_TEXT_DARK
        pb = tf.add_paragraph()
        pb.text = f"  {b}"
        pb.font.size = Pt(10)
        pb.font.color.rgb = COLOR_TEXT_MUTED

    # Lab 5
    l5_c = slide8.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, start_x + col3_w + gap, top_y, col3_w, col_h)
    set_shape_flat(l5_c, COLOR_CARD_LIGHT, COLOR_BORDER_LIGHT, 1.5)
    tf = l5_c.text_frame
    tf.word_wrap = True
    p = tf.paragraphs[0]
    p.text = "LAB 5: ADVANCED JQL & FILTERS"
    p.font.size = Pt(13)
    p.font.bold = True
    p.font.color.rgb = COLOR_ACCENT

    l5_items = [
        ("JIRA Issue Key", "SAP-26 (Done)"),
        ("1. Assigned Issues", "project = SAP AND assignee = currentUser() ORDER BY priority DESC"),
        ("2. In Progress Issues", "project = SAP AND status = 'In Progress' ORDER BY updated DESC"),
        ("3. Active Sprint", "project = SAP AND sprint in openSprints() ORDER BY Rank ASC"),
        ("4. Recently Created", "project = SAP AND created >= startOfWeek(-1) ORDER BY created DESC"),
        ("Email Subscription", "Configured daily email digest at 7:00 PM IST for 'SAP – In Progress Issues' filter.")
    ]
    for h, b in l5_items:
        ph = tf.add_paragraph()
        ph.text = f"\n• {h}:"
        ph.font.size = Pt(11)
        ph.font.bold = True
        ph.font.color.rgb = COLOR_TEXT_DARK
        pb = tf.add_paragraph()
        pb.text = f"  {b}"
        pb.font.size = Pt(10)
        pb.font.color.rgb = COLOR_TEXT_MUTED

    # Lab 6
    l6_c = slide8.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, start_x + (col3_w + gap) * 2, top_y, col3_w, col_h)
    set_shape_flat(l6_c, COLOR_CARD_LIGHT, COLOR_BORDER_LIGHT, 1.5)
    tf = l6_c.text_frame
    tf.word_wrap = True
    p = tf.paragraphs[0]
    p.text = "LAB 6: CUSTOM DASHBOARD"
    p.font.size = Pt(13)
    p.font.bold = True
    p.font.color.rgb = COLOR_LIME

    l6_items = [
        ("JIRA Issue Key", "SAP-27 (Done)"),
        ("Dashboard Name", "'StudyWise AI – Project Dashboard'"),
        ("Gadget 1: Sprint Health", "Monitors time elapsed, scope change, assignees, and overall points."),
        ("Gadget 2: Filter Results", "Live list of in-progress issues with priorities."),
        ("Gadget 3: Status Pie Chart", "Visual breakdown of issues (To Do, In Progress, Done)."),
        ("Gadget 4: Created vs Resolved", "Tracks issue generation vs resolution rates."),
        ("Gadget 5: 2D Filter Stats", "Matrix of issue status grouped by assignee.")
    ]
    for h, b in l6_items:
        ph = tf.add_paragraph()
        ph.text = f"\n• {h}:"
        ph.font.size = Pt(11)
        ph.font.bold = True
        ph.font.color.rgb = COLOR_TEXT_DARK
        pb = tf.add_paragraph()
        pb.text = f"  {b}"
        pb.font.size = Pt(10)
        pb.font.color.rgb = COLOR_TEXT_MUTED

    # ==========================================
    # SLIDE 9: JIRA LABS 7 & 8 (WORKFLOW & RULES)
    # ==========================================
    slide9 = prs.slides.add_slide(blank_layout)
    set_shape_flat(slide9.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(0), Inches(0), Inches(13.333), Inches(7.5)), COLOR_BG_LIGHT)
    add_header(slide9, "09", "JIRA Lab Coverage: Labs 7 & 8 (Workflows & Governance)")

    # Left Card: Lab 7 Workflow Customization
    l7_card = slide9.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, start_x, top_y, panel_w, panel_h)
    set_shape_flat(l7_card, COLOR_CARD_LIGHT, COLOR_BORDER_LIGHT, 1.5)
    tf7 = l7_card.text_frame
    tf7.word_wrap = True
    
    p7 = tf7.paragraphs[0]
    p7.text = "LAB 7: CUSTOM WORKFLOW STATUSES & TRANSITIONS"
    p7.font.size = Pt(15)
    p7.font.bold = True
    p7.font.color.rgb = COLOR_PRIMARY

    l7_details = [
        ("Objective", "Extend project workflow with review/testing stages and map new columns to the Scrum board."),
        ("New Statuses Added", "1. In Review — Peer verification of code & planning logic.\n2. Testing — Automated Pytest & manual integration validation."),
        ("Configured Transitions", "• 'Send for Review': In Progress → In Review\n• 'Start Testing': In Review → Testing\n• 'Pass / Complete': Testing → Done"),
        ("Scrum Board Mapping", "Updated board columns to 5 distinct lifecycle stages:\n[To Do] ➔ [In Progress] ➔ [In Review] ➔ [Testing] ➔ [Done]"),
        ("Key Value Delivered", "Prevents premature completion of stories; establishes strict quality gates before stories reach Done.")
    ]
    for h, b in l7_details:
        ph = tf7.add_paragraph()
        ph.text = f"\n• {h}:"
        ph.font.size = Pt(11)
        ph.font.bold = True
        ph.font.color.rgb = COLOR_TEXT_DARK
        pb = tf7.add_paragraph()
        pb.text = f"  {b}"
        pb.font.size = Pt(10)
        pb.font.color.rgb = COLOR_TEXT_MUTED

    # Right Card: Lab 8 Advanced Rules
    l8_card = slide9.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, start_x + panel_w + gap, top_y, panel_w, panel_h)
    set_shape_flat(l8_card, COLOR_CARD_LIGHT, COLOR_BORDER_LIGHT, 1.5)
    tf8 = l8_card.text_frame
    tf8.word_wrap = True
    
    p8 = tf8.paragraphs[0]
    p8.text = "LAB 8: CONDITIONS, VALIDATORS & POST FUNCTIONS"
    p8.font.size = Pt(15)
    p8.font.bold = True
    p8.font.color.rgb = COLOR_ACCENT

    l8_details = [
        ("Objective", "Enforce governance on 'Send for Review' transition (In Progress → In Review)."),
        ("1. Condition (Permission)", "Rule: Assignee must be Aksh Mishra (Agile Lead).\nOutcome: Transition action is hidden/disabled for unauthorized members."),
        ("2. Validator (Data Integrity)", "Rule: Field Validator: 'Description' must NOT be empty.\nOutcome: Blocks transition with an error popup if details are missing."),
        ("3. Post Function (Automation)", "Rule: Automatically update work item labels to append 'ready-for-review'.\nOutcome: Instantly tags issue for QA review upon transition."),
        ("Test Execution & Audit", "Tested with SAP-25: Successfully verified that incomplete descriptions were rejected, and valid transitions triggered the automated label.")
    ]
    for h, b in l8_details:
        ph = tf8.add_paragraph()
        ph.text = f"\n• {h}:"
        ph.font.size = Pt(11)
        ph.font.bold = True
        ph.font.color.rgb = COLOR_TEXT_DARK
        pb = tf8.add_paragraph()
        pb.text = f"  {b}"
        pb.font.size = Pt(10)
        pb.font.color.rgb = COLOR_TEXT_MUTED

    # ==========================================
    # SLIDE 10: CONCLUSION & PHASE 3 ROADMAP
    # ==========================================
    slide10 = prs.slides.add_slide(blank_layout)
    set_shape_flat(slide10.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(0), Inches(0), Inches(13.333), Inches(7.5)), COLOR_BG_LIGHT)
    add_header(slide10, "10", "Phase 2 Conclusion & Phase 3 Roadmap")

    # 3 Pillar Columns
    # Col 1: Phase 2 Summary
    c10_1 = slide10.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, start_x, top_y, col3_w, col_h)
    set_shape_flat(c10_1, COLOR_CARD_LIGHT, COLOR_BORDER_LIGHT, 1.5)
    tf = c10_1.text_frame
    tf.word_wrap = True
    p = tf.paragraphs[0]
    p.text = "PHASE 2 SUMMARY"
    p.font.size = Pt(14)
    p.font.bold = True
    p.font.color.rgb = COLOR_PRIMARY

    p2_achievements = [
        ("100% Backlog Completion", "All 15 user stories delivered across 4 sprints (70/70 points)."),
        ("Integrated Application", "Fully operational React + FastAPI + SQLite stack with live synchronization."),
        ("Full JIRA Lab Suite", "Completed Labs 1–8: Boards, Burndown, CFD, Automation, JQL, Dashboards, and Advanced Workflows."),
        ("Proven Team Cadence", "Stable 17.5 story points/sprint average velocity achieved.")
    ]
    for h, b in p2_achievements:
        ph = tf.add_paragraph()
        ph.text = f"\n✓ {h}:"
        ph.font.size = Pt(11)
        ph.font.bold = True
        ph.font.color.rgb = COLOR_TEXT_DARK
        pb = tf.add_paragraph()
        pb.text = f"  {b}"
        pb.font.size = Pt(10)
        pb.font.color.rgb = COLOR_TEXT_MUTED

    # Col 2: Challenges Overcome
    c10_2 = slide10.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, start_x + col3_w + gap, top_y, col3_w, col_h)
    set_shape_flat(c10_2, COLOR_CARD_LIGHT, COLOR_BORDER_LIGHT, 1.5)
    tf = c10_2.text_frame
    tf.word_wrap = True
    p = tf.paragraphs[0]
    p.text = "CHALLENGES & LESSONS"
    p.font.size = Pt(14)
    p.font.bold = True
    p.font.color.rgb = COLOR_ACCENT

    challenges = [
        ("JIRA Cloud Navigation", "Adapting to Jira's updated modern interface and permissions hierarchy."),
        ("Workflow Constraints", "Configuring condition/validator rules without deadlocking active sprint boards."),
        ("JQL Subscription Setup", "Setting up timezone-aligned automated daily query digests."),
        ("Full-Stack Contract Alignment", "Synchronizing FastAPI Pydantic schemas with TypeScript interfaces in React store.")
    ]
    for h, b in challenges:
        ph = tf.add_paragraph()
        ph.text = f"\n• {h}:"
        ph.font.size = Pt(11)
        ph.font.bold = True
        ph.font.color.rgb = COLOR_TEXT_DARK
        pb = tf.add_paragraph()
        pb.text = f"  {b}"
        pb.font.size = Pt(10)
        pb.font.color.rgb = COLOR_TEXT_MUTED

    # Col 3: Phase 3 Roadmap
    c10_3 = slide10.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, start_x + (col3_w + gap) * 2, top_y, col3_w, col_h)
    set_shape_flat(c10_3, COLOR_CARD_LIGHT, COLOR_BORDER_LIGHT, 1.5)
    tf = c10_3.text_frame
    tf.word_wrap = True
    p = tf.paragraphs[0]
    p.text = "PHASE 3 ROADMAP"
    p.font.size = Pt(14)
    p.font.bold = True
    p.font.color.rgb = COLOR_LIME

    phase3_goals = [
        ("Advanced ML Pathfinding", "Incorporate machine learning heuristics for exam difficulty weighting."),
        ("External Sync", "Two-way integration with Google Calendar and Apple iCal (.ics feeds)."),
        ("Mobile & Push Alerts", "Study session reminders, missed session alerts, and streak notifications."),
        ("User Testing & Feedback", "Empirical pilot evaluation with college cohort at Bennett University.")
    ]
    for h, b in phase3_goals:
        ph = tf.add_paragraph()
        ph.text = f"\n➔ {h}:"
        ph.font.size = Pt(11)
        ph.font.bold = True
        ph.font.color.rgb = COLOR_TEXT_DARK
        pb = tf.add_paragraph()
        pb.text = f"  {b}"
        pb.font.size = Pt(10)
        pb.font.color.rgb = COLOR_TEXT_MUTED

    prs.save(output_path)
    print(f"Presentation successfully created at: {output_path}")

if __name__ == "__main__":
    out = "C:/Users/aunin/.gemini/antigravity/scratch/studywise-ai/StudyWise_AI_Phase_2_Evaluation.pptx"
    create_deck(out)
