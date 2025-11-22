import { Component, OnDestroy, OnInit } from '@angular/core';
import { LoadingComponent } from '../../../../shared/components/loading/loading.component';
import { EmployeeEditComponent } from '../employee-edit/employee-edit.component';
import { ButtonBackComponent } from '../../../../shared/components/buttons/button-back/button-back.component';
import { HeadPageComponent } from "../../../../shared/components/head-page/head-page.component";
import { Subject, takeUntil } from 'rxjs';
import { EmployeeService } from '../employee.service';
import { ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';
import { RoleService } from '../../../roles/role.service';
@Component({
  selector: 'app-employee-edit-page',
  imports: [
    LoadingComponent,
    EmployeeEditComponent,
    HeadPageComponent,
    ButtonBackComponent

  ],
  templateUrl: './employee-edit-page.component.html',
  styleUrl: './employee-edit-page.component.scss'
})
export class EmployeeEditPageComponent implements OnInit, OnDestroy {

  ngOnInit(): void {
    this.employeeInit();
    this.rolesInit();
  }

  roles: any[] = [];
  loading: boolean = false;
  employee_id: number = 0
  employee: any;

  constructor(
    private _employee: EmployeeService,
    private route: ActivatedRoute,
      private _role: RoleService,
  ) {
    this.route.params.subscribe(params => {
      this.employee_id = params['employee_id'];
    });
  }

  employeeInit() {

    this.loading = true;

    this._employee.get(this.employee_id).pipe(takeUntil(this.destroy$)).subscribe({

      next: (resp: any) => {
        console.log(resp);
        this.employee = resp.data;
        this.loading = false;
      },

      error: (error: any) => {
        Swal.fire('Error', 'Ocurrió un problema al traer los datos del empleado.', 'error');
        console.error(error);
      },

    });
  }

  roles_loading: boolean = false;

  rolesInit() {

    this.roles_loading = true;
    this._role.index().pipe(takeUntil(this.destroy$)).subscribe({

      next: (resp: any) => {
        // Swal.fire('Guardado', 'El registro ha sido creado', 'success');
        console.log(resp);
        this.roles = resp.data;
        this.roles_loading = false;
      },

      error: (error: any) => {
        Swal.fire('Error', 'Ocurrió un problema al listar los roles del sistema', 'error');
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
