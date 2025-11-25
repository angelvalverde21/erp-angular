import { Component, OnDestroy, OnInit } from '@angular/core';
import { CustomerCreateComponent } from '../customer-create/customer-create.component';
import { ButtonBackComponent } from '../../../../shared/components/buttons/button-back/button-back.component';
import { HeadPageComponent } from "../../../../shared/components/head-page/head-page.component";
import { Subject, takeUntil } from 'rxjs';
import Swal from 'sweetalert2';
import { RoleService } from '../../../roles/role.service';
import { LoadingComponent } from '../../../../shared/components/loading/loading.component';
import { ActivatedRoute, Router } from '@angular/router';
import { faUserPlus } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-customer-create-page',
  imports: [
    CustomerCreateComponent,
    ButtonBackComponent,
    HeadPageComponent,
    LoadingComponent
  ],
  templateUrl: './customer-create-page.component.html',
  styleUrl: './customer-create-page.component.scss'
})
export class CustomerCreatePageComponent implements OnInit, OnDestroy{

  roles: any[] = [];
  loading: boolean = false;
  faUserPlus = faUserPlus;

  constructor(
      private _role: RoleService,
      private router: Router,
      private route: ActivatedRoute
  ){
  
  }

  ngOnInit(): void {
    this.rolesInit();
  }

  rolesInit() {

    this.loading = true;
    this._role.index().pipe(takeUntil(this.destroy$)).subscribe({

      next: (resp: any) => {
        // Swal.fire('Guardado', 'El registro ha sido creado', 'success');
        console.log(resp);
        this.roles = resp.data;
        this.loading = false;
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

  receiveCustomerCreate(customer: any) {
  
      console.log(customer);
  
      if (customer) {
        this.router.navigate(['../', customer.id], { relativeTo: this.route })
          .then(() => {
            console.log('Nueva URL:', this.router.url);
          });
      }
  
    }

}


