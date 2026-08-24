export interface LoginRequest {
  identifier: string;
  password: string;
}

export interface RegisterRequest {
  first_name: string;
  last_name: string;
  email: string;
  username: string;
  phone_number: string;
  password: string;
}

export interface UserManager {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  username: string;
  phone_number: string;
  is_admin: boolean;
  restaurant_count: number;
}

export interface AuthResponse {
  access: string;
  refresh: string;
  user_type: string;
  user: UserManager;
}

export interface ApiResponse<T> {
  status: string;
  status_code: number;
  data: T;
  count?: number;
}
