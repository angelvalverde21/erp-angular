import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { BaseCrudDashboardService } from '../../../../base-crud-dashboard.service';

// import { BaseCrudService } from '../base-crud.service';


@Injectable({
  providedIn: 'root',
})


export class EmployeeAttendanceService extends BaseCrudDashboardService {


  section_id: number | string | null = null;

  constructor(http: HttpClient) {
    super(http, 'employees'); // base inicial limpia
  }

  setId(employee_id: number) {

    // redefinir completamente el baseUrl (no concatenar sobre el anterior)
    this.extraPath = `/${employee_id}/attendances`;
  }

}