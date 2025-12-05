from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),

    # All site pages come from the ketab app
    path('', include('ketab.urls')),
]
