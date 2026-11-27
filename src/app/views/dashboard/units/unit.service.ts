import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { finalize, Observable, shareReplay } from 'rxjs';

export interface UnitOption { id: number; name: string; abbreviation?: string | null; }

import { BaseCrudDashboardService } from '../base-crud-dashboard.service';

@Injectable({
  providedIn: 'root'
})
export class UnitService extends BaseCrudDashboardService {
  private readonly pendingOptions = new Map<string, Observable<{ data: UnitOption[] }>>();

  options(): Observable<{ data: UnitOption[] }> {
    const url = this.baseUrl;
    const pending = this.pendingOptions.get(url);
    if (pending) return pending;
    const request = this.http.get<{ data: UnitOption[] }>(url).pipe(
      finalize(() => this.pendingOptions.delete(url)),
      shareReplay({ bufferSize: 1, refCount: false }),
    );
    this.pendingOptions.set(url, request);
    return request;
  }


  constructor(http: HttpClient) {

    super(http, 'units'); //units es la url que se le pasa a la base service

  }

  //la variable this.baseUrl esta dentro de BaseCrudService que se llama con super

}
