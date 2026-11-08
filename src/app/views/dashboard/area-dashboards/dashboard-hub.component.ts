import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BaseService } from '../../base.service';
import { canViewDashboard, dashboardRoles, DASHBOARDS } from './dashboard.model';
@Component({
  selector: 'app-dashboard-hub', imports: [RouterLink],
  template: `
    <main class="dash-page">
      <header class="dash-hero"><div><span class="dash-eyebrow">ESPACIO DE TRABAJO</span><h1>Dashboards</h1><p>La información de cada área, en un solo lugar.</p></div><span class="dash-store"><i class="fa-solid fa-store" aria-hidden="true"></i>{{ storeName }}</span></header>
      <div class="dash-hub-intro"><h2>Elige tu dashboard</h2><p>Accede a los indicadores y las prioridades de tu equipo.</p></div>
      <div class="dash-hub-grid">
        @for (area of areas; track area.key) {
          <a class="dash-area-card" [routerLink]="['./', area.key]" [style.--area-accent]="area.accent" [style.--area-tint]="area.tint"><span class="dash-area-icon"><i class="fa-solid" [class]="area.icon" aria-hidden="true"></i></span><h2>{{ area.name }}</h2><p>{{ area.description }}</p><span class="dash-area-open">Abrir dashboard<i class="fa-solid fa-arrow-right" aria-hidden="true"></i></span></a>
        } @empty { <div class="dash-empty"><strong>No tienes dashboards asignados</strong><p>Solicita un rol de Ventas, Empaque, Marketing o dirección.</p></div> }
      </div>
      @if (management) { <aside class="dash-hub-note"><i class="fa-solid fa-chart-pie" aria-hidden="true"></i><div><strong>Una vista completa para dirección</strong><p>El dashboard CEO reúne los reportes de las tres áreas con el mismo periodo de consulta.</p></div></aside> }
    </main>`,
  styleUrl: './area-dashboard.component.scss',
})
export class DashboardHubComponent {
  readonly roles = dashboardRoles();
  readonly areas = DASHBOARDS.filter(area => canViewDashboard(area.key, this.roles));
  readonly management = canViewDashboard('ceo', this.roles);
  constructor(private base: BaseService) {}
  get storeName(): string {
    try { return JSON.parse(localStorage.getItem('store') || '{}').name || this.base.storeName || 'Mi tienda'; }
    catch { return this.base.storeName || 'Mi tienda'; }
  }
}