from django.urls import path
from .views import (
    UserCreateView, UserProfileDetailView,
    AdminUserProfileList, AdminUserProfileDetail,
    MembershipPlanListCreate, MembershipPlanDetail,
    MemberSubscriptionListCreate, MemberSubscriptionDetail,
    PaymentListCreate, PaymentDetail, CurrentUserView
)

urlpatterns = [
    # Authentication & User Management
    path('register/', UserCreateView.as_view(), name='user-register'),
    path('me/', CurrentUserView.as_view(), name='current-user-profile'), # Get current user's profile
    path('profiles/<int:pk>/', UserProfileDetailView.as_view(), name='user-profile-detail'), # For member to update their own profile

    # Admin specific views
    path('admin/profiles/', AdminUserProfileList.as_view(), name='admin-user-profile-list'),
    path('admin/profiles/<int:pk>/', AdminUserProfileDetail.as_view(), name='admin-user-profile-detail'),

    # Membership Plans
    path('plans/', MembershipPlanListCreate.as_view(), name='membership-plan-list-create'),
    path('plans/<int:pk>/', MembershipPlanDetail.as_view(), name='membership-plan-detail'),

    # Member Subscriptions
    path('subscriptions/', MemberSubscriptionListCreate.as_view(), name='member-subscription-list-create'),
    path('subscriptions/<int:pk>/', MemberSubscriptionDetail.as_view(), name='member-subscription-detail'),

    # Payments
    path('payments/', PaymentListCreate.as_view(), name='payment-list-create'),
    path('payments/<int:pk>/', PaymentDetail.as_view(), name='payment-detail'),
]