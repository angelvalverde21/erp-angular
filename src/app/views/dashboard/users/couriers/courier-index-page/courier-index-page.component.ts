import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import Swal from 'sweetalert2';
import { CourierService } from '../courier.service';
import { ButtonComponent } from "../../../../shared/components/buttons/button/button.component";
import { ButtonLinkComponent } from "../../../../shared/components/buttons/button-link/button-link.component";
import { LoadingComponent } from '../../../../shared/components/loading/loading.component';
import { HeadPageComponent } from "../../../../shared/components/head-page/head-page.component";
import { faMagnifyingGlass, faFilter } from '@fortawesome/free-solid-svg-icons';
import { UserHeadTableComponent } from '../../shared/user-head-table/user-head-table.component';
import { CourierIndexComponent } from '../courier-index/courier-index.component';

@Component({
  selector: 'app-courier-index-page',
  imports: [
    CourierIndexComponent,
    ButtonComponent,
    ButtonLinkComponent,
    LoadingComponent,
    HeadPageComponent,
    UserHeadTableComponent
  ],
  templateUrl: './courier-index-page.component.html',
  styleUrl: './courier-index-page.component.scss'
})

export class CourierIndexPageComponent implements OnInit, OnDestroy {

  faMagnifyingGlass = faMagnifyingGlass;
  faFilter = faFilter;

  couriers: any[] = [];
  loading: boolean = false;
  private destroy$ = new Subject<void>();

  constructor(private _courier: CourierService) { }

  ngOnInit(): void {
    this.couriersInit();
  }

  couriersInit() {
    this.loading = true;

    this._courier.index().pipe(takeUntil(this.destroy$)).subscribe({
      next: (resp: any) => {
        console.log(resp);
        this.couriers = resp.data;
        this.loading = false;
      },
      error: (error: any) => {
        Swal.fire('Error', 'Ocurrió un problema al traer los datos de los couriers', 'error');
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
    this.couriers = $event;
  }
}
