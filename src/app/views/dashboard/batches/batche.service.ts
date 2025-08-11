import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { BaseCrudService } from '../base-crud.service';


@Injectable({
  providedIn: 'root'
})

export class BatcheService extends BaseCrudService {

  constructor(http: HttpClient) {

    super(http, 'batches');

  }

  //la variable this.baseUrl esta dentro de BaseCrudService que se llama con super

}