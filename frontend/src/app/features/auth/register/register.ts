import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, AbstractControl } from '@angular/forms';
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
  selector: 'app-register',
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
  templateUrl: './register.html',
  styleUrl: './register.scss',
})
export class RegisterComponent {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);

  form = this.fb.group({
    first_name: ['', [Validators.required]],
    last_name: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    username: ['', [Validators.required, Validators.minLength(3)]],
    phone_number: ['', [Validators.required]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    confirm_password: ['', [Validators.required]],
  }, { validators: this.passwordMatch });

  loading = false;
  hidePassword = true;
  hideConfirm = true;

  private passwordMatch(group: AbstractControl) {
    const pw = group.get('password')?.value;
    const confirm = group.get('confirm_password')?.value;
    return pw === confirm ? null : { mismatch: true };
  }

  formatPhone(event: Event): void {
    const input = event.target as HTMLInputElement;
    let v = input.value.replace(/\D/g, '').slice(0, 11);
    if (v.length > 6) v = `(${v.slice(0,2)}) ${v.slice(2,7)}-${v.slice(7)}`;
    else if (v.length > 2) v = `(${v.slice(0,2)}) ${v.slice(2)}`;
    input.value = v;
    this.form.get('phone_number')?.setValue(v, { emitEvent: false });
  }

  submit(): void {
    if (this.form.invalid) return;
    this.loading = true;

    const { confirm_password, ...payload } = this.form.value as any;
    this.auth.register(payload).subscribe({
      next: () => {
        this.snackBar.open('Conta criada com sucesso! Faça login.', 'OK', { duration: 4000 });
        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.loading = false;
        const errors = err?.error?.errors;
        const msg = errors
          ? Object.values(errors).flat().join(' ')
          : 'Erro ao criar conta. Tente novamente.';
        this.snackBar.open(msg, 'Fechar', { duration: 5000 });
      },
      complete: () => { this.loading = false; },
    });
  }
}
