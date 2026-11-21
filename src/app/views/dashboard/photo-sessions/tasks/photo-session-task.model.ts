export type PhotoTaskStatus = 'pending' | 'in_progress' | 'blocked' | 'completed';
export interface PhotoTaskPlanning { title: string; description: string | null; assigned_to: number; due_date: string | null; }
export interface PhotoTask {
  id: number; photo_session_id: number; title: string; description: string | null; assigned_to: number | null;
  assignee: { id: number; name: string } | null; session: { id: number; name: string; shoot_date: string | null };
  due_date: string | null; status: PhotoTaskStatus; last_note: string | null; completed_at: string | null;
  version: number; overdue: boolean; can_update: boolean;
}
export interface PhotoTaskSummary { total: number; pending: number; in_progress: number; blocked: number; completed: number; overdue: number; }
export interface PhotoTaskSummaryState { loading: boolean; error: string; }
export interface PhotoTaskPage {
  session?: { id: number; name: string; shoot_date: string | null };
  data: PhotoTask[]; total: number; current_page: number; last_page: number; can_manage: boolean;
  summary: PhotoTaskSummary; assignees: { id: number; name: string }[];
}
export interface PhotoTaskEvent {
  id: number; type: 'created' | 'updated' | 'status_changed'; actor: { id: number; name: string } | null; created_at: string;
  note: string | null; changes: { before?: Record<string, unknown>; after?: Record<string, unknown> };
}
export const PHOTO_TASK_STATUSES: { value: PhotoTaskStatus; label: string; icon: string }[] = [
  { value: 'pending', label: 'Pendiente', icon: 'fa-regular fa-clock' },
  { value: 'in_progress', label: 'En curso', icon: 'fa-solid fa-spinner' },
  { value: 'blocked', label: 'Bloqueada', icon: 'fa-solid fa-triangle-exclamation' },
  { value: 'completed', label: 'Completada', icon: 'fa-solid fa-check' },
];
export const EMPTY_TASK_SUMMARY: PhotoTaskSummary = { total: 0, pending: 0, in_progress: 0, blocked: 0, completed: 0, overdue: 0 };
