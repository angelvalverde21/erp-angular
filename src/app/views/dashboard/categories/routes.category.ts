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
        loadComponent: () => import( '../categories/category-index-page/category-index-page.component' ).then((m) => m.CategoryIndexPageComponent),
        data: {
          title: 'Todas'
        }
      },
      {
        path: 'create',
        loadComponent: () => import('../categories/category-create-page/category-create-page.component').then(m => m.CategoryCreatePageComponent),
        data: {
          title: 'Crear Categoria'
        }
      }
    ]
  },
];
