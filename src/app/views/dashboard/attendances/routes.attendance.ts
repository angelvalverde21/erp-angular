import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./attendance-index-page/attendance-index-page.component').then((m) => m.AttendanceIndexPageComponent),
    data: {
      title: 'Todos',
    }
  },
  {
    path: 'upload',
    loadComponent: () => import('./attendance-upload-page/attendance-upload-page.component').then((m) => m.AttendanceUploadPageComponent),
    data: {
      title: 'Subir Archivo'
    }
  }


];
