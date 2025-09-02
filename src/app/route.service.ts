import { Injectable } from '@angular/core';
import { Routes } from '@angular/router';
import { StoreService } from './core/services/store.service';

@Injectable({ providedIn: 'root' })
export class RouteService {
  private nameMap = new Map<string, string[]>();

  constructor(private storeService: StoreService) {}

init(routes: Routes, parent: string[] = []) {
  for (const route of routes) {
    const fullPath = [...parent, route.path ?? ''];
    const name = route.data?.['name'];

    if (name) {

      console.log('Registrando ruta:', name, '->', fullPath);
      
      // Guardar con nombre completo
      this.nameMap.set(name, fullPath);

      // Generar alias corto (últimos 2 segmentos)
      const parts = name.split('.');

      if (parts.length >= 2) {
        const short = parts.slice(-2).join('.');
        this.nameMap.set(short, fullPath);
      }

      // Alias aún más corto (último segmento)
      const single = parts.at(-1)!;
      this.nameMap.set(single, fullPath);
    }

    if (route.children) {
      this.init(route.children, fullPath);
    }
  }
}

  route(name: string, params: Record<string, any> = {}): string[] {
    const path = this.nameMap.get(name);
    if (!path) {
      throw new Error(`Route ${name} not found`);
    }

    const store = this.storeService.name(); // 👈 aquí inyectamos :store automáticamente
    return [store, ...path.map((segment) => {
      if (segment.startsWith(':')) {
        const key = segment.substring(1);
        return params[key];
      }
      return segment;
    })];
  }
}
