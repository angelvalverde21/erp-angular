import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ButtonLinkComponent } from '../../shared/components/buttons/button-link/button-link.component';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { FormSearchComponent } from '../../shared/components/form/form-search/form-search.component';
import { LoadingComponent } from '../../shared/components/loading/loading.component';
import { SupplierIndexComponent } from '../supplier-index/supplier-index.component';
import { Subject, takeUntil } from 'rxjs';
import { SupplierService } from '../supplier.service';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-supplier-search-page',
  imports: [
    ButtonLinkComponent,
    FormSearchComponent,
    LoadingComponent,
    SupplierIndexComponent,
  ],
  templateUrl: './supplier-search-page.component.html',
  styleUrl: './supplier-search-page.component.scss',
})
export class SupplierSearchPageComponent implements OnInit, OnDestroy {
  faPlus = faPlus;

  suppliers: any[] = [];

  loading: boolean = true;
  search: string = '';

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private _supplier: SupplierService
  ) {
    this.route.params.subscribe((params) => {
      this.loading = true;
      this.search = params['search'];

      if (this.search.length > 0) {
        this._supplier
          .search(this.search)
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: (resp: any) => {
              this.loading = false;
              this.suppliers = resp.data;
              console.log(resp.data);
            },

            error: (error: any) => {
              this.loading = false;
              console.error(error);
            },
          });
      } else {
        this.loading = false;
        this.suppliers = [];
      }
    });
  }

  destroy$ = new Subject<void>();

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  ngOnInit(): void {}
}
