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
import { MatSelectModule } from '@angular/material/select';
import { MatExpansionModule } from '@angular/material/expansion';
import { QueueService } from '../../../core/services/queue';
import { QueueResponse } from '../../../core/models/restaurant.models';

@Component({
  selector: 'app-admin-queues',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule,
    MatCardModule, MatButtonModule, MatIconModule,
    MatProgressSpinnerModule, MatSnackBarModule,
    MatFormFieldModule, MatInputModule, MatSelectModule, MatExpansionModule,
  ],
  templateUrl: './queues.html',
  styleUrl: './queues.scss',
})
export class QueuesComponent implements OnInit {
  private queueSvc = inject(QueueService);
  private snackBar = inject(MatSnackBar);
  private fb = inject(FormBuilder);

  loading = true;
  queues: QueueResponse[] = [];
  editingId: number | null = null;
  saving = false;

  editForm = this.fb.group({
    status: ['', Validators.required],
    current_size: [0, [Validators.required, Validators.min(0)]],
    estimated_wait_minutes: [0, [Validators.required, Validators.min(0)]],
    notes: [''],
  });

  ngOnInit(): void { this.load(); }

  load(): void {
    this.loading = true;
    this.queueSvc.listAll().subscribe({
      next: (res) => { this.queues = res.data; },
      complete: () => { this.loading = false; },
    });
  }

  startEdit(q: QueueResponse): void {
    this.editingId = q.restaurant;
    this.editForm.patchValue(q);
  }

  cancelEdit(): void { this.editingId = null; }

  saveEdit(restaurantId: number): void {
    if (this.editForm.invalid) return;
    this.saving = true;
    this.queueSvc.adminUpdate(restaurantId, this.editForm.value as any).subscribe({
      next: () => {
        this.snackBar.open('Fila atualizada!', 'OK', { duration: 3000 });
        this.editingId = null;
        this.load();
      },
      error: () => this.snackBar.open('Erro ao atualizar.', 'Fechar', { duration: 3000 }),
      complete: () => { this.saving = false; },
    });
  }
}
