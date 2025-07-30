from django.shortcuts import render
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import UserProfile, MembershipPlan, MemberSubscription, Payment
from .serializers import (
    UserSerializer, UserCreateSerializer, UserProfileSerializer,
    MembershipPlanSerializer, MemberSubscriptionSerializer, PaymentSerializer
)
from .permissions import IsGymAdminUser
from django.contrib.auth.models import User
from django.shortcuts import get_object_or_404


# User Creation (for new gym members)
class UserCreateView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserCreateSerializer
    permission_classes = [permissions.AllowAny] # Allow anyone to register

# User Profile (for current logged-in user)
class UserProfileDetailView(generics.RetrieveUpdateAPIView):
    queryset = UserProfile.objects.all()
    serializer_class = UserProfileSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        # Ensure users can only retrieve/update their own profile
        return get_object_or_404(UserProfile, user=self.request.user)

# Admin: List all UserProfiles (members)
class AdminUserProfileList(generics.ListAPIView):
    queryset = UserProfile.objects.all()
    serializer_class = UserProfileSerializer
    permission_classes = [IsGymAdminUser]

# Admin: Retrieve/Update/Delete a specific UserProfile
class AdminUserProfileDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = UserProfile.objects.all()
    serializer_class = UserProfileSerializer
    permission_classes = [IsGymAdminUser]

# Membership Plans
class MembershipPlanListCreate(generics.ListCreateAPIView):
    queryset = MembershipPlan.objects.all()
    serializer_class = MembershipPlanSerializer

    def get_permissions(self):
        # Allow any user to list plans, but only admins to create
        if self.request.method == 'POST':
            self.permission_classes = [IsGymAdminUser]
        else:
            self.permission_classes = [permissions.AllowAny]
        return super().get_permissions()

class MembershipPlanDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = MembershipPlan.objects.all()
    serializer_class = MembershipPlanSerializer
    permission_classes = [IsGymAdminUser] # Only admins can update/delete plans

# Member Subscriptions
class MemberSubscriptionListCreate(generics.ListCreateAPIView):
    serializer_class = MemberSubscriptionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        if self.request.user.profile.is_gym_admin:
            return MemberSubscription.objects.all() # Admins see all subscriptions
        return MemberSubscription.objects.filter(user_profile=self.request.user.profile) # Members only see theirs

    def perform_create(self, serializer):
        # If admin is creating a subscription for a user_profile_id, use that
        # If a regular user is trying to create, assign to them
        if self.request.user.profile.is_gym_admin and 'user_profile_id' in self.request.data:
            user_profile = get_object_or_404(UserProfile, pk=self.request.data['user_profile_id'])
            serializer.save(user_profile=user_profile)
        else:
            serializer.save(user_profile=self.request.user.profile) # Assign to current user

class MemberSubscriptionDetail(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = MemberSubscriptionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        if self.request.user.profile.is_gym_admin:
            return MemberSubscription.objects.all()
        return MemberSubscription.objects.filter(user_profile=self.request.user.profile)


# Payments
class PaymentListCreate(generics.ListCreateAPIView):
    serializer_class = PaymentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        if self.request.user.profile.is_gym_admin:
            return Payment.objects.all()
        # Members only see payments for their subscriptions
        return Payment.objects.filter(member_subscription__user_profile=self.request.user.profile)

    def perform_create(self, serializer):
        # If admin is creating a payment for a member_subscription_id, use that
        # Otherwise, ensure the subscription belongs to the current user
        if self.request.user.profile.is_gym_admin and 'member_subscription_id' in self.request.data:
            member_subscription = get_object_or_404(MemberSubscription, pk=self.request.data['member_subscription_id'])
            serializer.save(member_subscription=member_subscription)
        else:
            # This path is for members to make payments, assuming subscription is implied or selected
            # For simplicity in 3-4 days, we'll primarily have admin create payments
            # You might need to refine this for member-initiated payments later
            raise permissions.PermissionDenied("Members can only view payments. Please contact admin for payment.")

class PaymentDetail(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = PaymentSerializer
    permission_classes = [IsGymAdminUser] # Only admins can update/delete payments

# Endpoint to get current user's profile and info
class CurrentUserView(generics.RetrieveAPIView):
    serializer_class = UserProfileSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user.profile