import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./supplier-index-page/supplier-index-page.component').then((m) => m.SupplierIndexPageComponent),
    data: {
      title: 'Todos',
      name: 'dashboard.suppliers.index',
    }
  },
  {
    path: 'create',
    loadComponent: () => import('./supplier-create-page/supplier-create-page.component').then((m) => m.SupplierCreatePageComponent),
    data: {
      title: 'Crear',
      name: 'dashboard.suppliers.create',
    }
  },
  {
    path: ':supplier_id',
    loadComponent: () => import('./supplier-edit-page/supplier-edit-page.component').then((m) => m.SupplierEditPageComponent),
    data: {
      title: 'Editar',
      name: 'dashboard.suppliers.edit',
    }
  },
];
