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
    },
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./employee-edit-page/employee-edit/employee-edit.component').then(m => m.EmployeeEditComponent),
        data: { title: 'Informacion de colaborador' }
      },
      {
        path: 'attendances',
        loadComponent: () =>
          import('./employee-edit-page/employee-attendance-index/employee-attendance-index.component').then(m => m.EmployeeAttendanceIndexComponent),
        data: { title: 'Informacion de colaborador' }
      },
      {
        path: 'schedules',
        loadComponent: () =>
          import('./employee-edit-page/employee-schedule-index/employee-schedule-index.component').then(m => m.EmployeeScheduleIndexComponent),
        data: { title: 'Horarios de colaborador' }
      },
      {
        path: 'salaries',
        loadComponent: () =>
          import('./employee-edit-page/employee-salary-index/employee-salary-index.component').then(m => m.EmployeeSalaryIndexComponent),
        data: { title: 'Informacion de colaborador' }
      },
      {
        path: 'payments',
        loadComponent: () =>
          import('./employee-edit-page/employe-payment-index/employe-payment-index.component').then(m => m.EmployePaymentIndexComponent),
        data: { title: 'Informacion de colaborador' }
      },

    ]
  },


];
