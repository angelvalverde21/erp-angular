import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Compras',
    },
    children: [
      {
        path: '',
        loadComponent: () => import('./petty-cash-index-page/petty-cash-index-page.component').then((m) => m.PettyCashIndexPageComponent),
        data: {
          title: 'Todos'
        }
      },
      {
        path: 'create',
        loadComponent: () => import('./petty-cash-create-page/petty-cash-create-page.component').then(m => m.PettyCashCreatePageComponent),
        data: {
          title: 'Crear Flujo de caja'
        }
      },

      {
        path: ':petty_cash_id',
        loadComponent: () => import('./petty-cash-edit-page/petty-cash-edit-page.component').then(m => m.PettyCashEditPageComponent),
        data: {
          title: 'Editar'
        }
      }
    ]
  },
];
