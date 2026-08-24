import AsyncStorage from '@react-native-async-storage/async-storage';
import api from './api';
import { ApiResponse, UserApp } from '../types';

interface AuthResponse {
  access: string;
  refresh: string;
  user_type: string;
  user: UserApp;
}

export async function loginUser(identifier: string, password: string): Promise<AuthResponse> {
  const res = await api.post<ApiResponse<AuthResponse>>('/auth/app/login/', { identifier, password });
  const data = res.data.data;
  await AsyncStorage.setItem('access_token', data.access);
  await AsyncStorage.setItem('refresh_token', data.refresh);
  await AsyncStorage.setItem('current_user', JSON.stringify(data.user));
  return data;
}

export async function registerUser(payload: {
  first_name: string;
  last_name: string;
  email: string;
  username: string;
  password: string;
  phone_number: string;
}): Promise<UserApp> {
  const res = await api.post<ApiResponse<UserApp>>('/users/', payload);
  return res.data.data;
}

export async function logout(): Promise<void> {
  await AsyncStorage.multiRemove(['access_token', 'refresh_token', 'current_user']);
}

export async function getStoredUser(): Promise<UserApp | null> {
  const raw = await AsyncStorage.getItem('current_user');
  return raw ? JSON.parse(raw) : null;
}

export async function isAuthenticated(): Promise<boolean> {
  const token = await AsyncStorage.getItem('access_token');
  return !!token;
}
