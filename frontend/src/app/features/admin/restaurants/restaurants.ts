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
import { MatChipsModule } from '@angular/material/chips';
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
    MatProgressSpinnerModule, MatChipsModule,
  ],
  templateUrl: './restaurants.html',
  styleUrl: './restaurants.scss',
})
export class RestaurantsComponent implements OnInit {
  private restaurantSvc = inject(RestaurantService);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);

  loading = true;
  restaurants: RestaurantResponse[] = [];
  filtered: RestaurantResponse[] = [];
  search = '';
  displayedColumns = ['name', 'cnpj', 'contact_phone', 'address', 'actions'];

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
