import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface CategoryItem {
  id: number;
  name: string;
  is_active: boolean;
}

export interface Category {
  id: number;
  name: string;
  description: string | null;
  is_active: boolean;
  items: CategoryItem[];
}

@Injectable({ providedIn: 'root' })
export class CategoryService {
  private http = inject(HttpClient);
  private base = `${environment.apiUrl}/categories`;

  listAll(): Observable<{ data: Category[] }> {
    return this.http.get<{ data: Category[] }>(`${this.base}/`);
  }

  createCategory(data: { name: string; description?: string }): Observable<{ data: Category }> {
    return this.http.post<{ data: Category }>(`${this.base}/`, data);
  }

  updateCategory(id: number, data: Partial<{ name: string; description: string; is_active: boolean }>): Observable<{ data: Category }> {
    return this.http.patch<{ data: Category }>(`${this.base}/${id}/`, data);
  }

  deleteCategory(id: number): Observable<any> {
    return this.http.delete(`${this.base}/${id}/`);
  }

  createItem(categoryId: number, data: { name: string }): Observable<{ data: CategoryItem }> {
    return this.http.post<{ data: CategoryItem }>(`${this.base}/${categoryId}/items/`, data);
  }

  updateItem(categoryId: number, itemId: number, data: Partial<{ name: string; is_active: boolean }>): Observable<{ data: CategoryItem }> {
    return this.http.patch<{ data: CategoryItem }>(`${this.base}/${categoryId}/items/${itemId}/`, data);
  }

  deleteItem(categoryId: number, itemId: number): Observable<any> {
    return this.http.delete(`${this.base}/${categoryId}/items/${itemId}/`);
  }

  getRestaurantCategories(restaurantId: number): Observable<{ data: CategoryItem[] }> {
    return this.http.get<{ data: CategoryItem[] }>(`${environment.apiUrl}/restaurants/${restaurantId}/categories/`);
  }

  updateRestaurantCategories(restaurantId: number, itemIds: number[]): Observable<any> {
    return this.http.put(`${environment.apiUrl}/restaurants/${restaurantId}/categories/`, { category_item_ids: itemIds });
  }
}
