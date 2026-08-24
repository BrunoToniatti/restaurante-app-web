import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RouterModule } from '@angular/router';
import { BugReportService } from '../../../core/services/bug-report';
import { QueueService } from '../../../core/services/queue';
import { RestaurantService } from '../../../core/services/restaurant';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule, MatProgressSpinnerModule, RouterModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class DashboardComponent implements OnInit {
  private bugs = inject(BugReportService);
  private queues = inject(QueueService);
  private restaurants = inject(RestaurantService);

  loading = true;
  stats = { openBugs: 0, totalRestaurants: 0, activeQueues: 0 };

  ngOnInit(): void {
    forkJoin({
      bugs: this.bugs.listAll(),
      queues: this.queues.listAll(),
      restaurants: this.restaurants.listAll(),
    }).subscribe({
      next: (res) => {
        this.stats.openBugs = res.bugs.data.filter((b: any) => b.status === 'OPEN' || b.status === 'IN_PROGRESS').length;
        this.stats.totalRestaurants = res.restaurants.data.length;
        this.stats.activeQueues = res.queues.data.filter((q: any) => q.status === 'OPEN').length;
      },
      complete: () => { this.loading = false; },
    });
  }
}
