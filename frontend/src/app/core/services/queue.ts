import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { QueueResponse } from '../models/restaurant.models';
import { ApiResponse } from '../models/auth.models';

@Injectable({ providedIn: 'root' })
export class QueueService {
  private http = inject(HttpClient);

  getByRestaurant(restaurantId: number): Observable<ApiResponse<QueueResponse>> {
    return this.http.get<ApiResponse<QueueResponse>>(`${environment.apiUrl}/queues/restaurant/${restaurantId}/`);
  }

  update(restaurantId: number, data: Partial<QueueResponse>): Observable<ApiResponse<QueueResponse>> {
    return this.http.put<ApiResponse<QueueResponse>>(`${environment.apiUrl}/queues/restaurant/${restaurantId}/`, data);
  }

  listAll(): Observable<ApiResponse<QueueResponse[]>> {
    return this.http.get<ApiResponse<QueueResponse[]>>(`${environment.apiUrl}/queues/admin/`);
  }
}
