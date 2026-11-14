import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { PurchaseEditComponent } from '../purchase-edit/purchase-edit.component';
import { BaseService } from 'src/app/views/base.service';
import { DeliveryTrackingComponent } from '@shared/components/delivery-tracking/delivery-tracking.component';
import { DeliveryTracking } from '@shared/components/delivery-tracking/delivery-tracking.model';

@Component({
  selector: 'app-purchase-edit-page',
  imports: [PurchaseEditComponent, RouterModule, DeliveryTrackingComponent],
  templateUrl: './purchase-edit-page.component.html',
  styleUrl: './purchase-edit-page.component.scss',
})
export class PurchaseEditPageComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly base = inject(BaseService);
  private readonly router = inject(Router);
  readonly purchaseId = Number(this.route.snapshot.paramMap.get('purchase_id'));
  private readonly productionId = Number(this.route.snapshot.queryParamMap.get('production'));
  readonly fromProduction = Number.isInteger(this.productionId) && this.productionId > 0;
  readonly fromTracking = this.fromProduction && this.route.snapshot.queryParamMap.get('returnTo') === 'deliveries';
  readonly backLink = this.fromProduction
    ? ['/', this.base.store ?? '', 'dashboard', 'manufactures', 'productions', this.productionId, this.fromTracking ? 'deliveries' : 'purchases']
    : ['/', this.base.store ?? '', 'dashboard', 'purchases'];
  tracking: DeliveryTracking | null = null;
  supplierName = '';
  loaded = false;
  message = '';

  purchaseLoaded(purchase: { delivery_tracking?: DeliveryTracking | null; supplier?: { name?: string; user?: { name?: string } } | null }): void {
    this.tracking = purchase.delivery_tracking ?? null;
    this.supplierName = purchase.supplier?.user?.name || purchase.supplier?.name || 'Sin proveedor';
    this.loaded = true;
  }
  saved(purchase?: any): void {
    if (purchase) this.purchaseLoaded(purchase);
    this.message = 'Compra actualizada correctamente.';
  }
  cancel(): void { void this.router.navigate(this.backLink); }
}
