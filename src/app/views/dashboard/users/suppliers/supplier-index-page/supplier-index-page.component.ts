import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import Swal from 'sweetalert2';
import { SupplierService } from '../supplier.service';
import { SupplierIndexComponent } from '../supplier-index/supplier-index.component';
import { ButtonComponent } from "../../../../shared/components/buttons/button/button.component";
import { ButtonLinkComponent } from "../../../../shared/components/buttons/button-link/button-link.component";
import { LoadingComponent } from '../../../../shared/components/loading/loading.component';
import { HeadPageComponent } from "../../../../shared/components/head-page/head-page.component";
import { faMagnifyingGlass, faFilter } from '@fortawesome/free-solid-svg-icons';
import { UserHeadTableComponent } from '../../shared/user-head-table/user-head-table.component';

@Component({
  selector: 'app-supplier-index-page',
  imports: [
    SupplierIndexComponent,
    ButtonComponent,
    ButtonLinkComponent,
    LoadingComponent,
    HeadPageComponent,
    UserHeadTableComponent
  ],
  templateUrl: './supplier-index-page.component.html',
  styleUrl: './supplier-index-page.component.scss'
})
export class SupplierIndexPageComponent implements OnInit, OnDestroy {

  faMagnifyingGlass = faMagnifyingGlass;
  faFilter = faFilter;

  suppliers: any[] = [];
  loading: boolean = false;
  private destroy$ = new Subject<void>();

  constructor(private _supplier: SupplierService) { }

  ngOnInit(): void {
    this.suppliersInit();
  }

  suppliersInit() {
    this.loading = true;

    this._supplier.index().pipe(takeUntil(this.destroy$)).subscribe({
      next: (resp: any) => {
        console.log(resp);
        this.suppliers = resp.data;
        this.loading = false;
      },
      error: (error: any) => {
        Swal.fire('Error', 'Ocurrio un problema al traer los datos de los proveedores', 'error');
        console.error(error);
        this.loading = false;
      },
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  receiveSearchResult($event: any) {
    this.suppliers = $event;
  }
}
