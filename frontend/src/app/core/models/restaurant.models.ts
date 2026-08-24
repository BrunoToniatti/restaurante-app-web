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
  contact_phone: string;
  address: string;
  site?: string;
  instagram?: string;
  path_logo?: string;
  created_at: string;
  updated_at: string;
}
