import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: ':branch_id/edit', loadComponent: () => import('./branch-edit-page/branch-edit-page.component').then(m => m.BranchEditPageComponent), data: { title: 'Editar sucursal' } },
  { path: ':branch_id/warehouses/:warehouse_id/edit', loadComponent: () => import('../warehouses/warehouse-edit-page/warehouse-edit-page.component').then(m => m.WarehouseEditPageComponent), data: { title: 'Editar almacén' } },
  { path: ':branch_id/warehouses/:warehouse_id/locations/:location_id/edit', loadComponent: () => import('../locations/location-edit-page/location-edit-page.component').then(m => m.LocationEditPageComponent), data: { title: 'Editar ubicación' } },
  { path: '', loadComponent: () => import('./branch-index-page/branch-index-page.component').then(m => m.BranchIndexPageComponent), data: { title: 'Sucursales' } },
  { path: 'create', loadComponent: () => import('./branch-create-page/branch-create-page.component').then(m => m.BranchCreatePageComponent), data: { title: 'Agregar sucursal' } },
  { path: ':branch_id/warehouses', loadComponent: () => import('../warehouses/warehouse-index-page/warehouse-index-page.component').then(m => m.WarehouseIndexPageComponent), data: { title: 'Almacenes' } },
  { path: ':branch_id/warehouses/create', loadComponent: () => import('../warehouses/warehouse-create-page/warehouse-create-page.component').then(m => m.WarehouseCreatePageComponent), data: { title: 'Agregar almacén' } },
  { path: ':branch_id/warehouses/:warehouse_id/locations', loadComponent: () => import('../locations/location-index-page/location-index-page.component').then(m => m.LocationIndexPageComponent), data: { title: 'Ubicaciones' } },
  { path: ':branch_id/warehouses/:warehouse_id/locations/create', loadComponent: () => import('../locations/location-create-page/location-create-page.component').then(m => m.LocationCreatePageComponent), data: { title: 'Agregar ubicación' } },
];
