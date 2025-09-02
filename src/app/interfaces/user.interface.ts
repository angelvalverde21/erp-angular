export interface User {

  email: string;
  name: string;
  phone: string;       // si puede tener ceros iniciales o símbolos
  document_id: string; // si es un documento tipo DNI/RUC
  username: string;
  password: string;
  
}