# gym/signals.py
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.contrib.auth.models import User
from .models import UserProfile

# This decorator registers the function as a receiver for the post_save signal
@receiver(post_save, sender=User)
def create_or_update_user_profile(sender, instance, created, **kwargs):
    """
    Creates or updates a UserProfile whenever a User is saved.
    """
    # 'created' is a boolean that is True if the user was just created
    if created:
        UserProfile.objects.create(user=instance)
    # If the user already existed, just save the profile
    # (This is good practice for updates, though not strictly needed for our current serializer)
    instance.profile.save()