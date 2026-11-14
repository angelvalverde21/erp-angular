export interface PayrollAmounts { base: number; discounts: number; extras: number; net: number; }
export type EmployeePayrollSummary = { available: false; items: [] } | {
  available: true;
  start_date: string; end_date: string; computed_through: string; is_provisional: boolean;
  employee_count: number; calculated_count: number; pending_count: number;
  totals: PayrollAmounts; total_net: number | null;
  items: { id: number; name: string; payroll_uses_attendance: boolean; amounts: PayrollAmounts | null; pending_reason: string | null }[];
};
