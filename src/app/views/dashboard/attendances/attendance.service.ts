import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BaseCrudDashboardService } from '../base-crud-dashboard.service';


@Injectable({
  providedIn: 'root'
})

export class AttendanceService extends BaseCrudDashboardService {

  constructor(http: HttpClient) {

    super(http, 'attendances');

  }

  list(page: number, filters: Record<string, string>) {
    const params: Record<string, string | number> = { page };
    for (const [key, value] of Object.entries(filters)) {
      if (value) params[key] = value;
    }
    return this.http.get<any>(this.baseUrl, { params });
  }

  //la variable this.baseUrl esta dentro de BaseCrudService que se llama con super
  justify(values: { employee_id: number; date: string; reason: string }) {
    return this.http.post<any>(`${this.baseUrl}/justify`, values);
  }

  downloadJustification(attendanceId: number, documentId: number, variant: 'thumbnail' | 'medium' | 'large' = 'large') {
    return this.http.get(`${this.baseUrl}/${attendanceId}/justification-documents/${documentId}`, { responseType: 'blob', params: { variant } });
  }

}
