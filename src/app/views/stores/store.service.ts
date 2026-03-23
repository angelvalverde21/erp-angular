import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { CrudService } from '../crud.service';


@Injectable({
  providedIn: 'root',
})
export class StoreService extends CrudService{

  constructor(http: HttpClient) {

    const url = environment.apiStore

    super(http, url);

  }

}
