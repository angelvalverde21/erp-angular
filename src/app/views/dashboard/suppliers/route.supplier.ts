import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Proveedores',
    },
    children: [
      {
        path: '',
        loadComponent: () => import( '../suppliers/supplier-index-page/supplier-index-page.component' ).then((m) => m.SupplierIndexPageComponent),
        data: {
          title: 'Todos'
        }
      },
      {
        path: 'create',
        loadComponent: () => import('../suppliers/supplier-create-page/supplier-create-page.component').then(m => m.SupplierCreatePageComponent),
        data: {
          title: 'Crear Proveedor'
        }
      },
      {
        path: 'search/:search',
        loadComponent: () => import('../suppliers/supplier-search-page/supplier-search-page.component').then(m => m.SupplierSearchPageComponent),
        data: {
          title: 'Editar'
        }
      },
      {
        path: ':supplier_id', //Este debe estar al ultimo del objeto
        loadComponent: () => import('../suppliers/supplier-edit-page/supplier-edit-page.component').then(m => m.SupplierEditPageComponent),
        data: {
          title: 'Editar'
        }
      }

    ]
  },
];
