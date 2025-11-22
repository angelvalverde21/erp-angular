import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import Swal from 'sweetalert2';
import { EmployeeService } from '../employee.service';
import { EmployeeIndexComponent } from '../employee-index/employee-index.component';
import { ButtonComponent } from "../../../../shared/components/buttons/button/button.component";
import { ButtonLinkComponent } from "../../../../shared/components/buttons/button-link/button-link.component";
import { LoadingComponent } from '../../../../shared/components/loading/loading.component';
import { HeadPageComponent } from "../../../../shared/components/head-page/head-page.component";
import { faMagnifyingGlass, faFilter } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-employee-index-page',
  imports: [
    EmployeeIndexComponent,
    ButtonComponent,
    ButtonLinkComponent,
    LoadingComponent,
    HeadPageComponent
  ],
  templateUrl: './employee-index-page.component.html',
  styleUrl: './employee-index-page.component.scss'
})
export class EmployeeIndexPageComponent implements OnInit, OnDestroy {

  faMagnifyingGlass = faMagnifyingGlass;
  faFilter = faFilter;
  
  constructor(private _employee: EmployeeService) {

  }

  ngOnInit(): void {
    this.employeesInit();
  }

  employees: any[] = [];
  loading: boolean = false;

  employeesInit() {

    this.loading = true;

    this._employee.index().pipe(takeUntil(this.destroy$)).subscribe({

      next: (resp: any) => {
        // Swal.fire('Guardado', 'El registro ha sido creado', 'success');
        console.log(resp);
        this.employees = resp.data;
        this.loading = false;
      },

      error: (error: any) => {
        Swal.fire('Error', 'Ocurrió un problema al traer los datos de los empleados', 'error');
        console.error(error);
      },

    });

  }

  destroy$ = new Subject<void>();

  ngOnDestroy(): void {

    this.destroy$.next();
    this.destroy$.complete();

  }

}
