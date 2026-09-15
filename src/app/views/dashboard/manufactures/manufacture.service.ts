import { Injectable, signal } from '@angular/core';

import { HttpClient } from '@angular/common/http';

// import { BaseCrudService } from '../base-crud.service';

import { BaseCrudDashboardService } from '../base-crud-dashboard.service';

@Injectable({
  providedIn: 'root',
})

export class ManufactureService extends BaseCrudDashboardService {

  constructor(http: HttpClient) {

    super(http, 'manufactures');
  }


  // base_path(path: string[] = []){
  //   return ['inventories','manufactures',...path];
  // }


  // estado reactivo
  summaryEvent = signal<any>(null);
  manufactureSingnalEvent = signal<any>(null);

  setSummary(data: any) {
    this.summaryEvent.set(data);
  }

  setManufacture(data: any) {
    console.log(data);

    this.manufactureSingnalEvent.set(data);
  }

  pdf(manufacture_id: number) {

    const url = `${this.baseUrl}/${manufacture_id}/variants/pdf/report`;
    console.log(url);

    return this.http.get(url, {
      responseType: 'blob', // Importante para descargar el archivo como blob
    });

  }

}

