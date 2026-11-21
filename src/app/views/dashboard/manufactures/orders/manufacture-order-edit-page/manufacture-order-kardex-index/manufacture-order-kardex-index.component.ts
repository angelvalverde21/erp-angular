import { Component, OnDestroy, TemplateRef, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { NgbModal, NgbModalConfig, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { InventoryReception } from '@dashboard/inventory-receptions/inventory-reception.service';
import { InventoryReceptionIndexComponent } from '@dashboard/inventory-receptions/inventory-reception-index/inventory-reception-index.component';
import { KardexHistoryComponent } from '@dashboard/kardex/kardex-history/kardex-history.component';
import { KardexRegisterInComponent } from '@dashboard/kardex/kardex-register-in/kardex-register-in.component';
import { KardexRegisterOutComponent } from '@dashboard/kardex/kardex-register-out/kardex-register-out.component';

import { ManufactureVariantService } from '../../../manufacture.variants.service';
import { ManufactureService } from '../../../manufacture.service';
import { KardexSummary } from '@interfaces/kardexSummary.interface';

@Component({
  selector: 'app-manufacture-order-kardex-index',
  imports: [InventoryReceptionIndexComponent, KardexHistoryComponent, KardexRegisterInComponent, KardexRegisterOutComponent],
  templateUrl: './manufacture-order-kardex-index.component.html',
  styleUrl: './manufacture-order-kardex-index.component.scss',
})
export class ManufactureOrderKardexIndexComponent implements OnDestroy {
  @ViewChild(InventoryReceptionIndexComponent) receptionIndex?: InventoryReceptionIndexComponent;
  editingReception?: InventoryReception;
  manufacture_id = 0;
  kardexRevision = 0;
  kardex_summary: KardexSummary = {};
  variants: any[] = [];
  loadingKardex = false;
  variantsError = '';
  registering = false;
  modal?: NgbModalRef;
  private readonly destroy$ = new Subject<void>();

  constructor(
    route: ActivatedRoute, private manufacture: ManufactureService,
    private variantService: ManufactureVariantService, config: NgbModalConfig, private modalService: NgbModal,
  ) {
    config.backdrop = 'static'; config.keyboard = false;
    route.parent?.paramMap.pipe(takeUntil(this.destroy$)).subscribe(params => this.manufacture_id = Number(params.get('order_id')));
  }
  loadVariants(): void {
    this.loadingKardex = true; this.variantsError = ''; this.variants = [];
    this.variantService.setManufactureId(this.manufacture_id);
    this.variantService.selection().pipe(takeUntil(this.destroy$)).subscribe({
      next: response => {
        this.variants = (Array.isArray(response.data) ? response.data : []).map((item: any) => item?.variant ?? null);
        this.loadingKardex = false;
      },
      error: () => { this.loadingKardex = false; this.variantsError = 'No se pudieron cargar las variantes. Vuelve a intentarlo.'; },
    });
  }
  inventoryChanged(): void {
    this.kardexRevision++;
    // Only totals are refreshed here. The ledger fetches rows only while expanded.
    this.manufacture.summary(this.manufacture_id).pipe(takeUntil(this.destroy$)).subscribe({
      next: response => this.manufacture.setSummary({ sum_kardexes: Number(response.data?.sum_kardexes) || 0 }),
      error: () => {},
    });
  }
  receiveKardexSummary(summary: KardexSummary): void {
    this.kardex_summary = summary;
    this.manufacture.setSummary({ sum_kardexes: summary.reception ?? 0 });
  }
  receiveKardexes(event: any): void { this.modal?.close(); this.inventoryChanged(); }
  receptionSaved(): void {
    this.modal?.close();
    if (this.receptionIndex) this.receptionIndex.refresh(this.editingReception ? this.receptionIndex.page : 1);
  }
  closeModal(): void { this.modal?.close(); }
  openVerticallyCentered(content: TemplateRef<any>, reception?: InventoryReception): void {
    this.editingReception = reception;
    this.loadVariants();
    this.modal = this.modalService.open(content, { centered: true, size: 'xl', scrollable: true });
  }
  ngOnDestroy(): void { this.destroy$.next(); this.destroy$.complete(); }
}
