export interface LoginRequest {
  identifier: string;
  password: string;
}

export interface UserManager {
  id: number;
  name: string;
  email: string;
  username: string;
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
}
