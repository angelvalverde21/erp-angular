import { Component, OnDestroy, OnInit } from '@angular/core';
import { LoadingComponent } from '../../../../shared/components/loading/loading.component';
import { CustomerEditComponent } from '../customer-edit/customer-edit.component';
import { ButtonBackComponent } from '../../../../shared/components/buttons/button-back/button-back.component';
import { HeadPageComponent } from "../../../../shared/components/head-page/head-page.component";
import { Subject, takeUntil } from 'rxjs';
import { Customerservice } from '../Customer.service';
import { ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';
import { RoleService } from '../../../roles/role.service';
@Component({
  selector: 'app-customer-edit-page',
  imports: [
    LoadingComponent,
    CustomerEditComponent,
    HeadPageComponent,
    ButtonBackComponent

  ],
  templateUrl: './customer-edit-page.component.html',
  styleUrl: './customer-edit-page.component.scss'
})
export class CustomerEditPageComponent implements OnInit, OnDestroy {

  ngOnInit(): void {
    this.CustomerInit();
    this.rolesInit();
  }

  roles: any[] = [];
  loading: boolean = false;
  customer_id: number = 0
  customer: any;

  constructor(
    private _Customer: Customerservice,
    private route: ActivatedRoute,
      private _role: RoleService,
  ) {
    this.route.params.subscribe(params => {
      this.customer_id = params['customer_id'];
    });
  }

  CustomerInit() {

    this.loading = true;

    this._Customer.get(this.customer_id).pipe(takeUntil(this.destroy$)).subscribe({

      next: (resp: any) => {
        console.log(resp);
        this.customer = resp.data;
        this.loading = false;
      },

      error: (error: any) => {
        Swal.fire('Error', 'OcurriÃ³ un problema al traer los datos del Cliente.', 'error');
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
        Swal.fire('Error', 'OcurriÃ³ un problema al listar los roles del sistema', 'error');
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


