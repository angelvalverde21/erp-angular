import { INavData } from "@coreui/angular";

export interface CustomNavData extends INavData {
  roles?: string[];  // 👈 nueva propiedad
  open?: boolean;
}