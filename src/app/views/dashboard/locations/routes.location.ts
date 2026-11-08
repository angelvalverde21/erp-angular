import { inject } from '@angular/core';
import { Router, Routes } from '@angular/router';
import { BaseService } from '../../base.service';

export const routes: Routes = [
  {
    path: '**',
    redirectTo: () => inject(Router).createUrlTree(['/', inject(BaseService).store, 'dashboard', 'branches']),
  },
];
