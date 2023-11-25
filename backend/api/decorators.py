from functools import wraps
from django.http import HttpResponseForbidden

def role_required(allowed_roles=None):
    def decorator(view_func):
        @wraps(view_func)
        def _wrapped_view(request, *args, **kwargs):
            if not request.user.is_authenticated:
                return HttpResponseForbidden("You are not authenticated.")

            if request.user.role in allowed_roles:
                return view_func(request, *args, **kwargs)
            else:
                return HttpResponseForbidden("You are not authorized to access this page.")

        return _wrapped_view

    return decorator
