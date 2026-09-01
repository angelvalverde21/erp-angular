import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import( './batch-index-page/batch-index-page.component' ).then((m) => m.BatchIndexPageComponent),
    data: {
      title: 'Todos',
    }
  },
  {
    path: 'create',
    loadComponent: () => import( './batch-create-page/batch-create-page.component' ).then((m) => m.BatchCreatePageComponent),
    data: {
      title: 'Create',
    }
  },
  {
    path: ':batch_id',
    loadComponent: () => import( './batch-edit-page/batch-edit-page.component' ).then((m) => m.BatchEditPageComponent),
    data: {
      title: 'Editar',
      name: 'dashboard.batch.edit', // 👈 nombre único
    }
  },
];
