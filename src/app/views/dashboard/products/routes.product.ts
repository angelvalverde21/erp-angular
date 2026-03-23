import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import( './product-index-page/product-index-page.component' ).then((m) => m.ProductIndexPageComponent),
    data: {
      title: 'Todos',
      name: 'dashboard.product.index', // 👈 nombre único
    }
  },
  {
    path: 'create',
    loadComponent: () => import( './product-create-page/product-create-page.component' ).then((m) => m.ProductCreatePageComponent),
    data: {
      title: 'Create',
      name: 'dashboard.product.create', // 👈 nombre único
    }
  },
  {
    path: 'search',
    loadComponent: () => import( './product-search-page/product-search-page.component' ).then((m) => m.ProductSearchPageComponent),
    data: {
      title: 'Search',
      name: 'dashboard.product.search', // 👈 nombre único
    }
  },
  {
    path: ':product_id',
    loadComponent: () => import( './product-edit-page/product-edit-page.component' ).then((m) => m.ProductEditPageComponent),
    data: {
      title: 'Editar',
      name: 'dashboard.product.edit', // 👈 nombre único
    }
  },
];
