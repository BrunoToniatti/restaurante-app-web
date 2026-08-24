import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { RestaurantService } from '../../../core/services/restaurant';
import { RestaurantResponse } from '../../../core/models/restaurant.models';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog';

@Component({
  selector: 'app-my-restaurants',
  standalone: true,
  imports: [
    CommonModule, RouterModule, MatCardModule, MatButtonModule,
    MatIconModule, MatProgressSpinnerModule, MatSnackBarModule, MatDialogModule,
  ],
  templateUrl: './my-restaurants.html',
  styleUrl: './my-restaurants.scss',
})
export class MyRestaurantsComponent implements OnInit {
  private restaurantSvc = inject(RestaurantService);
  private snackBar = inject(MatSnackBar);
  private dialog = inject(MatDialog);

  loading = true;
  restaurants: RestaurantResponse[] = [];

  ngOnInit(): void { this.load(); }

  load(): void {
    this.loading = true;
    this.restaurantSvc.listMine().subscribe({
      next: (res) => { this.restaurants = res.data; },
      complete: () => { this.loading = false; },
    });
  }

  confirmDelete(restaurant: RestaurantResponse): void {
    const ref = this.dialog.open(ConfirmDialogComponent, {
      width: '360px',
      data: { message: `Excluir o restaurante "${restaurant.name}"?` },
    });
    ref.afterClosed().subscribe(confirmed => {
      if (!confirmed) return;
      this.restaurantSvc.delete(restaurant.id).subscribe({
        next: () => {
          this.snackBar.open('Restaurante excluído.', 'OK', { duration: 3000 });
          this.load();
        },
        error: () => this.snackBar.open('Erro ao excluir.', 'Fechar', { duration: 3000 }),
      });
    });
  }
}
