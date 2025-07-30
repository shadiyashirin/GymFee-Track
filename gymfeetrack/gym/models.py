from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone

class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    phone_number = models.CharField(max_length=10, blank=True, null=True)
    date_of_joining = models.DateField(auto_now_add=True)
    address = models.TextField(blank=True, null=True)
    is_gym_admin = models.BooleanField(default=False) # True for gym staff/owners

    def __str__(self):
        return self.user.username
    

class MembershipPlan(models.Model):
    name = models.CharField(max_length=100, unique=True)
    price = models.DecimalField(max_digits=8, decimal_places=2)
    duration_days = models.IntegerField(help_text="Duration in days (e.g., 30 for monthly, 365 for annual)")
    description = models.TextField(blank=True, null=True)

    def __str__(self):
        return self.name
    
class MemberSubscription(models.Model):
    user_profile = models.ForeignKey(UserProfile, on_delete=models.CASCADE, related_name='subscriptions')
    plan = models.ForeignKey(MembershipPlan, on_delete=models.SET_NULL, null=True)
    start_date = models.DateField()
    end_date = models.DateField()
    status = models.CharField(max_length=20, default='Active', choices=[('Active', 'Active'), ('Expired', 'Expired'), ('Pending', 'Pending'), ('Cancelled', 'Cancelled')])
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    @property
    def is_active_status(self): # Renamed to avoid conflict with 'status' field name
        return self.status == 'Active' and self.end_date >= timezone.now().date()

    def __str__(self):
        return f"{self.user_profile.user.username}'s {self.plan.name if self.plan else 'N/A'} Subscription"
    

class Payment(models.Model):
    member_subscription = models.ForeignKey(MemberSubscription, on_delete=models.CASCADE, related_name='payments')
    amount = models.DecimalField(max_digits=8, decimal_places=2)
    payment_date = models.DateTimeField(auto_now_add=True)
    payment_method = models.CharField(max_length=50, choices=[('Cash', 'Cash'), ('Online', 'Online'), ('Card', 'Card')])
    transaction_id = models.CharField(max_length=255, blank=True, null=True)
    status = models.CharField(max_length=20, default='Completed', choices=[('Completed', 'Completed'), ('Pending', 'Pending'), ('Failed', 'Failed')])

    def __str__(self):
        return f"Payment of {self.amount} for {self.member_subscription.user_profile.user.username}"