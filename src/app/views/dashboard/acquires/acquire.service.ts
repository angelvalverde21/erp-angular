import { Injectable, signal } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { BaseCrudDashboardService } from '../base-crud-dashboard.service';

// import { BaseCrudService } from '../base-crud.service';

@Injectable({
  providedIn: 'root',
})
export class AcquireService extends BaseCrudDashboardService {
  constructor(http: HttpClient) {
    super(http, 'acquires');
  }

  // estado reactivo
  summaryEvent = signal<any>(null);
  acquireSingnalEvent = signal<any>(null);

  setSummary(data: any) {
    this.summaryEvent.set(data);
  }
  // base_path(path: string[] = []){
  //   return ['inventories','manufactures',...path];
  // }

  setAcquire(data: any) {
    console.log(data);

    this.acquireSingnalEvent.set(data);
  }
}
