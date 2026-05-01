import json
import os

# Instructions:
# 1. Place this script in your Django project root (where manage.py is).
# 2. Ensure you have 'lessons_data.json' in the same folder.
# 3. Run: python manage.py shell < load_lessons.py

def load_data():
    from academy.models import Level, Lesson # Adjust 'academy' to your app name
    
    file_path = 'lessons_data.json'
    if not os.path.exists(file_path):
        print(f"Error: {file_path} not found.")
        return

    with open(file_path, 'r', encoding='utf-8') as f:
        data = json.load(f)

    for entry in data:
        # Get or create the level
        level_obj, created = Level.objects.get_or_create(
            number=entry['level'],
            defaults={'title': f'Level {entry["level"]}'}
        )

        # Create the lesson
        lesson = Lesson.objects.create(
            level=level_obj,
            title=entry['title'],
            content=entry['content'],
            order=entry['order'],
            slug=entry['title'].lower().replace(' ', '-') # Basic slugification
        )
        print(f"Successfully loaded: {lesson.title}")

if __name__ == "__main__":
    load_data()
