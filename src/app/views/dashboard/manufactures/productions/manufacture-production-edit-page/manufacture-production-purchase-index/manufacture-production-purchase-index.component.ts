import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { finalize, Subject, takeUntil } from 'rxjs';
import { PurchaseIndexComponent } from '@dashboard/purchases/purchase-index/purchase-index.component';
import { ProductionStagesComponent } from '../../production-stages/production-stages.component';
import { LoadingComponent } from '@shared/components/loading/loading.component';
import { ManufactureService } from '../../../manufacture.service';
import { ManufacturePurchaseService } from '../../../manufacture.purchase.service';

@Component({
  selector: 'app-manufacture-production-purchase-index',
  imports: [ProductionStagesComponent, LoadingComponent],
  templateUrl: './manufacture-production-purchase-index.component.html',
  styleUrl: './manufacture-production-purchase-index.component.scss',
})
export class ManufactureProductionPurchaseIndexComponent implements OnInit, OnDestroy {
  manufacture_id = 0;
  purchases: any[] = [];
  loading = false;
  error = '';

  private readonly destroy$ = new Subject<void>();

  constructor(
    private _manufacturePurchase: ManufacturePurchaseService,
    private _manufacture: ManufactureService,
    private route: ActivatedRoute,
  ) {
    this.route.parent?.paramMap
      .pipe(takeUntil(this.destroy$))
      .subscribe(params => this.manufacture_id = Number(params.get('production_id')));
  }

  ngOnInit(): void {
    this.productionPurchaseInit();
  }

  productionPurchaseInit(): void {
    this.error = '';
    this.loading = true;
    this._manufacturePurchase.setManufactureId(this.manufacture_id);

    this._manufacturePurchase.index()
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => this.loading = false),
      )
      .subscribe({
        next: (response: any) => {
          this.purchases = response.data ?? [];
        },
        error: (error: unknown) => {
          this.error = 'No se pudieron cargar las compras. Intenta nuevamente.';
          console.error(error);
        },
      });
  }

  receiveSumPurchases(sum_purchases: number): void {
    this._manufacture.setSummary({ sum_purchases });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
