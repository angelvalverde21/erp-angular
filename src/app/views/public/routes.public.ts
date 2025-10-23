import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        loadComponent: () => import('./home/home.component').then(m => m.HomeComponent),
        data: {
          title: `Home`
        }
    },
    {
        path: 'tracking',
        loadComponent: () => import('./tracking/tracking.component').then(m => m.TrackingComponent),
        data: {
          title: `tracking`
        }
    },
];
