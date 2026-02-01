from django.contrib import admin

from .models import Job, UserProfile, MatchingInterest

admin.site.register(Job)
admin.site.register(UserProfile)
admin.site.register(MatchingInterest)
