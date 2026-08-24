import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AuthService } from '../../../core/services/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
  ],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);

  form = this.fb.group({
    identifier: ['', [Validators.required]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  loading = false;
  hidePassword = true;

  submit(): void {
    if (this.form.invalid) return;
    this.loading = true;

    this.auth.login(this.form.value as { identifier: string; password: string }).subscribe({
      next: (res) => {
        const dest = res.data.user.is_admin ? '/admin/dashboard' : '/gerente/dashboard';
        this.router.navigate([dest]);
      },
      error: (err) => {
        this.loading = false;
        const msg = err?.error?.errors?.detail || 'Credenciais inválidas. Tente novamente.';
        this.snackBar.open(msg, 'Fechar', { duration: 4000 });
      },
      complete: () => { this.loading = false; },
    });
  }
}
