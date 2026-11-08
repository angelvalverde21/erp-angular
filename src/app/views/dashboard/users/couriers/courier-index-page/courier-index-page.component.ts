import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Subject, switchMap, takeUntil, catchError, of, tap } from 'rxjs';
import { CourierService } from '../courier.service';
import { CourierIndexComponent } from '../courier-index/courier-index.component';
import { ButtonLinkComponent } from '../../../../shared/components/buttons/button-link/button-link.component';
import { HeadPageComponent } from '../../../../shared/components/head-page/head-page.component';
import { Courier } from '../courier.model';

@Component({
  selector: 'app-courier-index-page',
  imports: [FormsModule, CourierIndexComponent, ButtonLinkComponent, HeadPageComponent],
  templateUrl: './courier-index-page.component.html',
  styleUrl: './courier-index-page.component.scss'
})
export class CourierIndexPageComponent implements OnInit, OnDestroy {
  couriers: Courier[] = [];
  loading = false;
  error = '';
  search = '';
  status = '';
  deliveryType = '';
  page = 1;
  lastPage = 1;
  total = 0;
  private reload$ = new Subject<void>();
  private destroy$ = new Subject<void>();

  constructor(private courierService: CourierService) {}

  ngOnInit(): void {
    this.reload$.pipe(
      tap(() => { this.loading = true; this.error = ''; }),
      switchMap(() => this.courierService.list(this.page, this.search, this.status, this.deliveryType).pipe(
        catchError(() => {
          this.error = 'No se pudieron cargar los couriers. Inténtalo nuevamente.';
          return of(null);
        }),
      )),
      takeUntil(this.destroy$),
    ).subscribe((response) => {
      this.loading = false;
      if (!response) return;
      this.couriers = response.data;
      this.total = response.total;
      this.lastPage = response.last_page;
    });
    this.load();
  }

  load(page = 1): void {
    this.page = page;
    this.reload$.next();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.reload$.complete();
  }
}