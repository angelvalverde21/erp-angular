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
        loadComponent: () => import( './generate-link/generate-link.component' ).then((m) => m.GenerateLinkComponent),
        data: {
          title: 'Todas'
        }
      },
    ]
  },
];
