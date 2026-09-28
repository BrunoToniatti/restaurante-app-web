import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RestaurantService } from '../../../core/services/restaurant';
import { ComandaService } from '../../../core/services/comanda';
import { MenuItem, MenuCategory } from '../../../core/models/restaurant.models';
import { RestaurantResponse } from '../../../core/models/restaurant.models';

const CATEGORIES: { value: MenuCategory; label: string; icon: string }[] = [
  { value: 'FOOD',    label: 'Comida',    icon: 'restaurant' },
  { value: 'DRINK',   label: 'Bebida',    icon: 'local_bar' },
  { value: 'DESSERT', label: 'Sobremesa', icon: 'cake' },
  { value: 'OTHER',   label: 'Outro',     icon: 'category' },
];

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [
    CommonModule, FormsModule, ReactiveFormsModule,
    MatCardModule, MatButtonModule, MatIconModule,
    MatFormFieldModule, MatInputModule, MatSelectModule,
    MatSlideToggleModule, MatSnackBarModule, MatProgressSpinnerModule,
    MatChipsModule, MatTooltipModule,
  ],
  templateUrl: './menu.html',
  styleUrl: './menu.scss',
})
export class MenuComponent implements OnInit {
  private restaurantSvc = inject(RestaurantService);
  private comandaSvc    = inject(ComandaService);
  private snack         = inject(MatSnackBar);
  private fb            = inject(FormBuilder);

  restaurants: RestaurantResponse[] = [];
  selectedRestaurantId: number | null = null;

  items: MenuItem[] = [];
  loading = false;
  saving  = false;

  showForm    = false;
  editingItem: MenuItem | null = null;
  filterCategory = '';
  categories = CATEGORIES;

  form = this.fb.group({
    name:        ['', Validators.required],
    description: [''],
    price:       [0, [Validators.required, Validators.min(0.01)]],
    image_url:   [''],
    category:    ['FOOD' as MenuCategory, Validators.required],
    subcategory: [''],
    available:   [true],
  });

  ngOnInit(): void {
    this.restaurantSvc.listMine().subscribe({
      next: (res) => {
        this.restaurants = res.data;
        if (this.restaurants.length === 1) {
          this.selectedRestaurantId = this.restaurants[0].id;
          this.loadMenu();
        }
      },
    });
  }

  selectRestaurant(id: number): void {
    this.selectedRestaurantId = id;
    this.loadMenu();
  }

  loadMenu(): void {
    if (!this.selectedRestaurantId) return;
    this.loading = true;
    this.comandaSvc.listMenu(this.selectedRestaurantId).subscribe({
      next: (res) => { this.items = res.data; this.loading = false; },
      error: () => { this.loading = false; },
    });
  }

  get filteredItems(): MenuItem[] {
    if (!this.filterCategory) return this.items;
    return this.items.filter(i => i.category === this.filterCategory);
  }

  getCategoryInfo(value: string) {
    return CATEGORIES.find(c => c.value === value) ?? CATEGORIES[0];
  }

  openForm(item?: MenuItem): void {
    this.editingItem = item ?? null;
    this.showForm = true;
    if (item) {
      this.form.setValue({
        name: item.name, description: item.description,
        price: item.price, image_url: item.image_url,
        category: item.category, subcategory: item.subcategory,
        available: item.available,
      });
    } else {
      this.form.reset({ category: 'FOOD', available: true, price: 0 });
    }
  }

  closeForm(): void { this.showForm = false; this.editingItem = null; }

  submit(): void {
    if (this.form.invalid || !this.selectedRestaurantId) return;
    this.saving = true;
    const val = this.form.value as any;
    const obs = this.editingItem
      ? this.comandaSvc.updateMenuItem(this.selectedRestaurantId, this.editingItem.id, val)
      : this.comandaSvc.createMenuItem(this.selectedRestaurantId, val);
    obs.subscribe({
      next: (res) => {
        if (this.editingItem) {
          this.items = this.items.map(i => i.id === res.data.id ? res.data : i);
        } else {
          this.items = [res.data, ...this.items];
        }
        this.snack.open(this.editingItem ? 'Item atualizado!' : 'Item criado!', 'OK', { duration: 2500 });
        this.closeForm();
        this.saving = false;
      },
      error: () => { this.snack.open('Erro ao salvar item.', 'Fechar', { duration: 3000 }); this.saving = false; },
    });
  }

  toggleAvailable(item: MenuItem): void {
    if (!this.selectedRestaurantId) return;
    this.comandaSvc.updateMenuItem(this.selectedRestaurantId, item.id, { available: !item.available }).subscribe({
      next: (res) => { this.items = this.items.map(i => i.id === res.data.id ? res.data : i); },
      error: () => this.snack.open('Erro ao atualizar disponibilidade.', 'Fechar', { duration: 3000 }),
    });
  }

  deleteItem(item: MenuItem): void {
    if (!this.selectedRestaurantId) return;
    if (!confirm(`Remover "${item.name}" do cardápio?`)) return;
    this.comandaSvc.deleteMenuItem(this.selectedRestaurantId, item.id).subscribe({
      next: () => { this.items = this.items.filter(i => i.id !== item.id); this.snack.open('Item removido.', 'OK', { duration: 2000 }); },
      error: () => this.snack.open('Erro ao remover item.', 'Fechar', { duration: 3000 }),
    });
  }

  formatCurrency(v: number): string {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v);
  }

  get multipleRestaurants(): boolean { return this.restaurants.length > 1; }
}
