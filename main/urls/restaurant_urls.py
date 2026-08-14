from django.urls import path
from main.views.restaurant_views import (
    ManagerRestaurantListCreateView,
    ManagerRestaurantDetailView,
    PublicRestaurantListView,
    PublicRestaurantDetailView,
)

urlpatterns = [
    # Public routes
    path('public/', PublicRestaurantListView.as_view(), name='restaurant-public-list'),
    path('public/<int:pk>/', PublicRestaurantDetailView.as_view(), name='restaurant-public-detail'),
    # Protected manager routes
    path('', ManagerRestaurantListCreateView.as_view(), name='restaurant-list-create'),
    path('<int:pk>/', ManagerRestaurantDetailView.as_view(), name='restaurant-detail'),
]
