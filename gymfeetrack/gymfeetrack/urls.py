from django.contrib import admin
from django.urls import path, include
from rest_framework.authtoken.views import obtain_auth_token # For token authentication

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('gym.urls')), # Include your gym app's URLs here
    path('api-auth/', include('rest_framework.urls')), # For DRF browsable API login/logout
    path('api/token/', obtain_auth_token, name='api_token_auth'), # Endpoint to get auth token
]