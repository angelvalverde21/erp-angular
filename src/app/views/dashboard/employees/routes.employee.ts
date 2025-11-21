import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./employee-index-page/employee-index-page.component').then((m) => m.EmployeeIndexPageComponent),
    data: {
      title: 'Todos',
      name: 'dashboard.user.index', // 👈 nombre único
    }
  },
  {
    path: 'create',
    loadComponent: () => import('./employee-create-page/employee-create-page.component').then((m) => m.EmployeeCreatePageComponent),
    data: {
      title: 'Create',
      name: 'dashboard.user.create', // 👈 nombre único
    }
  },
  {
    path: ':employee_id',
    loadComponent: () => import('./employee-edit-page/employee-edit-page.component').then((m) => m.EmployeeEditPageComponent),
    data: {
      title: 'Editar',
      name: 'dashboard.user.edit', // 👈 nombre único
    }
  },
];
