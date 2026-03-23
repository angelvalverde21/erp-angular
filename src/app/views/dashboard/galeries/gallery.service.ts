import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';

// import { BaseCrudService } from '../base-crud.service';
import { Observable } from 'rxjs';
import { BaseCrudDashboardService } from '../base-crud-dashboard.service';

@Injectable({
  providedIn: 'root',
})

export class GalleryService extends BaseCrudDashboardService{

  constructor(http: HttpClient) {

    super(http, 'images');
  }

}

