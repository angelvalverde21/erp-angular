import { Component, OnInit } from '@angular/core';
import { UserHeadTableComponent } from '../../users/shared/user-head-table/user-head-table.component';
import { PettyCashIndexComponent } from '../petty-cash-index/petty-cash-index.component';
import { HeadPageComponent } from '../../../shared/components/head-page/head-page.component';
import { ButtonLinkComponent } from '../../../shared/components/buttons/button-link/button-link.component';
import { LoadingComponent } from '../../../shared/components/loading/loading.component';
import { PettyCashService } from '../pettycash.service';
import { Subject, takeUntil } from 'rxjs';
import Swal from 'sweetalert2';
import { JsonPipe } from '@angular/common';

@Component({
  selector: 'app-petty-cash-index-page',
  imports: [
    UserHeadTableComponent,
    PettyCashIndexComponent,
    HeadPageComponent,
    ButtonLinkComponent,
    LoadingComponent,
    JsonPipe
  ],
  templateUrl: './petty-cash-index-page.component.html',
  styleUrl: './petty-cash-index-page.component.scss'
})
export class PettyCashIndexPageComponent implements OnInit {

  loading: boolean = false;

  petty_cashes: any;

  constructor(
    private _pettyCashService: PettyCashService
  ) {

  }

  ngOnInit(): void {
    this.pettyCashesInit();
  }

  pettyCashesInit() {

    this.loading = true;

    this._pettyCashService.index().pipe(takeUntil(this.destroy$)).subscribe({

      next: (resp: any) => {
        console.log(resp);
        this.petty_cashes = resp.data;
        this.loading = false;
      },

      error: (error: any) => {
        this.loading = false;
        Swal.fire('Error', 'Ocurrió un problema al traer los datos de la caja chica. Inténtalo nuevamente.', 'error');
        console.error(error);
      },

    });

  }

  destroy$ = new Subject<void>();

  ngOnDestroy(): void {

    this.destroy$.next();
    this.destroy$.complete();

  }

  receiveSearchResult(petty_cashes: any) {
    // Handle search result
  }
}
