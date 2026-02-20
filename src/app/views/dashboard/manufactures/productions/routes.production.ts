import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import( './production-index-page/production-index-page.component' ).then((m) => m.ProductionIndexPageComponent),
    data: {
      title: 'Todos',
      name: 'dashboard.manufacture.index', // 👈 nombre único
    }
  },
  {
    path: 'create',
    loadComponent: () => import( './production-create-page/production-create-page.component' ).then((m) => m.ProductionCreatePageComponent),
    data: {
      title: 'Create',
      name: 'dashboard.manufacture.create', // 👈 nombre único
    }
  },
    {
    path: ':production_id/receptions',
    loadComponent: () => import( './production-reception-page/production-reception-page.component' ).then((m) => m.ProductionReceptionPageComponent),
    data: {
      title: 'Recepciones',
    }
  },
  {
    path: ':production_id',
    loadComponent: () => import( './production-edit-page/production-edit-page.component' ).then((m) => m.ProductionEditPageComponent),
    data: {
      title: 'Producciones',
      name: 'dashboard.manufacture.create', // 👈 nombre único
    }
  },

];
