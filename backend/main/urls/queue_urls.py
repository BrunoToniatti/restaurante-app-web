from django.urls import path
from main.views.queue_views import AdminQueueListView, ManagerQueueView

urlpatterns = [
    path('admin/', AdminQueueListView.as_view(), name='admin-queue-list'),
    path('restaurant/<int:restaurant_pk>/', ManagerQueueView.as_view(), name='manager-queue'),
]
