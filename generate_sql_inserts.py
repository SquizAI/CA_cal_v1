#!/usr/bin/env python3
"""
Generate PostgreSQL INSERT statements for corrected ELA curriculum
Uses proper PostgreSQL array syntax: ARRAY['item1', 'item2']
"""

import json

def escape_sql_string(s):
    """Escape single quotes for PostgreSQL"""
    return s.replace("'", "''")

def format_postgres_array(items):
    """Convert Python list to PostgreSQL ARRAY constructor"""
    if not items:
        return "ARRAY[]::text[]"
    escaped_items = [f"'{escape_sql_string(item)}'" for item in items]
    return f"ARRAY[{', '.join(escaped_items)}]"

def format_text_array(items):
    """Convert Python list to PostgreSQL text array"""
    if not items:
        return "ARRAY[]::text[]"
    escaped_items = [f"'{escape_sql_string(str(item))}'" for item in items]
    return f"ARRAY[{', '.join(escaped_items)}]"

def generate_insert_statement(subject_key, day_key, lesson):
    """Generate single INSERT statement"""
    return f"""('{subject_key}', '{day_key}', '{escape_sql_string(lesson.get("code", ""))}', '{escape_sql_string(lesson.get("title", ""))}', {format_postgres_array(lesson.get("objectives", []))}, '{escape_sql_string(lesson.get("materials", ""))}', {format_text_array(lesson.get("activities", []))}, '{escape_sql_string(lesson.get("assessment", ""))}', '{escape_sql_string(lesson.get("standards", ""))}')"""

def generate_sql_for_subject(subject_key, filename):
    """Generate all INSERT statements for a subject"""
    with open(f'centner_standards_by_calendar/{filename}', 'r') as f:
        data = json.load(f)

    lessons = data[subject_key]

    # Sort by day key
    sorted_days = sorted(lessons.keys(), key=lambda x: (int(x.split('.')[0]), x.split('.')[1]))

    print(f"\n-- {subject_key.upper()} - {len(sorted_days)} lessons")
    print(f"INSERT INTO curriculum_lessons (subject_key, day_key, lesson_code, title, objectives, materials, activities, assessment, standards)")
    print("VALUES")

    value_statements = []
    for day_key in sorted_days:
        lesson = lessons[day_key]
        value_statements.append(generate_insert_statement(subject_key, day_key, lesson))

    print(",\n".join(value_statements) + ";")

# Generate for 9th grade ELA
print("-- ==========================================")
print("-- 9TH GRADE ELA CURRICULUM INSERT")
print("-- ==========================================")
generate_sql_for_subject('9th_ela', '9th_ela.json')

print("\n\n")

# Generate for 11th grade ELA
print("-- ==========================================")
print("-- 11TH GRADE ELA CURRICULUM INSERT")
print("-- ==========================================")
generate_sql_for_subject('11th_ela', '11th_ela.json')
