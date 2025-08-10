import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { BaseCrudService } from '../base-crud.service';


@Injectable({
  providedIn: 'root'
})

export class PurchaseService extends BaseCrudService {

  constructor(http: HttpClient) {

    super(http, 'suppliers');

  }

  //la variable this.baseUrl esta dentro de BaseCrudService que se llama con super

}