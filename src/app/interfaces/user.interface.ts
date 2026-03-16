export interface User {

  email: string;
  name: string;
  phone: string;  // si puede tener ceros iniciales o símbolos
  identity_id: number;
  document_number: string; // si es un documento tipo DNI/RUC
  username: string;
  created_at?: string;
  updated_at?: string;

}