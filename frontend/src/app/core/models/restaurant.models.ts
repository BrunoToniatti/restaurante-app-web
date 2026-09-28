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

// ── Comanda / Menu ────────────────────────────────────────────────────────────

export type MenuCategory = 'FOOD' | 'DRINK' | 'DESSERT' | 'OTHER';

export interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: number;
  image_url: string;
  category: MenuCategory;
  category_display: string;
  subcategory: string;
  available: boolean;
  created_at: string;
  updated_at: string;
}

export interface MenuItemRequest {
  name: string;
  description?: string;
  price: number;
  image_url?: string;
  category: MenuCategory;
  subcategory?: string;
  available?: boolean;
}

export interface RestaurantTable {
  id: number;
  identifier: string;
  capacity?: number;
  open_comandas: number;
  created_at: string;
}

export interface ComandaItem {
  id: number;
  menu_item?: number;
  item_name: string;
  item_price: number;
  quantity: number;
  notes: string;
  subtotal: number;
  added_at: string;
}

export interface Comanda {
  id: number;
  table?: number;
  table_label: string;
  opened_by: string;
  status: 'OPEN' | 'CLOSED';
  status_display: string;
  notes: string;
  closed_at?: string;
  created_at: string;
  total: number;
  items: ComandaItem[];
}

export interface StaffToken {
  id: number;
  staff_name: string;
  token: string;
  active: boolean;
  created_at: string;
}

export interface WaiterInfo {
  staff_name: string;
  restaurant: { id: number; name: string; address: string };
  tables: RestaurantTable[];
  menu: MenuItem[];
}
