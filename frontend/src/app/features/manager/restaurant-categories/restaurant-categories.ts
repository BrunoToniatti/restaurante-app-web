import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatExpansionModule } from '@angular/material/expansion';
import { CategoryService, Category, CategoryItem } from '../../../core/services/category';

@Component({
  selector: 'app-restaurant-categories',
  standalone: true,
  imports: [
    CommonModule, MatCardModule, MatButtonModule, MatIconModule,
    MatSnackBarModule, MatProgressSpinnerModule, MatExpansionModule,
  ],
  templateUrl: './restaurant-categories.html',
  styleUrl: './restaurant-categories.scss',
})
export class RestaurantCategoriesComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private svc = inject(CategoryService);
  private snack = inject(MatSnackBar);

  restaurantId!: number;
  loading = true;
  saving = false;
  categories: Category[] = [];
  selectedIds = new Set<number>();

  ngOnInit() {
    this.restaurantId = Number(this.route.snapshot.paramMap.get('id'));
    this.load();
  }

  load() {
    this.loading = true;
    this.svc.listAll().subscribe({
      next: (allRes) => {
        this.categories = allRes.data;
        this.svc.getRestaurantCategories(this.restaurantId).subscribe({
          next: (selRes) => {
            this.selectedIds = new Set(selRes.data.map((i: CategoryItem) => i.id));
            this.loading = false;
          },
          error: () => { this.loading = false; },
        });
      },
      error: () => { this.snack.open('Erro ao carregar categorias', 'Fechar', { duration: 3000 }); this.loading = false; },
    });
  }

  toggle(itemId: number) {
    if (this.selectedIds.has(itemId)) {
      this.selectedIds.delete(itemId);
    } else {
      this.selectedIds.add(itemId);
    }
  }

  isSelected(itemId: number): boolean {
    return this.selectedIds.has(itemId);
  }

  countSelected(cat: Category): number {
    return cat.items.filter(i => this.selectedIds.has(i.id)).length;
  }

  save() {
    this.saving = true;
    this.svc.updateRestaurantCategories(this.restaurantId, Array.from(this.selectedIds)).subscribe({
      next: () => {
        this.snack.open('Categorias salvas com sucesso!', 'Fechar', { duration: 2500 });
        this.saving = false;
        this.router.navigate(['/gerente/restaurantes']);
      },
      error: () => { this.snack.open('Erro ao salvar', 'Fechar', { duration: 3000 }); this.saving = false; },
    });
  }

  back() { this.router.navigate(['/gerente/restaurantes']); }
}
