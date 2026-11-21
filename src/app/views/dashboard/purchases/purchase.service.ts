import type { StageAttachment } from '@shared/components/attachments/record-attachments.component';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BaseCrudDashboardService } from '../base-crud-dashboard.service';


@Injectable({
  providedIn: 'root'
})

export class PurchaseService extends BaseCrudDashboardService {

  constructor(http: HttpClient) {

    super(http, 'purchases');

  }

  attachments(id: number) { return this.http.get<{ data: StageAttachment[] }>(`${this.baseUrl}/${id}/attachments`); }
  uploadAttachment(id: number, file: File) {
    const body = new FormData(); body.append('file', file);
    return this.http.post<{ data: StageAttachment }>(`${this.baseUrl}/${id}/attachments`, body);
  }
  downloadAttachment(id: number, fileId: number) { return this.http.get(`${this.baseUrl}/${id}/attachments/${fileId}`, { responseType: 'blob' }); }
  previewAttachment(id: number, fileId: number) { return this.http.get(`${this.baseUrl}/${id}/attachments/${fileId}/preview`, { responseType: 'blob' }); }

  //la variable this.baseUrl esta dentro de BaseCrudService que se llama con super

}