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
    return this.http.post<ApiResponse<RestaurantResponse>>(
      `${environment.apiUrl}/restaurants/`,
      data
    );
  }

  listMine(): Observable<ApiResponse<RestaurantResponse[]>> {
    return this.http.get<ApiResponse<RestaurantResponse[]>>(`${environment.apiUrl}/restaurants/`);
  }
}
