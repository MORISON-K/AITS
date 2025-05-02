from django.contrib import admin
from django.urls import path, include
from django.views.generic import RedirectView
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/', include('AITS_USERS.urls')),  # Assuming your API URLs are defined here
    
    # Add a root URL pattern that redirects to your frontend or a specific API endpoint
    path('', RedirectView.as_view(url='/api/', permanent=False)),
    
    # Alternatively, if you want to serve your React frontend:
    # path('', TemplateView.as_view(template_name='index.html')),
]
