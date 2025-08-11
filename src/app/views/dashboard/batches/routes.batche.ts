import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Produccion',
    },
    children: [
      {
        path: '',
        loadComponent: () => import( './batche-index-page/batche-index-page.component' ).then((m) => m.BatcheIndexPageComponent),
        data: {
          title: 'Todos'
        }
      },
      {
        path: 'create',
        loadComponent: () => import('./batche-create-page/batche-create-page.component').then(m => m.BatcheCreatePageComponent),
        data: {
          title: 'Crear Produccion'
        }
      },
      {
        path: ':batche_id',
        loadComponent: () => import('./batche-edit-page/batche-edit-page.component').then(m => m.BatcheEditPageComponent),
        data: {
          title: 'Editar'
        }
      }
    ]
  },
];
