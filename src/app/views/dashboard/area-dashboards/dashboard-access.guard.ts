import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { BaseService } from '../../base.service';
import { canViewDashboard, dashboardRoles, DASHBOARDS } from './dashboard.model';
export const dashboardAccessGuard: CanActivateFn = route => {
  const base = inject(BaseService);
  const router = inject(Router);
  const area = DASHBOARDS.find(item => item.key === route.paramMap.get('area'));
  return area && canViewDashboard(area.key, dashboardRoles()) ? true
    : router.createUrlTree(['/', base.store ?? '', 'dashboard', 'panels']);
};