import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Categorias',
    },
    children: [
      {
        path: '',
        loadComponent: () => import( './category-index-page/category-index-page.component' ).then((m) => m.CategoryIndexPageComponent),
        data: {
          title: 'Todas'
        }
      },
      {
        path: 'slug/:slug',
        loadComponent: () => import( './category-index-slug-page/category-index-slug-page.component' ).then((m) => m.CategoryIndexSlugPageComponent),
        data: {
          title: 'Todas'
        }
      },
      {
        path: 'create',
        loadComponent: () => import('./category-create-page/category-create-page.component').then(m => m.CategoryCreatePageComponent),
        data: {
          title: 'Crear Categoria'
        }
      },
      {
        path: ':category_id',
        loadComponent: () => import('./category-edit-page/category-edit-page.component').then(m => m.CategoryEditPageComponent),
        data: {
          title: 'Editar'
        }
      }
    ]
  },
];
