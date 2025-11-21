import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';

// import { BaseCrudService } from '../base-crud.service';
import { Observable } from 'rxjs';
import { BaseService } from '../../base.service';
import { environment } from '../../../environments/environment';
import { BaseCrudDashboardService } from '../base-crud-dashboard.service';

@Injectable({
  providedIn: 'root',
})

export class UserService extends BaseCrudDashboardService {

  constructor(http: HttpClient) {

    super(http, 'users');
  }

  getUser() {
    const userString = localStorage.getItem('user');
    const user = userString ? JSON.parse(userString) : null;
    return user;
  }

}

