import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { CurrencyPipe, DatePipe, DecimalPipe, DOCUMENT } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { BehaviorSubject, catchError, combineLatest, distinctUntilChanged, filter, interval, map, of, Subject, switchMap, takeUntil, tap } from 'rxjs';
import { ProductionProgressComponent } from './production-progress/production-progress.component';
import { BaseService } from '../../base.service';
import { AreaDashboardService } from './area-dashboard.service';
import { AreaReport, canViewDashboard, dashboardRoles, DashboardSection, DASHBOARDS } from './dashboard.model';
@Component({
  selector: 'app-area-dashboard', imports: [RouterLink, CurrencyPipe, DecimalPipe, DatePipe, ProductionProgressComponent],
  templateUrl: './area-dashboard.component.html', styleUrl: './area-dashboard.component.scss',
})
export class AreaDashboardComponent implements OnInit, OnDestroy {
  readonly periods = [7, 30, 90];
  readonly availableAreas = DASHBOARDS.filter(area => canViewDashboard(area.key, dashboardRoles()));
  readonly statusLabels: Record<string, string> = { registrado: 'Registrado', pago_recibido: 'Pago recibido', pago_confirmado: 'Pago confirmado', preparacion: 'En preparación', enviado: 'Enviado', cancelado: 'Cancelado', en_espera: 'En espera' };
  definition = DASHBOARDS[0];
  report: AreaReport | null = null;
  loading = false;
  error = '';
  private readonly days$ = new BehaviorSubject(30);
  private readonly refresh$ = new BehaviorSubject(0);
  private readonly destroy$ = new Subject<void>();
  constructor(private service: AreaDashboardService, private route: ActivatedRoute, public base: BaseService, @Inject(DOCUMENT) private document: Document) {}
  get days(): number { return this.days$.value; }
  ngOnInit(): void {
    combineLatest([
      this.route.paramMap.pipe(map(params => params.get('area')), distinctUntilChanged()),
      this.days$.pipe(distinctUntilChanged()), this.refresh$,
    ]).pipe(
      tap(([key, days]) => {
        this.definition = DASHBOARDS.find(area => area.key === key) ?? DASHBOARDS[0];
        if (this.report?.area !== key || this.report?.range.days !== days) this.report = null;
        this.loading = true; this.error = '';
      }),
      switchMap(([, days]) => this.service.report(this.definition.key, days).pipe(
        catchError(error => { this.error = error.status === 403 ? 'No tienes acceso a este dashboard.' : 'No se pudo cargar la información. Inténtalo nuevamente.'; return of(null); }),
      )),
      takeUntil(this.destroy$),
    ).subscribe(response => { this.loading = false; if (response?.data) this.report = response.data; });
    interval(60000).pipe(
      filter(() => this.definition.key === 'ceo' && !this.loading && this.document.visibilityState === 'visible'),
      takeUntil(this.destroy$),
    ).subscribe(() => this.refresh());
  }
  changePeriod(days: number): void { this.days$.next(days); }
  refresh(): void { this.refresh$.next(this.refresh$.value + 1); }
  link(path: string): (string | number)[] { return ['/', this.base.store ?? '', 'dashboard', ...path.split('/')]; }
  accent(key: string): string { return DASHBOARDS.find(area => area.key === key)?.accent ?? '#4565a5'; }
  icon(key: string): string { return DASHBOARDS.find(area => area.key === key)?.icon ?? 'fa-chart-line'; }
  barHeight(section: DashboardSection, value: number): number {
    const max = Math.max(...(section.trend ?? []).map(point => point.value), 1);
    return Math.max(value > 0 ? 3 : 0, value / max * 100);
  }
  ngOnDestroy(): void { this.destroy$.next(); this.destroy$.complete(); }
}
