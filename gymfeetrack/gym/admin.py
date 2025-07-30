from django.contrib import admin
from .models import UserProfile,MembershipPlan,MemberSubscription,Payment

admin.site.register(UserProfile)
admin.site.register(MembershipPlan)
admin.site.register(MemberSubscription)
admin.site.register(Payment)
