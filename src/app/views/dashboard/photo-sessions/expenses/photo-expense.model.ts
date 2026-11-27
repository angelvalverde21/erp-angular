export interface PhotoExpenseTarget { kind: 'photographer' | 'model' | 'location' | 'task'; id: number; name: string; history?: boolean; }
export interface PhotoExpense {
  id: number; recipient_name: string; source_name: string;
  payment: { amount: number | string; comment: string; date: string; reference_code?: string; gateway?: { title?: string; name?: string }; images?: { url_large?: string }[] };
}
export interface PhotoExpenseContext {
  source: { kind: PhotoExpenseTarget['kind']; id: number; name: string; recipient_name: string | null };
  purchases: any[]; legacy_expenses: PhotoExpense[]; total_paid: number; total_purchases: number;
}
