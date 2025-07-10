import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Productos',
    },
    children: [
      {
        path: '',
        loadComponent: () =>
            import(
              './product-index-page/product-index-page.component'
            ).then((m) => m.ProductIndexPageComponent),
        data: {
          title: 'Listado'
        }
      },
      {
        path: 'create',
        loadComponent: () => import('./product-create-page/product-create-page.component').then(m => m.ProductCreatePageComponent),
        data: {
          title: 'Crear'
        }
      },

      {
        path: 'search/:search',
        loadComponent: () => import('./product-search-page/product-search-page.component').then(m => m.ProductSearchPageComponent),
        data: {
          title: 'Search'
        }
      },

      {
        path: ':product_id',
        loadComponent: () => import('./product-edit-page/product-edit-page.component').then(m => m.ProductEditPageComponent),
        data: {
          title: 'Editar'
        }
      }
    ]
  },
];
