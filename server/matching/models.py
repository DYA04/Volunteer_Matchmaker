from django.db import models
from django.utils import timezone

from core.models import BaseModel
from authentication.models import User


class Job(BaseModel):
    STATUS_CHOICES = [
        ('open', 'Open'),
        ('filled', 'Filled'),
        ('cancelled', 'Cancelled'),
    ]

    title = models.CharField(max_length=255)
    description = models.TextField()
    short_description = models.CharField(max_length=200)
    poster = models.ForeignKey(User, on_delete=models.CASCADE, related_name='posted_jobs')
    latitude = models.FloatField()
    longitude = models.FloatField()
    shift_start = models.DateTimeField()
    shift_end = models.DateTimeField()
    skill_tags = models.JSONField(default=list, blank=True)
    accessibility_requirements = models.JSONField(default=list, blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='open')

    @property
    def urgency_hours(self):
        delta = self.shift_start - timezone.now()
        return max(0, delta.total_seconds() / 3600)

    @property
    def is_urgent(self):
        return self.urgency_hours <= 24

    def __str__(self):
        return self.title

    class Meta:
        ordering = ['-created_at']


class UserProfile(BaseModel):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='matching_profile')
    latitude = models.FloatField(null=True, blank=True)
    longitude = models.FloatField(null=True, blank=True)
    skill_tags = models.JSONField(default=list, blank=True)
    limitations = models.JSONField(default=list, blank=True)
    jobs_completed = models.IntegerField(default=0)
    jobs_dropped = models.IntegerField(default=0)

    def __str__(self):
        return f"Profile: {self.user.email}"


class MatchingInterest(BaseModel):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='matching_interests')
    job = models.ForeignKey(Job, on_delete=models.CASCADE, related_name='interests')
    interested = models.BooleanField()

    class Meta:
        unique_together = ('user', 'job')

    def __str__(self):
        action = 'interested in' if self.interested else 'passed on'
        return f"{self.user.email} {action} {self.job.title}"
