import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Generar Link de pago',
    },
    children: [
      {
        path: 'generate-link',
        loadComponent: () => import( './mp-pago-link-create-page/mp-pago-link-create-page.component' ).then((m) => m.MpPagoLinkCreatePageComponent),
        data: {
          title: 'Todas'
        }
      },
      {
        path: 'transactions',
        loadComponent: () => import( './mp-transaction-index-page/mp-transaction-index-page.component' ).then((m) => m.MpTransactionIndexPageComponent),
        data: {
          title: 'Todas'
        }
      },
    ]
  },
];
