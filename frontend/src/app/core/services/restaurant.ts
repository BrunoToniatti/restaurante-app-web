import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { RestaurantCreateRequest, RestaurantResponse } from '../models/restaurant.models';
import { ApiResponse } from '../models/auth.models';

@Injectable({ providedIn: 'root' })
export class RestaurantService {
  private http = inject(HttpClient);

  create(data: RestaurantCreateRequest): Observable<ApiResponse<RestaurantResponse>> {
    return this.http.post<ApiResponse<RestaurantResponse>>(`${environment.apiUrl}/restaurants/`, data);
  }

  listMine(): Observable<ApiResponse<RestaurantResponse[]>> {
    return this.http.get<ApiResponse<RestaurantResponse[]>>(`${environment.apiUrl}/restaurants/`);
  }

  update(id: number, data: Partial<RestaurantCreateRequest>): Observable<ApiResponse<RestaurantResponse>> {
    return this.http.put<ApiResponse<RestaurantResponse>>(`${environment.apiUrl}/restaurants/${id}/`, data);
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${environment.apiUrl}/restaurants/${id}/`);
  }

  // Admin
  listAll(): Observable<ApiResponse<RestaurantResponse[]>> {
    return this.http.get<ApiResponse<RestaurantResponse[]>>(`${environment.apiUrl}/restaurants/admin/`);
  }

  transfer(id: number, newManagerId: number): Observable<ApiResponse<RestaurantResponse>> {
    return this.http.post<ApiResponse<RestaurantResponse>>(
      `${environment.apiUrl}/restaurants/admin/${id}/transfer/`,
      { new_manager_id: newManagerId }
    );
  }
}
