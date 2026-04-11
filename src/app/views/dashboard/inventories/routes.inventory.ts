import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import( './inventory-income-index-page/inventory-income-index-page.component' ).then((m) => m.InventoryIncomeIndexPageComponent),
    data: {
      title: 'Todos',
    }
  },
  // {
  //   path: 'create',
  //   loadComponent: () => import( './inventory-create-page/inventory-create-page.component' ).then((m) => m.InventoryCreatePageComponent),
  //   data: {
  //     title: 'Create',
  //   }
  // },
  {
    path: 'out',
    loadComponent: () => import( './inventory-out-index-page/inventory-out-index-page.component' ).then((m) => m.InventoryOutIndexPageComponent),
    data: {
      title: 'Create',
    }
  },
  {
    path: ':inventory_id',
    loadComponent: () => import( './inventory-edit-page/inventory-edit-page.component' ).then((m) => m.InventoryEditPageComponent),
    data: {
      title: 'Editar',
      name: 'dashboard.product.edit', // 👈 nombre único
    }
  },
];
