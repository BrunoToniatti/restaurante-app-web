export interface RestaurantCreateRequest {
  cnpj: string;
  name: string;
  contact_phone: string;
  address: string;
  site?: string;
  instagram?: string;
}

export interface RestaurantResponse {
  id: number;
  cnpj: string;
  name: string;
  manager_id?: number;
  contact_phone: string;
  address: string;
  site?: string;
  instagram?: string;
  path_logo?: string;
  created_at: string;
  updated_at: string;
}

export interface QueueResponse {
  id: number;
  restaurant: number;
  restaurant_name: string;
  status: 'OPEN' | 'CLOSED' | 'PAUSED';
  status_display: string;
  current_size: number;
  estimated_wait_minutes: number;
  notes?: string;
  updated_at: string;
}

export interface BugReportResponse {
  id: number;
  title: string;
  description: string;
  platform: string;
  platform_display: string;
  category: string;
  category_display: string;
  status: string;
  status_display: string;
  admin_response?: string;
  opened_by: number;
  opened_by_name: string;
  resolved_by?: number;
  resolved_by_name?: string;
  created_at: string;
}

export interface BugReportCreateRequest {
  title: string;
  description: string;
  platform: string;
  category: string;
}
