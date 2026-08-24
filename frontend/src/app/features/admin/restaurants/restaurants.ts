import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RestaurantService } from '../../../core/services/restaurant';
import { RestaurantResponse } from '../../../core/models/restaurant.models';
import { TransferDialogComponent } from './transfer-dialog';

@Component({
  selector: 'app-admin-restaurants',
  standalone: true,
  imports: [
    CommonModule, FormsModule, ReactiveFormsModule,
    MatCardModule, MatTableModule, MatButtonModule, MatIconModule,
    MatInputModule, MatFormFieldModule, MatDialogModule, MatSnackBarModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './restaurants.html',
  styleUrl: './restaurants.scss',
})
export class RestaurantsComponent implements OnInit {
  private restaurantSvc = inject(RestaurantService);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);
  private fb = inject(FormBuilder);

  loading = true;
  saving = false;
  showForm = false;
  restaurants: RestaurantResponse[] = [];
  filtered: RestaurantResponse[] = [];
  search = '';
  displayedColumns = ['name', 'cnpj', 'contact_phone', 'address', 'actions'];

  createForm = this.fb.group({
    name: ['', Validators.required],
    cnpj: ['', Validators.required],
    contact_phone: ['', Validators.required],
    address: ['', Validators.required],
    site: [''],
    instagram: [''],
  });

  ngOnInit(): void { this.load(); }

  load(): void {
    this.loading = true;
    this.restaurantSvc.listAll().subscribe({
      next: (res) => {
        this.restaurants = res.data;
        this.applyFilter();
      },
      complete: () => { this.loading = false; },
    });
  }

  applyFilter(): void {
    const q = this.search.toLowerCase();
    this.filtered = this.restaurants.filter(r =>
      r.name.toLowerCase().includes(q) || r.cnpj.includes(q)
    );
  }

  formatCnpj(event: Event): void {
    const input = event.target as HTMLInputElement;
    let v = input.value.replace(/\D/g, '').slice(0, 14);
    if (v.length > 12) v = `${v.slice(0,2)}.${v.slice(2,5)}.${v.slice(5,8)}/${v.slice(8,12)}-${v.slice(12)}`;
    else if (v.length > 8) v = `${v.slice(0,2)}.${v.slice(2,5)}.${v.slice(5,8)}/${v.slice(8)}`;
    else if (v.length > 5) v = `${v.slice(0,2)}.${v.slice(2,5)}.${v.slice(5)}`;
    else if (v.length > 2) v = `${v.slice(0,2)}.${v.slice(2)}`;
    input.value = v;
    this.createForm.get('cnpj')?.setValue(v, { emitEvent: false });
  }

  submitCreate(): void {
    if (this.createForm.invalid) return;
    this.saving = true;
    this.restaurantSvc.adminCreate(this.createForm.value as any).subscribe({
      next: () => {
        this.snackBar.open('Restaurante criado!', 'OK', { duration: 3000 });
        this.createForm.reset();
        this.showForm = false;
        this.load();
      },
      error: (err) => {
        const msg = err?.error?.errors ? Object.values(err.error.errors).flat().join(' ') : 'Erro ao criar restaurante.';
        this.snackBar.open(msg, 'Fechar', { duration: 4000 });
      },
      complete: () => { this.saving = false; },
    });
  }

  openTransfer(restaurant: RestaurantResponse): void {
    const ref = this.dialog.open(TransferDialogComponent, {
      width: '400px',
      data: { restaurant },
    });
    ref.afterClosed().subscribe(newManagerId => {
      if (!newManagerId) return;
      this.restaurantSvc.transfer(restaurant.id, newManagerId).subscribe({
        next: () => {
          this.snackBar.open('Restaurante transferido com sucesso!', 'OK', { duration: 3000 });
          this.load();
        },
        error: () => this.snackBar.open('Erro ao transferir restaurante.', 'Fechar', { duration: 3000 }),
      });
    });
  }
}
