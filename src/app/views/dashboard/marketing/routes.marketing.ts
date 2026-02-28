import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'tiktok',
    loadComponent: () => import('./tiktok/tiktok-index-page/tiktok-index-page.component').then((m) => m.TiktokIndexPageComponent),
    data: {
      title: 'Todos'
    }
  },
  {
    path: 'instagram',
    loadComponent: () => import('./instagram/instagram-index-page/instagram-index-page.component').then((m) => m.InstagramIndexPageComponent),
    data: {
      title: 'Todos'
    }
  },
  {
    path: 'facebook',
    loadComponent: () => import('./facebook/facebook-index-page/facebook-index-page.component').then((m) => m.FacebookIndexPageComponent),
    data: {
      title: 'Todos'
    }
  }


];
