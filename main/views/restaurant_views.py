from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny

from main.permissions import IsManager, IsRestaurantOwner
from main.serializers.restaurant_serializers import (
    RestaurantCreateSerializer,
    RestaurantUpdateSerializer,
    RestaurantAdminResponseSerializer,
    RestaurantPublicResponseSerializer,
)
from main.services.restaurant_service import RestaurantService


class ManagerRestaurantListCreateView(APIView):
    """
    Manager endpoint to list owned restaurants or create a new restaurant.
    Strictly restricted to authenticated Managers.
    """
    permission_classes = [IsManager]

    def get(self, request):
        restaurants = RestaurantService.get_manager_restaurants(manager=request.user)
        serializer = RestaurantAdminResponseSerializer(restaurants, many=True)
        return Response(
            {
                "status": "success",
                "status_code": status.HTTP_200_OK,
                "count": restaurants.count(),
                "data": serializer.data
            },
            status=status.HTTP_200_OK
        )

    def post(self, request):
        serializer = RestaurantCreateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        restaurant = RestaurantService.create_restaurant(
            manager=request.user,
            validated_data=serializer.validated_data
        )
        response_data = RestaurantAdminResponseSerializer(restaurant).data

        return Response(
            {
                "status": "success",
                "status_code": status.HTTP_201_CREATED,
                "data": response_data
            },
            status=status.HTTP_201_CREATED
        )


class ManagerRestaurantDetailView(APIView):
    """
    Manager endpoint to retrieve, update or delete a specific owned restaurant.
    Strictly protected by IsRestaurantOwner (validating user_type and manager_id ownership).
    """
    permission_classes = [IsManager, IsRestaurantOwner]

    def get(self, request, pk):
        restaurant = RestaurantService.get_restaurant_for_manager(
            manager=request.user,
            restaurant_id=pk
        )
        self.check_object_permissions(request, restaurant)

        serializer = RestaurantAdminResponseSerializer(restaurant)
        return Response(
            {
                "status": "success",
                "status_code": status.HTTP_200_OK,
                "data": serializer.data
            },
            status=status.HTTP_200_OK
        )

    def put(self, request, pk):
        restaurant = RestaurantService.get_restaurant_for_manager(
            manager=request.user,
            restaurant_id=pk
        )
        self.check_object_permissions(request, restaurant)

        serializer = RestaurantUpdateSerializer(data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)

        updated_restaurant = RestaurantService.update_restaurant(
            manager=request.user,
            restaurant=restaurant,
            validated_data=serializer.validated_data
        )
        response_data = RestaurantAdminResponseSerializer(updated_restaurant).data

        return Response(
            {
                "status": "success",
                "status_code": status.HTTP_200_OK,
                "data": response_data
            },
            status=status.HTTP_200_OK
        )

    def delete(self, request, pk):
        restaurant = RestaurantService.get_restaurant_for_manager(
            manager=request.user,
            restaurant_id=pk
        )
        self.check_object_permissions(request, restaurant)

        RestaurantService.delete_restaurant(
            manager=request.user,
            restaurant=restaurant
        )

        return Response(
            {
                "status": "success",
                "status_code": status.HTTP_204_NO_CONTENT,
                "data": None
            },
            status=status.HTTP_204_NO_CONTENT
        )


class PublicRestaurantListView(APIView):
    """
    Public endpoint for searching and listing restaurants.
    Accessible to consumers (App Users) and unauthenticated visitors.
    Returns only public-facing restaurant data without exposing manager details.
    """
    permission_classes = [AllowAny]

    def get(self, request):
        search_query = request.query_params.get('search', None)
        restaurants = RestaurantService.search_public_restaurants(search_query=search_query)

        serializer = RestaurantPublicResponseSerializer(restaurants, many=True)
        return Response(
            {
                "status": "success",
                "status_code": status.HTTP_200_OK,
                "count": restaurants.count(),
                "data": serializer.data
            },
            status=status.HTTP_200_OK
        )


class PublicRestaurantDetailView(APIView):
    """
    Public endpoint for viewing a single restaurant's public profile.
    Never exposes internal credentials or manager metadata.
    """
    permission_classes = [AllowAny]

    def get(self, request, pk):
        restaurant = RestaurantService.get_public_restaurant(restaurant_id=pk)
        serializer = RestaurantPublicResponseSerializer(restaurant)

        return Response(
            {
                "status": "success",
                "status_code": status.HTTP_200_OK,
                "data": serializer.data
            },
            status=status.HTTP_200_OK
        )
