import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatChipsModule } from '@angular/material/chips';
import { BugReportService } from '../../../core/services/bug-report';
import { BugReportResponse } from '../../../core/models/restaurant.models';

@Component({
  selector: 'app-open-report',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, MatCardModule, MatFormFieldModule,
    MatInputModule, MatSelectModule, MatButtonModule, MatIconModule,
    MatProgressSpinnerModule, MatSnackBarModule, MatExpansionModule, MatChipsModule,
  ],
  templateUrl: './open-report.html',
  styleUrl: './open-report.scss',
})
export class OpenReportComponent implements OnInit {
  private bugSvc = inject(BugReportService);
  private snackBar = inject(MatSnackBar);
  private fb = inject(FormBuilder);

  loading = true;
  sending = false;
  reports: BugReportResponse[] = [];
  showForm = false;

  form = this.fb.group({
    title: ['', [Validators.required, Validators.minLength(5)]],
    description: ['', [Validators.required, Validators.minLength(10)]],
    platform: ['WEB', Validators.required],
    category: ['BUG', Validators.required],
  });

  ngOnInit(): void { this.load(); }

  load(): void {
    this.loading = true;
    this.bugSvc.listMine().subscribe({
      next: (res) => { this.reports = res.data; },
      complete: () => { this.loading = false; },
    });
  }

  submit(): void {
    if (this.form.invalid) return;
    this.sending = true;
    this.bugSvc.create(this.form.value as any).subscribe({
      next: () => {
        this.snackBar.open('Chamado aberto com sucesso!', 'OK', { duration: 3000 });
        this.form.reset({ platform: 'WEB', category: 'BUG' });
        this.showForm = false;
        this.load();
      },
      error: () => this.snackBar.open('Erro ao abrir chamado.', 'Fechar', { duration: 3000 }),
      complete: () => { this.sending = false; },
    });
  }

  statusColor(status: string): string {
    return { OPEN: 'warn', IN_PROGRESS: 'accent', RESOLVED: 'primary', CLOSED: '' }[status] || '';
  }
}
