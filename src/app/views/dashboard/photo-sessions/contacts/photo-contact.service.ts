import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BaseCrudDashboardService } from '../../base-crud-dashboard.service';
import { PhotoPage, PhotoRecord } from '../photo-session.model';
import { PhotoContact, PhotoContactKind, PhotoContactPayload } from './photo-contact.model';

@Injectable({ providedIn: 'root' })
export class PhotoContactService extends BaseCrudDashboardService {
  constructor(http: HttpClient) { super(http, 'photo-sessions/contacts'); }
  list(kind: PhotoContactKind, params: Record<string, string>) { return this.http.get<PhotoPage<PhotoContact>>(this.baseUrl, { params: { ...params, kind } }); }
  show(id: number, kind: PhotoContactKind) { return this.http.get<PhotoRecord<PhotoContact>>(`${this.baseUrl}/${id}`, { params: { kind } }); }
  create(payload: PhotoContactPayload) { return this.http.post<PhotoRecord<PhotoContact>>(this.baseUrl, payload); }
  saveChanges(id: number, payload: PhotoContactPayload) { return this.http.put<PhotoRecord<PhotoContact>>(`${this.baseUrl}/${id}`, payload); }
}
