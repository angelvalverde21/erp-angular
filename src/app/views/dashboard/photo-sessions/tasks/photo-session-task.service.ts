import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BaseCrudDashboardService } from '../../base-crud-dashboard.service';
import { PhotoRecord } from '../photo-session.model';
import { PhotoTask, PhotoTaskEvent, PhotoTaskPage, PhotoTaskPlanning, PhotoTaskStatus } from './photo-session-task.model';

@Injectable({ providedIn: 'root' })
export class PhotoSessionTaskService extends BaseCrudDashboardService {
  constructor(http: HttpClient) { super(http, 'photo-session-tasks'); }
  list(params: Record<string, string>) { return this.http.get<PhotoTaskPage>(this.baseUrl, { params }); }
  createTask(sessionId: number, payload: PhotoTaskPlanning) { return this.http.post<PhotoRecord<PhotoTask>>(this.baseUrl, { ...payload, photo_session_id: sessionId }); }
  editTask(task: PhotoTask, payload: PhotoTaskPlanning) { return this.http.put<PhotoRecord<PhotoTask>>(`${this.baseUrl}/${task.id}`, { ...payload, version: task.version }); }
  changeStatus(task: PhotoTask, status: PhotoTaskStatus, note: string | null) { return this.http.put<PhotoRecord<PhotoTask>>(`${this.baseUrl}/${task.id}/status`, { status, note, version: task.version }); }
  events(id: number) { return this.http.get<PhotoRecord<PhotoTaskEvent[]>>(`${this.baseUrl}/${id}/events`); }
}
