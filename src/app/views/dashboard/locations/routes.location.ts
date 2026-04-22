import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import( './location-index-page/location-index-page.component' ).then((m) => m.LocationIndexPageComponent),
    data: {
      title: 'Todos',
    }
  },
  {
    path: 'create',
    loadComponent: () => import( './location-create-page/location-create-page.component' ).then((m) => m.LocationCreatePageComponent),
    data: {
      title: 'Create',
    }
  },
  {
    path: 'location_:id',
    loadComponent: () => import( './location-edit-page/location-edit-page.component' ).then((m) => m.LocationEditPageComponent),
    data: {
      title: 'Create',
    }
  },
];
