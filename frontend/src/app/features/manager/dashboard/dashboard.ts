import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { forkJoin } from 'rxjs';
import { RestaurantService } from '../../../core/services/restaurant';
import { BugReportService } from '../../../core/services/bug-report';

@Component({
  selector: 'app-manager-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, MatCardModule, MatIconModule, MatButtonModule, MatProgressSpinnerModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class DashboardComponent implements OnInit {
  private restaurantSvc = inject(RestaurantService);
  private bugSvc = inject(BugReportService);

  loading = true;
  stats = { restaurants: 0, openBugs: 0 };

  ngOnInit(): void {
    forkJoin({
      restaurants: this.restaurantSvc.listMine(),
      bugs: this.bugSvc.listMine(),
    }).subscribe({
      next: (res) => {
        this.stats.restaurants = res.restaurants.data.length;
        this.stats.openBugs = res.bugs.data.filter((b: any) => b.status === 'OPEN' || b.status === 'IN_PROGRESS').length;
      },
      complete: () => { this.loading = false; },
    });
  }
}
