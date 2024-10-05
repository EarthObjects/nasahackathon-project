from django.contrib import admin
from django.urls import path
from .views import AsteroidFeedView

urlpatterns = [
    path('admin/', admin.site.urls),
    path('feed/<int:days_since_epoch>/', AsteroidFeedView.as_view(), name='asteroid-feed'),  # Updated URL pattern
]
