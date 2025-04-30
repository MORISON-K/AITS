#!/usr/bin/env python
"""Django's development server runner script."""
import os
import sys

def main():
    """Run the Django development server with the correct settings and host/port."""
    # Set environment variables for Django
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'academicissuetracker.settings')
    
    # Import Django and set up the application
    try:
        from django.core.management import execute_from_command_line
    except ImportError as exc:
        raise ImportError(
            "Couldn't import Django. Are you sure it's installed and "
            "available on your PYTHONPATH environment variable? Did you "
            "forget to activate a virtual environment?"
        ) from exc
    
    # Run the server with the provided host and port
    sys.argv = ['manage.py', 'runserver', '0.0.0.0:8000']
    execute_from_command_line(sys.argv)

if __name__ == '__main__':
    main()
