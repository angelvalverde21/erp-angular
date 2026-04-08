import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import( './inventory-index-page/inventory-index-page.component' ).then((m) => m.InventoryIndexPageComponent),
    data: {
      title: 'Todos',
    }
  },
  {
    path: 'create',
    loadComponent: () => import( './inventory-create-page/inventory-create-page.component' ).then((m) => m.InventoryCreatePageComponent),
    data: {
      title: 'Create',
    }
  },
  {
    path: 'out',
    loadComponent: () => import( './inventory-out-page/inventory-out-page.component' ).then((m) => m.InventoryOutPageComponent),
    data: {
      title: 'Create',
    }
  },
  // {
  //   path: ':product_id',
  //   loadComponent: () => import( './product-edit-page/product-edit-page.component' ).then((m) => m.ProductEditPageComponent),
  //   data: {
  //     title: 'Editar',
  //     name: 'dashboard.product.edit', // 👈 nombre único
  //   }
  // },
];
