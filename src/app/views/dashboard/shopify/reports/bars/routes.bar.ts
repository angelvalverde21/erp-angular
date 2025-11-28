import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'daily',
    loadComponent: () => import('./bar-daily-page/bar-daily-page.component').then((m) => m.BarDailyPageComponent),
    data: {
      title: 'Todos',
    }
  },
  {
    path: 'daily/:days',
    loadComponent: () => import('./bar-daily-page/bar-daily-page.component').then((m) => m.BarDailyPageComponent),
    data: {
      title: 'Todos',
    }
  },
];
