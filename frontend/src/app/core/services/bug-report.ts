import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { BugReportCreateRequest, BugReportResponse } from '../models/restaurant.models';
import { ApiResponse } from '../models/auth.models';

@Injectable({ providedIn: 'root' })
export class BugReportService {
  private http = inject(HttpClient);

  listMine(): Observable<ApiResponse<BugReportResponse[]>> {
    return this.http.get<ApiResponse<BugReportResponse[]>>(`${environment.apiUrl}/reports/`);
  }

  create(data: BugReportCreateRequest): Observable<ApiResponse<BugReportResponse>> {
    return this.http.post<ApiResponse<BugReportResponse>>(`${environment.apiUrl}/reports/`, data);
  }

  listAll(): Observable<ApiResponse<BugReportResponse[]>> {
    return this.http.get<ApiResponse<BugReportResponse[]>>(`${environment.apiUrl}/reports/admin/`);
  }

  respond(id: number, data: { status: string; admin_response: string }): Observable<ApiResponse<BugReportResponse>> {
    return this.http.put<ApiResponse<BugReportResponse>>(`${environment.apiUrl}/reports/admin/${id}/`, data);
  }
}
