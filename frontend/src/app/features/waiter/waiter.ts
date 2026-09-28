import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ComandaService } from '../../core/services/comanda';
import { Comanda, ComandaItem, MenuItem, RestaurantTable, WaiterInfo } from '../../core/models/restaurant.models';

@Component({
  selector: 'app-waiter',
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    MatCardModule, MatButtonModule, MatIconModule,
    MatProgressSpinnerModule, MatSnackBarModule,
  ],
  templateUrl: './waiter.html',
  styleUrl: './waiter.scss',
})
export class WaiterComponent implements OnInit {
  private route      = inject(ActivatedRoute);
  private comandaSvc = inject(ComandaService);
  private snack      = inject(MatSnackBar);

  token = '';
  info: WaiterInfo | null = null;
  comandas: Comanda[] = [];
  loading = true;
  error = '';

  // UI state
  view: 'list' | 'comanda' | 'new' = 'list';
  selectedComanda: Comanda | null = null;
  showAddItem = false;

  // New comanda
  newTableId: number | null = null;
  newTableLabel = '';
  newNotes = '';

  // Add item
  itemSearch = '';
  selectedMenuItem: MenuItem | null = null;
  addQty = 1;
  addNotes = '';

  get filteredMenu(): MenuItem[] {
    const q = this.itemSearch.toLowerCase();
    return (this.info?.menu ?? []).filter(m => m.available && (!q || m.name.toLowerCase().includes(q)));
  }

  ngOnInit(): void {
    this.token = this.route.snapshot.paramMap.get('token') ?? '';
    if (!this.token) { this.error = 'Token inválido.'; this.loading = false; return; }
    this.loadInfo();
  }

  loadInfo(): void {
    this.loading = true;
    this.comandaSvc.getWaiterInfo(this.token).subscribe({
      next: (res) => {
        this.info = res.data;
        this.loadComandas();
      },
      error: () => { this.error = 'Link inválido ou desativado.'; this.loading = false; },
    });
  }

  loadComandas(): void {
    this.comandaSvc.waiterListComandas(this.token).subscribe({
      next: (res) => { this.comandas = res.data; this.loading = false; },
      error: () => { this.loading = false; },
    });
  }

  openComanda(c: Comanda): void { this.selectedComanda = c; this.view = 'comanda'; this.showAddItem = false; }

  createComanda(): void {
    const data: any = {};
    if (this.newTableId) data['table_id'] = this.newTableId;
    if (this.newTableLabel.trim()) data['table_label'] = this.newTableLabel.trim();
    if (this.newNotes.trim()) data['notes'] = this.newNotes.trim();
    this.comandaSvc.waiterCreateComanda(this.token, data).subscribe({
      next: (res) => {
        this.comandas = [res.data, ...this.comandas];
        this.selectedComanda = res.data;
        this.view = 'comanda';
        this.newTableId = null; this.newTableLabel = ''; this.newNotes = '';
        this.snack.open('Comanda aberta!', 'OK', { duration: 2000 });
      },
      error: () => this.snack.open('Erro ao abrir comanda.', 'Fechar', { duration: 3000 }),
    });
  }

  closeComanda(c: Comanda): void {
    if (!confirm(`Fechar comanda "${c.table_label || '#' + c.id}"?`)) return;
    this.comandaSvc.waiterUpdateComanda(this.token, c.id, { status: 'CLOSED' }).subscribe({
      next: (res) => {
        this.comandas = this.comandas.map(x => x.id === res.data.id ? res.data : x);
        this.selectedComanda = res.data;
        this.snack.open('Comanda fechada.', 'OK', { duration: 2000 });
        this.view = 'list';
      },
      error: () => this.snack.open('Erro.', 'Fechar', { duration: 3000 }),
    });
  }

  addItem(c: Comanda): void {
    if (!this.selectedMenuItem) return;
    this.comandaSvc.waiterAddItem(this.token, c.id, {
      menu_item_id: this.selectedMenuItem.id,
      quantity: this.addQty,
      notes: this.addNotes,
    }).subscribe({
      next: (res) => {
        const updated = { ...c, items: [...c.items, res.data], total: c.total + res.data.subtotal };
        this.comandas = this.comandas.map(x => x.id === c.id ? updated : x);
        this.selectedComanda = updated;
        this.resetAdd();
        this.showAddItem = false;
        this.snack.open('Item adicionado!', 'OK', { duration: 1500 });
      },
      error: () => this.snack.open('Erro ao adicionar item.', 'Fechar', { duration: 3000 }),
    });
  }

  removeItem(c: Comanda, item: ComandaItem): void {
    this.comandaSvc.waiterRemoveItem(this.token, c.id, item.id).subscribe({
      next: () => {
        const updated = { ...c, items: c.items.filter(i => i.id !== item.id), total: c.total - item.subtotal };
        this.comandas = this.comandas.map(x => x.id === c.id ? updated : x);
        this.selectedComanda = updated;
      },
      error: () => this.snack.open('Erro.', 'Fechar', { duration: 3000 }),
    });
  }

  resetAdd(): void { this.selectedMenuItem = null; this.addQty = 1; this.addNotes = ''; this.itemSearch = ''; }

  get openComandas(): Comanda[] { return this.comandas.filter(c => c.status === 'OPEN'); }

  currency(v: number): string {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v);
  }
}
