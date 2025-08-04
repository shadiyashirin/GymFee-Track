from rest_framework import serializers
from .models import UserProfile,MembershipPlan,MemberSubscription,Payment
from django.contrib.auth.models import User

#define serializers

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id','username','email']

class UserCreateSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True) # Password is write-only

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'password']

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data.get('email', ''),
            password=validated_data['password']
        )

        return user

class UserProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True) # Nested serializer for user details

    class Meta:
        model = UserProfile
        fields = '__all__'

class MembershipPlanSerializer(serializers.ModelSerializer):
    class Meta:
        model = MembershipPlan
        fields = '__all__'

class MemberSubscriptionSerializer(serializers.ModelSerializer):
    user_profile = UserProfileSerializer(read_only=True) # Nested for read, user_profile_id for write
    plan = MembershipPlanSerializer(read_only=True) # Nested for read, plan_id for write
    user_profile_id = serializers.PrimaryKeyRelatedField(
        queryset=UserProfile.objects.all(), source='user_profile', write_only=True
    )
    plan_id = serializers.PrimaryKeyRelatedField(
        queryset=MembershipPlan.objects.all(), source='plan', write_only=True
    )
    is_active = serializers.BooleanField(source='is_active_status', read_only=True) # Use the property

    class Meta:
        model = MemberSubscription
        fields = '__all__'

class PaymentSerializer(serializers.ModelSerializer):
    member_subscription = MemberSubscriptionSerializer(read_only=True) # Nested for read
    member_subscription_id = serializers.PrimaryKeyRelatedField(
        queryset=MemberSubscription.objects.all(), source='member_subscription', write_only=True
    )

    class Meta:
        model = Payment
        fields = '__all__'