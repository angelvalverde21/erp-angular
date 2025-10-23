import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';

import { BaseCrudService } from '../../base-crud.service';
import { StoreService } from '../../../core/services/store.service';

@Injectable({
  providedIn: 'root',
})

export class OrderService extends BaseCrudService{

  constructor(http: HttpClient) {
    super(http, 'orders');
  }

}

