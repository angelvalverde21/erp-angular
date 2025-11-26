import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import Swal from 'sweetalert2';
import { CustomerService } from '../customer.service';
import { CustomerIndexComponent } from '../customer-index/customer-index.component';
import { ButtonComponent } from "../../../../shared/components/buttons/button/button.component";
import { ButtonLinkComponent } from "../../../../shared/components/buttons/button-link/button-link.component";
import { LoadingComponent } from '../../../../shared/components/loading/loading.component';
import { HeadPageComponent } from "../../../../shared/components/head-page/head-page.component";
import { faFilter, faUsers } from '@fortawesome/free-solid-svg-icons';
import { UserHeadTableComponent } from '../../shared/user-head-table/user-head-table.component';

@Component({
  selector: 'app-customer-index-page',
  imports: [
    CustomerIndexComponent,
    ButtonComponent,
    ButtonLinkComponent,
    LoadingComponent,
    HeadPageComponent,
    UserHeadTableComponent
  ],
  templateUrl: './customer-index-page.component.html',
  styleUrl: './customer-index-page.component.scss'
})
export class CustomerIndexPageComponent implements OnInit, OnDestroy {

  customers: any[] = [];
  loading: boolean = false;

  destroy$ = new Subject<void>();
  faUsers = faUsers;

  constructor(private _customer: CustomerService) {

  }

  ngOnInit() {
    this.customersInit();
  }

  customersInit() {

    this.loading = true;

    this._customer.index().pipe(takeUntil(this.destroy$)).subscribe({

      next: (resp: any) => {
        // Swal.fire('Guardado', 'El registro ha sido creado', 'success');
        console.log(resp);
        this.customers = resp.data;
        this.loading = false;
      },

      error: (error: any) => {
        Swal.fire('Error', 'OcurriÃ³ un problema al traer los datos de los Clientes', 'error');
        console.error(error);
      },

    });

  }


  ngOnDestroy(): void {

    this.destroy$.next();
    this.destroy$.complete();

  }

  receiveSearchResult($event: any) {
    this.customers = $event;
  }
}