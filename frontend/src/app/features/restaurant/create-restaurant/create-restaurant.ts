import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatDividerModule } from '@angular/material/divider';
import { RestaurantService } from '../../../core/services/restaurant';
import { AuthService } from '../../../core/services/auth';

function cnpjValidator(control: AbstractControl) {
  const raw = control.value?.replace(/\D/g, '');
  if (!raw) return null;
  return raw.length === 14 ? null : { cnpjInvalido: true };
}

@Component({
  selector: 'app-create-restaurant',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatToolbarModule,
    MatDividerModule,
  ],
  templateUrl: './create-restaurant.html',
  styleUrl: './create-restaurant.scss',
})
export class CreateRestaurantComponent {
  private fb = inject(FormBuilder);
  private restaurantService = inject(RestaurantService);
  private auth = inject(AuthService);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);

  currentUser = this.auth.getCurrentUser();
  loading = false;

  form = this.fb.group({
    name: ['', [Validators.required, Validators.maxLength(200)]],
    cnpj: ['', [Validators.required, cnpjValidator]],
    contact_phone: ['', [Validators.required]],
    address: ['', [Validators.required]],
    site: [''],
    instagram: [''],
  });

  formatCnpj(event: Event): void {
    const input = event.target as HTMLInputElement;
    let val = input.value.replace(/\D/g, '').slice(0, 14);
    if (val.length > 12) val = val.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, '$1.$2.$3/$4-$5');
    else if (val.length > 8) val = val.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})/, '$1.$2.$3/$4');
    else if (val.length > 5) val = val.replace(/^(\d{2})(\d{3})(\d{3})/, '$1.$2.$3');
    else if (val.length > 2) val = val.replace(/^(\d{2})(\d{3})/, '$1.$2');
    input.value = val;
    this.form.get('cnpj')!.setValue(val, { emitEvent: false });
  }

  formatPhone(event: Event): void {
    const input = event.target as HTMLInputElement;
    let val = input.value.replace(/\D/g, '').slice(0, 11);
    if (val.length > 10) val = val.replace(/^(\d{2})(\d{5})(\d{4})$/, '($1) $2-$3');
    else if (val.length > 6) val = val.replace(/^(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3');
    else if (val.length > 2) val = val.replace(/^(\d{2})(\d{0,5})/, '($1) $2');
    input.value = val;
    this.form.get('contact_phone')!.setValue(val, { emitEvent: false });
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.loading = true;

    const payload = {
      ...this.form.value,
      cnpj: this.form.value.cnpj!.replace(/\D/g, ''),
    } as any;

    this.restaurantService.create(payload).subscribe({
      next: (res) => {
        this.loading = false;
        this.snackBar.open(`Restaurante "${res.data.name}" criado com sucesso!`, 'OK', {
          duration: 5000,
        });
        this.form.reset();
      },
      error: (err) => {
        this.loading = false;
        const errors = err?.error?.errors;
        const msg = errors
          ? Object.values(errors).flat().join(' ')
          : 'Erro ao criar restaurante. Tente novamente.';
        this.snackBar.open(msg, 'Fechar', { duration: 5000 });
      },
    });
  }

  logout(): void {
    this.auth.logout();
  }
}
