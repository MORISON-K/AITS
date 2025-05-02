from django.contrib import admin
from django.urls import path, include, re_path
from django.views.generic import TemplateView

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('AITS_USERS.urls')),  # Your API URLs
    
    # Serve React app - this should be the last URL pattern
    re_path(r'^(?!api/|admin/).*$', TemplateView.as_view(template_name='index.html')),
]
