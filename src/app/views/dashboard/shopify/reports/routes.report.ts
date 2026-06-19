import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'bars',
    loadChildren: () =>
      import('./bars/routes.bar').then(
        (m) => m.routes
      ),
  },
  {
    path: 'top',
    loadComponent: () => import('./report-top-products-page/report-top-products-page.component').then((m) => m.ReportTopProductsPageComponent),
    data: {
      title: 'Todos',
      name: 'report.products.top', // 👈 nombre único
    }
  },
  {
    path: 'sales',
    loadComponent: () => import('./report-sales-page/report-sales-page.component').then((m) => m.ReportSalesPageComponent),
    data: {
      title: 'Todos',
      name: 'report.products.top', // 👈 nombre único
    }
  },
  {
    path: 'all',
    loadComponent: () => import('./report-month-all/report-month-all.component').then((m) => m.ReportMonthAllComponent),
    data: {
      title: 'Todos',
      name: 'report.orders.all', // 👈 nombre único
    }
  },
];
