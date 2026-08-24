import api from './api';
import { ApiResponse, Restaurant } from '../types';

export async function getPublicRestaurants(search?: string): Promise<Restaurant[]> {
  const params = search ? { search } : {};
  const res = await api.get<ApiResponse<Restaurant[]>>('/restaurants/public/', { params });
  return res.data.data;
}

export async function getPublicRestaurant(id: number): Promise<Restaurant> {
  const res = await api.get<ApiResponse<Restaurant>>(`/restaurants/public/${id}/`);
  return res.data.data;
}
