export interface PurchasePhotoSource {
  kind: 'photographer' | 'model' | 'location' | 'task';
  id: number;
  name: string;
  recipient_name?: string | null;
}
