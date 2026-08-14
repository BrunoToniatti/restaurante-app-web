from django.urls import path, include

urlpatterns = [
    # AUTH
    path('auth/', include('main.urls.auth_urls')),

    # USER_MANAGER
    path('managers/', include('main.urls.user_manager_urls')),

    # USER_APP
    path('users/', include('main.urls.user_app_urls')),

    # RESTAURANT
    path('restaurants/', include('main.urls.restaurant_urls')),
]
