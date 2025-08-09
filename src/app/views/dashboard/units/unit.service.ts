import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BaseCrudService } from '../base-crud.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UnitService extends BaseCrudService {


  constructor(http: HttpClient) {

    super(http, 'units'); //units es la url que se le pasa a la base service

  }

  //la variable this.baseUrl esta dentro de BaseCrudService que se llama con super



}
