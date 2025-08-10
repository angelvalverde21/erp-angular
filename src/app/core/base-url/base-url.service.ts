import { Injectable } from '@angular/core';
import { ROUTE_PATHS } from './base-paths.ts';
import { environment } from '../environments/environment.ts';


@Injectable({ providedIn: 'root' })
export class BaseUrlService {
  /** Array para routerLink */
  getPathArray(name: string, params: (string | number)[] = []): string[] {
    if (!ROUTE_PATHS[name]) {
      throw new Error(`Ruta "${name}" no está definida en ROUTE_PATHS`);
    }
    return [...ROUTE_PATHS[name], ...params.map(String)];
  }

  /** String para navegación directa */
  getPathString(name: string, params: (string | number)[] = []): string {
    const segments = this.getPathArray(name, params);
    const prefix = environment.showStoreNameInSlug
      ? `/${environment.storeName}`
      : '';
    return prefix + '/' + segments.join('/');
  }

  /** URL completa para API */
  getApiUrl(name: string, params: (string | number)[] = []): string {
    const path = this.getPathString(name, params);
    return `${environment.apiUrl}${path}`.replace(/([^:]\/)\/+/g, '$1');
  }
}
