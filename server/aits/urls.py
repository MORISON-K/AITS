from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from AITS_USERS.views import user, department, issue, CustomTokenObtainPairView

urlpatterns = [
    path('admin/', admin.site.urls),
    path('user/', user),
    path('department/', department),
    path('issue/', issue),
    path('api/token/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]
