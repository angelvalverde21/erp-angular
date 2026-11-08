export type DashboardArea = 'sales' | 'packing' | 'marketing' | 'ceo';
export const MANAGEMENT_ROLES = ['master', 'ceo', 'admin'];
export const DASHBOARDS = [
  { key: 'sales' as const, name: 'Ventas', icon: 'fa-chart-line', role: 'sales', description: 'Pedidos, importes y actividad comercial.', accent: '#4565a5', tint: '#eef2fb' },
  { key: 'packing' as const, name: 'Empaque', icon: 'fa-box-open', role: 'packing', description: 'Preparación, prioridades y salida de pedidos.', accent: '#208779', tint: '#eaf6f2' },
  { key: 'marketing' as const, name: 'Marketing', icon: 'fa-bullhorn', role: 'marketing', description: 'Catálogo y contenido para tus canales.', accent: '#8d60b2', tint: '#f4eef9' },
  { key: 'ceo' as const, name: 'CEO', icon: 'fa-chart-pie', role: 'ceo', description: 'Avance de producciones y reportes de Ventas, Empaque y Marketing.', accent: '#b38239', tint: '#fbf4e8' },
];
export function dashboardRoles(user?: any): string[] {
  try {
    const value = user ?? JSON.parse(localStorage.getItem('user') || '{}');
    return Array.isArray(value.roles) ? value.roles.map((role: any) => typeof role === 'string' ? role : role?.name).filter(Boolean) : [];
  } catch { return []; }
}
export function canViewDashboard(area: DashboardArea, roles: string[]): boolean {
  return roles.some(role => MANAGEMENT_ROLES.includes(role)) || (area !== 'ceo' && roles.includes(area));
}
export interface DashboardMetric { label: string; value: number | null; format: 'number' | 'money'; hint?: string; }
export interface DashboardSection {
  key: DashboardArea; title: string; description: string; available: boolean;
  metrics: DashboardMetric[]; trend?: { date: string; value: number }[]; trend_format?: 'money' | 'number';
  items_title: string; items: { id: number; title: string; subtitle: string; status: string | null; value: number | null; path: string }[];
  actions: { label: string; path: string }[]; note: string;
}
export interface AreaReport {
  area: DashboardArea; store: { id: number; name: string; slug: string };
  range: { days: number; from: string; to: string; timezone: string }; updated_at: string; sections: DashboardSection[];
  production_progress?: ProductionProgress;
}

export interface ProductionProgressItem {
  id: number;
  name: string;
  created_at: string;
  planned_units: number;
  received_units: number;
  completed_units: number;
  pending_units: number;
  extra_units: number;
  progress_percent: number | null;
  status: 'unplanned' | 'pending' | 'in_progress' | 'completed';
  needs_review: boolean;
  path: string;
}

export interface ProductionProgress {
  available: boolean;
  total_count?: number;
  active_count?: number;
  completed_count?: number;
  unplanned_count?: number;
  planned_units?: number;
  completed_units?: number;
  pending_units?: number;
  progress_percent?: number | null;
  visible_count?: number;
  items: ProductionProgressItem[];
  note: string;
}
