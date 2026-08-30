import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CategoryService, Category } from '../../../core/services/category';

@Component({
  selector: 'app-admin-categories',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule,
    MatCardModule, MatButtonModule, MatIconModule,
    MatProgressSpinnerModule, MatSnackBarModule,
    MatFormFieldModule, MatInputModule,
    MatExpansionModule, MatChipsModule, MatTooltipModule,
  ],
  templateUrl: './categories.html',
  styleUrl: './categories.scss',
})
export class CategoriesComponent implements OnInit {
  private svc = inject(CategoryService);
  private snack = inject(MatSnackBar);
  private fb = inject(FormBuilder);

  loading = true;
  categories: Category[] = [];

  catForm = this.fb.group({
    name: ['', Validators.required],
    description: [''],
  });

  itemForms: Record<number, string> = {};
  addingItemFor: number | null = null;
  editingCat: number | null = null;

  ngOnInit() { this.load(); }

  load() {
    this.loading = true;
    this.svc.listAll().subscribe({
      next: (res) => { this.categories = res.data; this.loading = false; },
      error: () => { this.snack.open('Erro ao carregar categorias', 'Fechar', { duration: 3000 }); this.loading = false; },
    });
  }

  createCategory() {
    if (this.catForm.invalid) return;
    const { name, description } = this.catForm.value;
    this.svc.createCategory({ name: name!, description: description || undefined }).subscribe({
      next: () => { this.catForm.reset(); this.load(); this.snack.open('Categoria criada!', 'Fechar', { duration: 2500 }); },
      error: () => this.snack.open('Erro ao criar categoria', 'Fechar', { duration: 3000 }),
    });
  }

  deleteCategory(id: number) {
    if (!confirm('Excluir esta categoria e todos os seus itens?')) return;
    this.svc.deleteCategory(id).subscribe({
      next: () => { this.load(); this.snack.open('Categoria excluída', 'Fechar', { duration: 2500 }); },
      error: () => this.snack.open('Erro ao excluir', 'Fechar', { duration: 3000 }),
    });
  }

  startAddItem(catId: number) {
    this.addingItemFor = catId;
    this.itemForms[catId] = '';
  }

  addItem(catId: number) {
    const name = (this.itemForms[catId] || '').trim();
    if (!name) return;
    this.svc.createItem(catId, { name }).subscribe({
      next: () => { this.addingItemFor = null; this.load(); this.snack.open('Item adicionado!', 'Fechar', { duration: 2500 }); },
      error: () => this.snack.open('Erro ao adicionar item', 'Fechar', { duration: 3000 }),
    });
  }

  deleteItem(catId: number, itemId: number) {
    this.svc.deleteItem(catId, itemId).subscribe({
      next: () => this.load(),
      error: () => this.snack.open('Erro ao excluir item', 'Fechar', { duration: 3000 }),
    });
  }
}
