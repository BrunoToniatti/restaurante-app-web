import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../models/auth.models';
import {
  MenuItem, MenuItemRequest, RestaurantTable,
  Comanda, ComandaItem, StaffToken, WaiterInfo,
} from '../models/restaurant.models';

@Injectable({ providedIn: 'root' })
export class ComandaService {
  private http = inject(HttpClient);
  private base = environment.apiUrl;

  // ── MENU ───────────────────────────────────────────────────────────────────
  listMenu(restaurantId: number): Observable<ApiResponse<MenuItem[]>> {
    return this.http.get<ApiResponse<MenuItem[]>>(`${this.base}/restaurants/${restaurantId}/menu/`);
  }
  createMenuItem(restaurantId: number, data: MenuItemRequest): Observable<ApiResponse<MenuItem>> {
    return this.http.post<ApiResponse<MenuItem>>(`${this.base}/restaurants/${restaurantId}/menu/`, data);
  }
  updateMenuItem(restaurantId: number, itemId: number, data: Partial<MenuItemRequest>): Observable<ApiResponse<MenuItem>> {
    return this.http.patch<ApiResponse<MenuItem>>(`${this.base}/restaurants/${restaurantId}/menu/${itemId}/`, data);
  }
  deleteMenuItem(restaurantId: number, itemId: number): Observable<any> {
    return this.http.delete(`${this.base}/restaurants/${restaurantId}/menu/${itemId}/`);
  }

  // ── TABLES ─────────────────────────────────────────────────────────────────
  listTables(restaurantId: number): Observable<ApiResponse<RestaurantTable[]>> {
    return this.http.get<ApiResponse<RestaurantTable[]>>(`${this.base}/restaurants/${restaurantId}/tables/`);
  }
  createTable(restaurantId: number, identifier: string, capacity?: number): Observable<ApiResponse<RestaurantTable>> {
    return this.http.post<ApiResponse<RestaurantTable>>(`${this.base}/restaurants/${restaurantId}/tables/`, { identifier, capacity });
  }
  deleteTable(restaurantId: number, tableId: number): Observable<any> {
    return this.http.delete(`${this.base}/restaurants/${restaurantId}/tables/${tableId}/`);
  }

  // ── COMANDAS ───────────────────────────────────────────────────────────────
  listComandas(restaurantId: number, status?: string): Observable<ApiResponse<Comanda[]>> {
    const params: any = {};
    if (status) params['status'] = status;
    return this.http.get<ApiResponse<Comanda[]>>(`${this.base}/restaurants/${restaurantId}/comandas/`, { params });
  }
  createComanda(restaurantId: number, data: { table_id?: number; table_label?: string; opened_by?: string; notes?: string }): Observable<ApiResponse<Comanda>> {
    return this.http.post<ApiResponse<Comanda>>(`${this.base}/restaurants/${restaurantId}/comandas/`, data);
  }
  updateComanda(restaurantId: number, comandaId: number, data: { status?: string; notes?: string }): Observable<ApiResponse<Comanda>> {
    return this.http.patch<ApiResponse<Comanda>>(`${this.base}/restaurants/${restaurantId}/comandas/${comandaId}/`, data);
  }
  addComandaItem(restaurantId: number, comandaId: number, data: { menu_item_id?: number; item_name?: string; item_price?: number; quantity?: number; notes?: string }): Observable<ApiResponse<ComandaItem>> {
    return this.http.post<ApiResponse<ComandaItem>>(`${this.base}/restaurants/${restaurantId}/comandas/${comandaId}/items/`, data);
  }
  removeComandaItem(restaurantId: number, comandaId: number, itemId: number): Observable<any> {
    return this.http.delete(`${this.base}/restaurants/${restaurantId}/comandas/${comandaId}/items/${itemId}/`);
  }

  // ── STAFF TOKENS ───────────────────────────────────────────────────────────
  listStaffTokens(restaurantId: number): Observable<ApiResponse<StaffToken[]>> {
    return this.http.get<ApiResponse<StaffToken[]>>(`${this.base}/restaurants/${restaurantId}/staff-tokens/`);
  }
  createStaffToken(restaurantId: number, staff_name: string): Observable<ApiResponse<StaffToken>> {
    return this.http.post<ApiResponse<StaffToken>>(`${this.base}/restaurants/${restaurantId}/staff-tokens/`, { staff_name });
  }
  toggleStaffToken(restaurantId: number, tokenId: number, active: boolean): Observable<ApiResponse<StaffToken>> {
    return this.http.patch<ApiResponse<StaffToken>>(`${this.base}/restaurants/${restaurantId}/staff-tokens/${tokenId}/`, { active });
  }
  deleteStaffToken(restaurantId: number, tokenId: number): Observable<any> {
    return this.http.delete(`${this.base}/restaurants/${restaurantId}/staff-tokens/${tokenId}/`);
  }

  // ── WAITER (public) ────────────────────────────────────────────────────────
  getWaiterInfo(token: string): Observable<ApiResponse<WaiterInfo>> {
    return this.http.get<ApiResponse<WaiterInfo>>(`${this.base}/waiter/${token}/`);
  }
  waiterListComandas(token: string): Observable<ApiResponse<Comanda[]>> {
    return this.http.get<ApiResponse<Comanda[]>>(`${this.base}/waiter/${token}/comandas/`);
  }
  waiterCreateComanda(token: string, data: any): Observable<ApiResponse<Comanda>> {
    return this.http.post<ApiResponse<Comanda>>(`${this.base}/waiter/${token}/comandas/`, data);
  }
  waiterUpdateComanda(token: string, comandaId: number, data: any): Observable<ApiResponse<Comanda>> {
    return this.http.patch<ApiResponse<Comanda>>(`${this.base}/waiter/${token}/comandas/${comandaId}/`, data);
  }
  waiterAddItem(token: string, comandaId: number, data: any): Observable<ApiResponse<ComandaItem>> {
    return this.http.post<ApiResponse<ComandaItem>>(`${this.base}/waiter/${token}/comandas/${comandaId}/items/`, data);
  }
  waiterRemoveItem(token: string, comandaId: number, itemId: number): Observable<any> {
    return this.http.delete(`${this.base}/waiter/${token}/comandas/${comandaId}/items/${itemId}/`);
  }
}
