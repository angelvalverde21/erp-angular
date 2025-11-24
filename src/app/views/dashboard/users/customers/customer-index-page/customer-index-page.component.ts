import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import Swal from 'sweetalert2';
import { Customerservice } from '../Customer.service';
import { CustomerIndexComponent } from '../customer-index/customer-index.component';
import { ButtonComponent } from "../../../../shared/components/buttons/button/button.component";
import { ButtonLinkComponent } from "../../../../shared/components/buttons/button-link/button-link.component";
import { LoadingComponent } from '../../../../shared/components/loading/loading.component';
import { HeadPageComponent } from "../../../../shared/components/head-page/head-page.component";
import { faMagnifyingGlass, faFilter } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-customer-index-page',
  imports: [
    CustomerIndexComponent,
    ButtonComponent,
    ButtonLinkComponent,
    LoadingComponent,
    HeadPageComponent
  ],
  templateUrl: './customer-index-page.component.html',
  styleUrl: './customer-index-page.component.scss'
})
export class CustomerIndexPageComponent implements OnInit, OnDestroy {

  faMagnifyingGlass = faMagnifyingGlass;
  faFilter = faFilter;
  
  constructor(private _Customer: Customerservice) {

  }

  ngOnInit(): void {
    this.CustomersInit();
  }

  customers: any[] = [];
  loading: boolean = false;

  CustomersInit() {

    this.loading = true;

    this._Customer.index().pipe(takeUntil(this.destroy$)).subscribe({

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

  destroy$ = new Subject<void>();

  ngOnDestroy(): void {

    this.destroy$.next();
    this.destroy$.complete();

  }

}


