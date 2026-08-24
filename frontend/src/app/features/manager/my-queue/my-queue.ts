import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatChipsModule } from '@angular/material/chips';
import { QueueService } from '../../../core/services/queue';
import { QueueResponse } from '../../../core/models/restaurant.models';

@Component({
  selector: 'app-my-queue',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, MatCardModule, MatFormFieldModule,
    MatInputModule, MatSelectModule, MatButtonModule, MatIconModule,
    MatProgressSpinnerModule, MatSnackBarModule, MatChipsModule,
  ],
  templateUrl: './my-queue.html',
  styleUrl: './my-queue.scss',
})
export class MyQueueComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private queueSvc = inject(QueueService);
  private snackBar = inject(MatSnackBar);
  private fb = inject(FormBuilder);

  restaurantId = 0;
  queue: QueueResponse | null = null;
  loading = true;
  saving = false;

  form = this.fb.group({
    status: ['', Validators.required],
    current_size: [0, [Validators.required, Validators.min(0)]],
    estimated_wait_minutes: [0, [Validators.required, Validators.min(0)]],
    notes: [''],
  });

  ngOnInit(): void {
    this.restaurantId = Number(this.route.snapshot.paramMap.get('id'));
    this.queueSvc.getByRestaurant(this.restaurantId).subscribe({
      next: (res) => {
        this.queue = res.data;
        this.form.patchValue(res.data);
      },
      complete: () => { this.loading = false; },
    });
  }

  save(): void {
    if (this.form.invalid) return;
    this.saving = true;
    this.queueSvc.update(this.restaurantId, this.form.value as any).subscribe({
      next: (res) => {
        this.queue = res.data;
        this.snackBar.open('Fila atualizada!', 'OK', { duration: 3000 });
      },
      error: () => this.snackBar.open('Erro ao atualizar a fila.', 'Fechar', { duration: 3000 }),
      complete: () => { this.saving = false; },
    });
  }

  statusColor(status: string): string {
    return { OPEN: 'primary', CLOSED: 'warn', PAUSED: 'accent' }[status] || '';
  }
}
