import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { BugReportService } from '../../../core/services/bug-report';
import { BugReportResponse } from '../../../core/models/restaurant.models';

@Component({
  selector: 'app-bug-reports',
  standalone: true,
  imports: [
    CommonModule, FormsModule, ReactiveFormsModule,
    MatCardModule, MatTableModule, MatButtonModule, MatIconModule,
    MatInputModule, MatFormFieldModule, MatSelectModule, MatExpansionModule,
    MatChipsModule, MatProgressSpinnerModule, MatSnackBarModule,
  ],
  templateUrl: './bug-reports.html',
  styleUrl: './bug-reports.scss',
})
export class BugReportsComponent implements OnInit {
  private bugSvc = inject(BugReportService);
  private snackBar = inject(MatSnackBar);
  private fb = inject(FormBuilder);

  loading = true;
  reports: BugReportResponse[] = [];
  filtered: BugReportResponse[] = [];
  search = '';
  filterStatus = '';
  respondingId: number | null = null;

  respondForm = this.fb.group({
    status: ['', Validators.required],
    admin_response: ['', Validators.required],
  });

  ngOnInit(): void { this.load(); }

  load(): void {
    this.loading = true;
    this.bugSvc.listAll().subscribe({
      next: (res) => {
        this.reports = res.data;
        this.applyFilter();
      },
      complete: () => { this.loading = false; },
    });
  }

  applyFilter(): void {
    let data = this.reports;
    if (this.filterStatus) data = data.filter(r => r.status === this.filterStatus);
    if (this.search) {
      const q = this.search.toLowerCase();
      data = data.filter(r => r.title.toLowerCase().includes(q) || r.opened_by_name.toLowerCase().includes(q));
    }
    this.filtered = data;
  }

  startRespond(report: BugReportResponse): void {
    this.respondingId = report.id;
    this.respondForm.patchValue({ status: report.status, admin_response: report.admin_response || '' });
  }

  cancelRespond(): void { this.respondingId = null; }

  submitRespond(reportId: number): void {
    if (this.respondForm.invalid) return;
    this.bugSvc.respond(reportId, this.respondForm.value as any).subscribe({
      next: () => {
        this.snackBar.open('Resposta enviada!', 'OK', { duration: 3000 });
        this.respondingId = null;
        this.load();
      },
      error: () => this.snackBar.open('Erro ao responder.', 'Fechar', { duration: 3000 }),
    });
  }

  statusColor(status: string): string {
    return { OPEN: 'warn', IN_PROGRESS: 'accent', RESOLVED: 'primary', CLOSED: '' }[status] || '';
  }
}
