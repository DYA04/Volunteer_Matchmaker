import math


def haversine_distance(lat1, lon1, lat2, lon2):
    """Calculate distance in miles between two lat/lng points."""
    R = 3959  # Earth radius in miles
    lat1, lon1, lat2, lon2 = map(math.radians, [lat1, lon1, lat2, lon2])
    dlat = lat2 - lat1
    dlon = lon2 - lon1
    a = math.sin(dlat / 2) ** 2 + math.cos(lat1) * math.cos(lat2) * math.sin(dlon / 2) ** 2
    c = 2 * math.asin(math.sqrt(a))
    return R * c


def calculate_score(user_profile, job, radius=25):
    """
    Calculate matching score for a user-job pair.

    Score = A_bool × (D_35 + S_30 + U_20 + R_15)
    Returns (score, distance) tuple.
    """
    # A_bool: Accessibility filter
    user_limitations = set(user_profile.limitations or [])
    job_requirements = set(job.accessibility_requirements or [])
    if user_limitations & job_requirements:
        return 0, None

    # D_35: Distance score (max 35)
    if user_profile.latitude is None or user_profile.longitude is None:
        distance = 0
        d_score = 17.5  # Half score if no location
    else:
        distance = haversine_distance(
            user_profile.latitude, user_profile.longitude,
            job.latitude, job.longitude,
        )
        if distance > radius:
            return 0, distance
        d_score = 35 * max(0, 1 - distance / radius)

    # S_30: Skill overlap (max 30)
    job_tags = set(tag.lower() for tag in (job.skill_tags or []))
    if not job_tags:
        s_score = 30
    else:
        user_tags = set(tag.lower() for tag in (user_profile.skill_tags or []))
        overlap = len(job_tags & user_tags)
        s_score = 30 * (overlap / len(job_tags))

    # U_20: Urgency (max 20)
    hours = job.urgency_hours
    if hours <= 24:
        u_score = 20
    else:
        u_score = 20 * max(0, 1 - hours / 168)

    # R_15: Reliability (max 15)
    completed = user_profile.jobs_completed
    dropped = user_profile.jobs_dropped
    total = completed + dropped
    if total == 0:
        r_score = 15 * 0.5
    else:
        r_score = 15 * (completed / total)

    score = d_score + s_score + u_score + r_score
    return round(score, 2), round(distance, 2) if distance else 0
