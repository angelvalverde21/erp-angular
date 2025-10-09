import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'daily/:days',
    loadComponent: () => import('./report-daily-page/report-daily-page.component').then((m) => m.ReportDailyPageComponent),
    data: {
      title: 'Todos',
      name: 'report.daily', // 👈 nombre único
    }
  },
  {
    path: 'top',
    loadComponent: () => import('./report-top-products-page/report-top-products-page.component').then((m) => m.ReportTopProductsPageComponent),
    data: {
      title: 'Todos',
      name: 'report.products.top', // 👈 nombre único
    }
  },
];
