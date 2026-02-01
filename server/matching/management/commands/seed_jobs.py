import random
from datetime import timedelta

from django.core.management.base import BaseCommand
from django.utils import timezone

from authentication.models import User
from matching.models import Job


# East Lansing, MI area coordinates
BASE_LAT = 42.7370
BASE_LNG = -84.4839

SAMPLE_JOBS = [
    {
        'title': 'Campus Move-In Helper',
        'short_description': 'Help students move into dorms this weekend.',
        'description': 'We need extra hands to help incoming students carry boxes and furniture into residence halls. Physical task involving lifting.',
        'skill_tags': ['Physical Labor', 'Teamwork'],
        'accessibility_requirements': ['heavy_lifting'],
    },
    {
        'title': 'Math Tutoring Session',
        'short_description': 'Tutor a student in Calculus II for an upcoming exam.',
        'description': 'A student needs help preparing for their Calc II midterm. Topics include integration techniques and series.',
        'skill_tags': ['Teaching', 'Math'],
        'accessibility_requirements': [],
    },
    {
        'title': 'Event Setup at Spartan Stadium',
        'short_description': 'Set up chairs and tables for a charity event.',
        'description': 'Help set up for a charity gala at Spartan Stadium. Involves arranging furniture and decorations.',
        'skill_tags': ['Physical Labor', 'Event Planning'],
        'accessibility_requirements': ['heavy_lifting', 'standing_long'],
    },
    {
        'title': 'First Aid Volunteer',
        'short_description': 'Staff a first aid booth at the campus 5K run.',
        'description': 'We need certified first aid volunteers to staff medical stations during the annual Spartan 5K.',
        'skill_tags': ['First Aid', 'Healthcare'],
        'accessibility_requirements': [],
    },
    {
        'title': 'Dog Walking at Animal Shelter',
        'short_description': 'Walk dogs at the Ingham County Animal Shelter.',
        'description': 'The shelter needs volunteers to walk and exercise dogs during morning hours.',
        'skill_tags': ['Animal Care'],
        'accessibility_requirements': ['standing_long'],
    },
    {
        'title': 'Website Bug Fix',
        'short_description': 'Fix a login bug on a student org website.',
        'description': 'A student organization\'s website has a login redirect issue. Need someone with web development experience.',
        'skill_tags': ['Programming', 'Web Development'],
        'accessibility_requirements': [],
    },
    {
        'title': 'Food Bank Sorting',
        'short_description': 'Sort and organize donated food items.',
        'description': 'Help sort donated canned goods and produce at the Greater Lansing Food Bank.',
        'skill_tags': ['Teamwork', 'Organization'],
        'accessibility_requirements': ['standing_long'],
    },
    {
        'title': 'Photography for Student Event',
        'short_description': 'Photograph a student org mixer tonight.',
        'description': 'Need a photographer for a networking mixer. Must have own camera and basic editing skills.',
        'skill_tags': ['Photography', 'Editing'],
        'accessibility_requirements': [],
    },
    {
        'title': 'ESL Conversation Partner',
        'short_description': 'Practice English conversation with international students.',
        'description': 'International students need conversation partners for weekly practice sessions at the library.',
        'skill_tags': ['Teaching', 'Communication'],
        'accessibility_requirements': [],
    },
    {
        'title': 'Bike Repair Workshop Helper',
        'short_description': 'Assist at a free campus bike repair clinic.',
        'description': 'Help fix bikes at the MSU Bikes repair clinic. Basic mechanical aptitude helpful.',
        'skill_tags': ['Mechanical', 'Teamwork'],
        'accessibility_requirements': [],
    },
    {
        'title': 'Grocery Run for Elderly Neighbor',
        'short_description': 'Pick up groceries for a senior in East Lansing.',
        'description': 'An elderly resident needs someone to pick up a list of groceries from Meijer and deliver to their home.',
        'skill_tags': ['Driving', 'Errands'],
        'accessibility_requirements': [],
    },
    {
        'title': 'Snow Shoveling',
        'short_description': 'Shovel sidewalks for a disabled resident.',
        'description': 'A wheelchair-bound resident needs their sidewalk and driveway cleared after the snowstorm.',
        'skill_tags': ['Physical Labor'],
        'accessibility_requirements': ['heavy_lifting'],
    },
    {
        'title': 'Graphic Design for Flyers',
        'short_description': 'Design promotional flyers for a charity drive.',
        'description': 'Design eye-catching flyers for an upcoming charity book drive. Canva or Adobe skills preferred.',
        'skill_tags': ['Graphic Design', 'Marketing'],
        'accessibility_requirements': [],
    },
    {
        'title': 'Study Group Facilitator',
        'short_description': 'Lead a study group for CSE 231 students.',
        'description': 'Organize and lead a weekly study session for intro Python students. Must have taken and done well in CSE 231.',
        'skill_tags': ['Teaching', 'Programming'],
        'accessibility_requirements': [],
    },
    {
        'title': 'Community Garden Planting',
        'short_description': 'Help plant spring vegetables in the community garden.',
        'description': 'The East Lansing Community Garden is planting spring crops. No experience needed, just willingness to get dirty!',
        'skill_tags': ['Gardening', 'Teamwork'],
        'accessibility_requirements': ['standing_long'],
    },
]


class Command(BaseCommand):
    help = 'Seed the database with sample jobs around East Lansing, MI'

    def handle(self, *args, **options):
        # Get or create a poster user
        poster, created = User.objects.get_or_create(
            email='poster@example.com',
            defaults={
                'username': 'job_poster',
                'first_name': 'Job',
                'last_name': 'Poster',
            },
        )
        if created:
            poster.set_password('testpass123')
            poster.save()
            self.stdout.write(f'Created poster user: {poster.email}')

        now = timezone.now()
        count = 0

        for i, data in enumerate(SAMPLE_JOBS):
            # Spread jobs around East Lansing
            lat = BASE_LAT + random.uniform(-0.05, 0.05)
            lng = BASE_LNG + random.uniform(-0.05, 0.05)

            # Vary shift times: some urgent (within 24h), some this week, some next week
            if i % 3 == 0:
                start_offset = timedelta(hours=random.randint(2, 20))
            elif i % 3 == 1:
                start_offset = timedelta(days=random.randint(1, 4))
            else:
                start_offset = timedelta(days=random.randint(5, 10))

            shift_start = now + start_offset
            shift_end = shift_start + timedelta(hours=random.randint(2, 6))

            job, created = Job.objects.get_or_create(
                title=data['title'],
                poster=poster,
                defaults={
                    'description': data['description'],
                    'short_description': data['short_description'],
                    'latitude': round(lat, 6),
                    'longitude': round(lng, 6),
                    'shift_start': shift_start,
                    'shift_end': shift_end,
                    'skill_tags': data['skill_tags'],
                    'accessibility_requirements': data['accessibility_requirements'],
                    'status': 'open',
                },
            )
            if created:
                count += 1

        self.stdout.write(self.style.SUCCESS(f'Seeded {count} jobs around East Lansing, MI'))
