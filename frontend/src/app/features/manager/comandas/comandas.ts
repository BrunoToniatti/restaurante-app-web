import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTabsModule } from '@angular/material/tabs';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatBadgeModule } from '@angular/material/badge';
import { RestaurantService } from '../../../core/services/restaurant';
import { ComandaService } from '../../../core/services/comanda';
import {
  Comanda, ComandaItem, MenuItem, RestaurantTable, StaffToken,
} from '../../../core/models/restaurant.models';
import { RestaurantResponse } from '../../../core/models/restaurant.models';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-comandas',
  standalone: true,
  imports: [
    CommonModule, FormsModule, ReactiveFormsModule,
    MatCardModule, MatButtonModule, MatIconModule,
    MatFormFieldModule, MatInputModule, MatSelectModule,
    MatSnackBarModule, MatProgressSpinnerModule, MatTabsModule,
    MatChipsModule, MatDividerModule, MatTooltipModule, MatBadgeModule,
  ],
  templateUrl: './comandas.html',
  styleUrl: './comandas.scss',
})
export class ComandasComponent implements OnInit {
  private restaurantSvc = inject(RestaurantService);
  private comandaSvc    = inject(ComandaService);
  private snack         = inject(MatSnackBar);
  private fb            = inject(FormBuilder);

  restaurants: RestaurantResponse[] = [];
  selectedRestaurantId: number | null = null;

  comandas: Comanda[] = [];
  tables: RestaurantTable[] = [];
  menuItems: MenuItem[] = [];
  staffTokens: StaffToken[] = [];
  loading = false;

  // Active tab: 'open' | 'closed' | 'tables' | 'tokens'
  activeTab: 'open' | 'closed' | 'tables' | 'tokens' = 'open';

  // Panel state
  selectedComanda: Comanda | null = null;
  showNewComandaForm = false;
  showAddItemPanel  = false;
  showTableForm     = false;
  showTokenForm     = false;

  newComandaForm = this.fb.group({
    table_id:    [null as number | null],
    table_label: [''],
    notes:       [''],
  });

  newTableIdentifier = '';
  newTableCapacity: number | null = null;
  newStaffName = '';

  addItemSearch = '';
  addItemQty = 1;
  addItemNotes = '';
  selectedMenuItem: MenuItem | null = null;

  get openComandas()   { return this.comandas.filter(c => c.status === 'OPEN'); }
  get closedComandas() { return this.comandas.filter(c => c.status === 'CLOSED'); }

  get filteredMenuForAdd(): MenuItem[] {
    const q = this.addItemSearch.toLowerCase();
    return this.menuItems.filter(m => m.available && (!q || m.name.toLowerCase().includes(q)));
  }

  waiterLink(tok: StaffToken): string {
    const origin = window.location.origin;
    return `${origin}/garcom/${tok.token}`;
  }

  ngOnInit(): void {
    this.restaurantSvc.listMine().subscribe({
      next: (res) => {
        this.restaurants = res.data;
        if (this.restaurants.length === 1) {
          this.selectedRestaurantId = this.restaurants[0].id;
          this.loadAll();
        }
      },
    });
  }

  selectRestaurant(id: number): void {
    this.selectedRestaurantId = id;
    this.loadAll();
  }

  loadAll(): void {
    if (!this.selectedRestaurantId) return;
    this.loading = true;
    const id = this.selectedRestaurantId;
    Promise.all([
      this.comandaSvc.listComandas(id).toPromise(),
      this.comandaSvc.listTables(id).toPromise(),
      this.comandaSvc.listMenu(id).toPromise(),
      this.comandaSvc.listStaffTokens(id).toPromise(),
    ]).then(([c, t, m, s]) => {
      this.comandas    = c?.data ?? [];
      this.tables      = t?.data ?? [];
      this.menuItems   = m?.data ?? [];
      this.staffTokens = s?.data ?? [];
      this.loading = false;
    }).catch(() => { this.loading = false; });
  }

  // ── COMANDAS ──────────────────────────────────────────────────────────────
  openNewComanda(): void {
    this.showNewComandaForm = true;
    this.newComandaForm.reset();
  }

  createComanda(): void {
    if (!this.selectedRestaurantId) return;
    const v = this.newComandaForm.value;
    const data: any = { opened_by: 'Manager', notes: v.notes ?? '' };
    if (v.table_id) data['table_id'] = v.table_id;
    if (v.table_label) data['table_label'] = v.table_label;
    this.comandaSvc.createComanda(this.selectedRestaurantId, data).subscribe({
      next: (res) => {
        this.comandas = [res.data, ...this.comandas];
        this.showNewComandaForm = false;
        this.snack.open('Comanda aberta!', 'OK', { duration: 2000 });
        this.selectComanda(res.data);
      },
      error: () => this.snack.open('Erro ao abrir comanda.', 'Fechar', { duration: 3000 }),
    });
  }

  selectComanda(c: Comanda): void { this.selectedComanda = c; }

  closeComanda(c: Comanda): void {
    if (!this.selectedRestaurantId) return;
    if (!confirm(`Fechar comanda "${c.table_label || '#' + c.id}"? Total: ${this.formatCurrency(c.total)}`)) return;
    this.comandaSvc.updateComanda(this.selectedRestaurantId, c.id, { status: 'CLOSED' }).subscribe({
      next: (res) => {
        this.comandas = this.comandas.map(x => x.id === res.data.id ? res.data : x);
        if (this.selectedComanda?.id === c.id) this.selectedComanda = res.data;
        this.snack.open('Comanda fechada.', 'OK', { duration: 2000 });
      },
      error: () => this.snack.open('Erro ao fechar comanda.', 'Fechar', { duration: 3000 }),
    });
  }

  addItem(c: Comanda): void {
    if (!this.selectedRestaurantId || !this.selectedMenuItem) return;
    this.comandaSvc.addComandaItem(this.selectedRestaurantId, c.id, {
      menu_item_id: this.selectedMenuItem.id,
      quantity: this.addItemQty,
      notes: this.addItemNotes,
    }).subscribe({
      next: (res) => {
        const updated = { ...c, items: [...c.items, res.data], total: c.total + res.data.subtotal };
        this.comandas = this.comandas.map(x => x.id === c.id ? updated : x);
        if (this.selectedComanda?.id === c.id) this.selectedComanda = updated;
        this.resetAddItem();
        this.snack.open('Item adicionado!', 'OK', { duration: 1500 });
      },
      error: () => this.snack.open('Erro ao adicionar item.', 'Fechar', { duration: 3000 }),
    });
  }

  removeItem(c: Comanda, item: ComandaItem): void {
    if (!this.selectedRestaurantId) return;
    this.comandaSvc.removeComandaItem(this.selectedRestaurantId, c.id, item.id).subscribe({
      next: () => {
        const updated = { ...c, items: c.items.filter(i => i.id !== item.id), total: c.total - item.subtotal };
        this.comandas = this.comandas.map(x => x.id === c.id ? updated : x);
        if (this.selectedComanda?.id === c.id) this.selectedComanda = updated;
      },
      error: () => this.snack.open('Erro ao remover item.', 'Fechar', { duration: 3000 }),
    });
  }

  resetAddItem(): void {
    this.selectedMenuItem = null; this.addItemQty = 1;
    this.addItemNotes = ''; this.addItemSearch = '';
  }

  // ── TABLES ───────────────────────────────────────────────────────────────
  createTable(): void {
    if (!this.selectedRestaurantId || !this.newTableIdentifier.trim()) return;
    this.comandaSvc.createTable(this.selectedRestaurantId, this.newTableIdentifier.trim(), this.newTableCapacity ?? undefined).subscribe({
      next: (res) => {
        this.tables = [...this.tables, res.data];
        this.newTableIdentifier = ''; this.newTableCapacity = null;
        this.showTableForm = false;
        this.snack.open('Mesa criada!', 'OK', { duration: 2000 });
      },
      error: () => this.snack.open('Erro ao criar mesa.', 'Fechar', { duration: 3000 }),
    });
  }

  deleteTable(t: RestaurantTable): void {
    if (!this.selectedRestaurantId) return;
    if (!confirm(`Remover mesa "${t.identifier}"?`)) return;
    this.comandaSvc.deleteTable(this.selectedRestaurantId, t.id).subscribe({
      next: () => { this.tables = this.tables.filter(x => x.id !== t.id); this.snack.open('Mesa removida.', 'OK', { duration: 2000 }); },
      error: () => this.snack.open('Erro ao remover mesa.', 'Fechar', { duration: 3000 }),
    });
  }

  // ── STAFF TOKENS ─────────────────────────────────────────────────────────
  createToken(): void {
    if (!this.selectedRestaurantId || !this.newStaffName.trim()) return;
    this.comandaSvc.createStaffToken(this.selectedRestaurantId, this.newStaffName.trim()).subscribe({
      next: (res) => {
        this.staffTokens = [res.data, ...this.staffTokens];
        this.newStaffName = ''; this.showTokenForm = false;
        this.snack.open('Link gerado!', 'OK', { duration: 2000 });
      },
      error: () => this.snack.open('Erro ao gerar link.', 'Fechar', { duration: 3000 }),
    });
  }

  toggleToken(tok: StaffToken): void {
    if (!this.selectedRestaurantId) return;
    this.comandaSvc.toggleStaffToken(this.selectedRestaurantId, tok.id, !tok.active).subscribe({
      next: (res) => this.staffTokens = this.staffTokens.map(t => t.id === res.data.id ? res.data : t),
      error: () => this.snack.open('Erro.', 'Fechar', { duration: 3000 }),
    });
  }

  deleteToken(tok: StaffToken): void {
    if (!this.selectedRestaurantId) return;
    if (!confirm(`Revogar link de ${tok.staff_name}?`)) return;
    this.comandaSvc.deleteStaffToken(this.selectedRestaurantId, tok.id).subscribe({
      next: () => { this.staffTokens = this.staffTokens.filter(t => t.id !== tok.id); this.snack.open('Link revogado.', 'OK', { duration: 2000 }); },
      error: () => this.snack.open('Erro.', 'Fechar', { duration: 3000 }),
    });
  }

  copyLink(tok: StaffToken): void {
    navigator.clipboard.writeText(this.waiterLink(tok));
    this.snack.open('Link copiado!', 'OK', { duration: 1500 });
  }

  formatCurrency(v: number): string {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v);
  }

  formatDate(s: string): string {
    return new Date(s).toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  }

  get multipleRestaurants(): boolean { return this.restaurants.length > 1; }
}
