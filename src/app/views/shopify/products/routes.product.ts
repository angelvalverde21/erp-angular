import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'products',
    data: {
      title: 'Productos',
      name: 'inventories.product',
    },
    children: [
      {
        path: '',
        loadComponent: () => import( './product-index-page/product-index-page.component' ).then((m) => m.ProductIndexPageComponent),
        data: {
          title: 'Todos',
          name: 'inventories.product.index', // 👈 nombre único
        }
      },
      {
        path: 'create',
        loadComponent: () => import('./product-create-page/product-create-page.component').then(m => m.ProductCreatePageComponent),
        data: {
          title: 'Crear',
          name: 'inventories.product.create',
        }
      },

      {
        path: 'search/:search',
        loadComponent: () => import('./product-search-page/product-search-page.component').then(m => m.ProductSearchPageComponent),
        data: {
          title: 'Buscar',
          name: 'inventories.product.search',
        }
      },

      {
        path: ':product_id',
        loadComponent: () => import('./product-edit-page/product-edit-page.component').then(m => m.ProductEditPageComponent),
        data: {
          title: 'Editar',
          name: 'inventories.product.edit',
        }
      }
    ]
  },
];
