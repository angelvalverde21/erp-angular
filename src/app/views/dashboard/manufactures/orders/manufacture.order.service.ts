// import { Injectable } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
// import { BaseCrudDashboardService } from '../../base-crud-dashboard.service';

// // import { BaseCrudService } from '../base-crud.service';


// @Injectable({
//   providedIn: 'root',
// })


// export class ManufactureOrderService extends BaseCrudDashboardService {


//   section_id: number | string | null = null;

//   constructor(http: HttpClient) {
//     super(http, 'manufactures'); // base inicial limpia
//   }

//   setManufactureOrderId(manufacture_id: number | string) {

//     // redefinir completamente el baseUrl (no concatenar sobre el anterior)
//     this.extraPath = `/${manufacture_id}/orders`;
//   }

// }
import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';

// import { BaseCrudService } from '../base-crud.service';

import { BaseCrudDashboardService } from '../../base-crud-dashboard.service';

@Injectable({
  providedIn: 'root',
})

export class ManufactureOrderService extends BaseCrudDashboardService{

  constructor(http: HttpClient) {

    super(http, 'manufactures/orders');
  }


  // base_path(path: string[] = []){
  //   return ['inventories','manufactures',...path];
  // }

}
