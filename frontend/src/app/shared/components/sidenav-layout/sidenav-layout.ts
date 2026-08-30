import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { MatSidenavModule, MatSidenav } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatMenuModule } from '@angular/material/menu';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { AuthService } from '../../../core/services/auth';

interface NavItem {
  label: string;
  icon: string;
  route: string;
}

@Component({
  selector: 'app-sidenav-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatSidenavModule,
    MatToolbarModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    MatDividerModule,
    MatMenuModule,
  ],
  templateUrl: './sidenav-layout.html',
  styleUrl: './sidenav-layout.scss',
})
export class SidenavLayoutComponent implements OnInit {
  private auth = inject(AuthService);
  private router = inject(Router);
  private bp = inject(BreakpointObserver);

  @ViewChild('sidenav') sidenav!: MatSidenav;

  currentUser = this.auth.getCurrentUser();
  isAdmin = this.auth.isAdmin();
  isMobile = false;

  adminNav: NavItem[] = [
    { label: 'Dashboard', icon: 'dashboard', route: '/admin/dashboard' },
    { label: 'Restaurantes', icon: 'store', route: '/admin/restaurantes' },
    { label: 'Filas', icon: 'queue', route: '/admin/filas' },
    { label: 'Categorias', icon: 'category', route: '/admin/categorias' },
    { label: 'Chamados', icon: 'bug_report', route: '/admin/chamados' },
  ];

  managerNav: NavItem[] = [
    { label: 'Dashboard', icon: 'dashboard', route: '/gerente/dashboard' },
    { label: 'Meus Restaurantes', icon: 'store', route: '/gerente/restaurantes' },
    { label: 'Chamados', icon: 'support_agent', route: '/gerente/chamados' },
  ];

  get navItems(): NavItem[] {
    return this.isAdmin ? this.adminNav : this.managerNav;
  }

  get userInitials(): string {
    if (!this.currentUser) return '?';
    return `${this.currentUser.first_name[0]}${this.currentUser.last_name[0]}`.toUpperCase();
  }

  get userRole(): string {
    return this.isAdmin ? 'Administrador' : 'Gerente';
  }

  ngOnInit(): void {
    this.bp.observe([Breakpoints.Handset]).subscribe(result => {
      this.isMobile = result.matches;
    });
  }

  toggleSidenav(): void {
    this.sidenav.toggle();
  }

  closeSidenavIfMobile(): void {
    if (this.isMobile) this.sidenav.close();
  }

  logout(): void {
    this.auth.logout();
  }
}
