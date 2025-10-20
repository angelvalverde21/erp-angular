import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Marcas',
    },
    children: [
      {
        path: '',
        loadComponent: () => import( './brand-index-page/brand-index-page.component' ).then((m) => m.BrandIndexPageComponent),
        data: {
          title: 'Todas'
        }
      },
      {
        path: 'slug/:slug',
        loadComponent: () => import( './brand-index-slug-page/brand-index-slug-page.component' ).then((m) => m.BrandIndexSlugPageComponent),
        data: {
          title: 'Todas'
        }
      },
      {
        path: 'create',
        loadComponent: () => import('./brand-create-page/brand-create-page.component').then(m => m.BrandCreatePageComponent),
        data: {
          title: 'Crear Marca'
        }
      },
      {
        path: ':brand_id',
        loadComponent: () => import('./brand-edit-page/brand-edit-page.component').then(m => m.BrandEditPageComponent),
        data: {
          title: 'Editar'
        }
      }
    ]
  },
];
