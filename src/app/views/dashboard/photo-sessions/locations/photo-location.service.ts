import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BaseCrudDashboardService } from '../../base-crud-dashboard.service';
import { PhotoPage, PhotoRecord } from '../photo-session.model';
import { PhotoLocation, PhotoLocationPayload } from './photo-location.model';

@Injectable({ providedIn: 'root' })
export class PhotoLocationService extends BaseCrudDashboardService {
  constructor(http: HttpClient) { super(http, 'photo-sessions/locations'); }
  list(params: Record<string, string>) { return this.http.get<PhotoPage<PhotoLocation>>(this.baseUrl, { params }); }
  show(id: number) { return this.http.get<PhotoRecord<PhotoLocation>>(`${this.baseUrl}/${id}`); }
  create(payload: PhotoLocationPayload) { return this.http.post<PhotoRecord<PhotoLocation>>(this.baseUrl, payload); }
  saveChanges(id: number, payload: PhotoLocationPayload) { return this.http.put<PhotoRecord<PhotoLocation>>(`${this.baseUrl}/${id}`, payload); }
}
