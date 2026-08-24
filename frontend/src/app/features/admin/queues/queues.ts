import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { QueueService } from '../../../core/services/queue';
import { QueueResponse } from '../../../core/models/restaurant.models';

@Component({
  selector: 'app-admin-queues',
  standalone: true,
  imports: [
    CommonModule, MatCardModule, MatTableModule, MatButtonModule,
    MatIconModule, MatChipsModule, MatProgressSpinnerModule,
  ],
  templateUrl: './queues.html',
  styleUrl: './queues.scss',
})
export class QueuesComponent implements OnInit {
  private queueSvc = inject(QueueService);

  loading = true;
  queues: QueueResponse[] = [];
  displayedColumns = ['restaurant_name', 'status', 'current_size', 'estimated_wait_minutes', 'notes'];

  ngOnInit(): void {
    this.queueSvc.listAll().subscribe({
      next: (res) => { this.queues = res.data; },
      complete: () => { this.loading = false; },
    });
  }

  statusColor(status: string): string {
    return { OPEN: 'primary', CLOSED: 'warn', PAUSED: 'accent' }[status] || '';
  }
}
