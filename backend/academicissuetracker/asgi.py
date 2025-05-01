"""
ASGI config for academicissuetracker project.
"""

import os

from django.core.asgi import get_asgi_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'academicissuetracker.settings')

application = get_asgi_application()
