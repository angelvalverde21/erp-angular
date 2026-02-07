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
        loadComponent: () => import('./gateway-index-page/gateway-index-page.component').then((m) => m.GatewayIndexPageComponent),
        data: {
          title: 'Todos'
        }
      },
      {
        path: 'create',
        loadComponent: () => import('./gateway-create-page/gateway-create-page.component').then(m => m.GatewayCreatePageComponent),
        data: {
          title: 'Crear Gateway'
        }
      },

      {
        path: ':gateway_id',
        loadComponent: () => import('./gateway-edit-page/gateway-edit-page.component').then(m => m.GatewayEditPageComponent),
        data: {
          title: 'Editar Gateway'
        }
      }
    ]
  },
];
