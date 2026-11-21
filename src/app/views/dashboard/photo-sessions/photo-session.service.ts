import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BaseCrudDashboardService } from '../base-crud-dashboard.service';
import { PhotoAsset, PhotoPage, PhotoRecord, PhotoSession, PhotoSessionOptions, PhotoSessionPayload, PhotoUploadPlan } from './photo-session.model';

@Injectable({ providedIn: 'root' })
export class PhotoSessionService extends BaseCrudDashboardService {
  constructor(http: HttpClient) { super(http, 'photo-sessions'); }
  list(params: Record<string, string>) { return this.http.get<PhotoPage<PhotoSession>>(this.baseUrl, { params }); }
  options() { return this.http.get<PhotoRecord<PhotoSessionOptions>>(`${this.baseUrl}/options`); }
  show(id: number) { return this.http.get<PhotoRecord<PhotoSession>>(`${this.baseUrl}/${id}`); }
  create(payload: PhotoSessionPayload) { return this.http.post<PhotoRecord<PhotoSession>>(this.baseUrl, payload); }
  saveChanges(id: number, payload: PhotoSessionPayload) { return this.http.put<PhotoRecord<PhotoSession>>(`${this.baseUrl}/${id}`, payload); }
  assignments(id: number, kind: 'photographer' | 'model' | 'location', ids: number[], mode: 'attach' | 'detach') { return this.http.put<PhotoRecord<PhotoSession>>(`${this.baseUrl}/${id}/assignments`, { kind, ids, mode }); }
  assets(id: number, params: Record<string, string>) { return this.http.get<PhotoPage<PhotoAsset>>(`${this.baseUrl}/${id}/assets`, { params }); }
  beginUpload(id: number, file: File, category: string) { return this.http.post<PhotoRecord<PhotoUploadPlan>>(`${this.baseUrl}/${id}/assets`, { name: file.name, bytes: file.size, category }); }
  part(id: number, asset: string, part: number) { return this.http.get<PhotoRecord<{ url: string; headers?: Record<string, string> }>>(`${this.assetUrl(id, asset)}/parts/${part}`); }
  complete(id: number, asset: string) { return this.http.post<PhotoRecord<PhotoAsset>>(`${this.assetUrl(id, asset)}/complete`, {}); }
  abort(id: number, asset: string) { return this.http.post(`${this.assetUrl(id, asset)}/abort`, {}); }
  preview(id: number, asset: string, size: string, bytes: number) { return this.http.post<PhotoRecord<{ url: string }>>(`${this.assetUrl(id, asset)}/previews`, { size, bytes }); }
  previewBatch(id: number, asset: string, previews: { size: string; bytes: number }[]) { return this.http.post<PhotoRecord<{ uploads: { size: string; url: string }[] }>>(`${this.assetUrl(id, asset)}/previews/batch`, { previews }); }
  confirmPreviews(id: number, asset: string) { return this.http.post<PhotoRecord<PhotoAsset>>(`${this.assetUrl(id, asset)}/previews/complete`, {}); }
  updateAsset(id: number, asset: string, payload: Partial<Pick<PhotoAsset, 'selected' | 'category' | 'caption'>>) { return this.http.put<PhotoRecord<PhotoAsset>>(this.assetUrl(id, asset), payload); }
  download(id: number, asset: string) { return this.http.get<PhotoRecord<{ url: string }>>(`${this.assetUrl(id, asset)}/download`); }
  private assetUrl(id: number, asset: string): string { return `${this.baseUrl}/${id}/assets/${asset}`; }
}
