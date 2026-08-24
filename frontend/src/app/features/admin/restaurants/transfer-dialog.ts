import { Component, inject, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-transfer-dialog',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatDialogModule, MatFormFieldModule, MatInputModule, MatButtonModule],
  template: `
    <h2 mat-dialog-title>Transferir Restaurante</h2>
    <mat-dialog-content>
      <p>Transferir <strong>{{ data.restaurant.name }}</strong> para outro gerente.</p>
      <form [formGroup]="form">
        <mat-form-field appearance="outline" style="width:100%">
          <mat-label>ID do novo gerente</mat-label>
          <input matInput formControlName="managerId" type="number" placeholder="Ex: 5" />
          <mat-error>Informe um ID válido</mat-error>
        </mat-form-field>
      </form>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Cancelar</button>
      <button mat-flat-button color="primary" [disabled]="form.invalid" (click)="confirm()">Transferir</button>
    </mat-dialog-actions>
  `,
})
export class TransferDialogComponent {
  private fb = inject(FormBuilder);
  private dialogRef = inject(MatDialogRef<TransferDialogComponent>);
  data = inject(MAT_DIALOG_DATA);

  form = this.fb.group({
    managerId: [null, [Validators.required, Validators.min(1)]],
  });

  confirm(): void {
    if (this.form.valid) this.dialogRef.close(this.form.value.managerId);
  }
}
