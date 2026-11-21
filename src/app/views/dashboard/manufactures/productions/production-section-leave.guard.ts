import { CanDeactivateFn } from '@angular/router';
import type { ManufactureProductionPurchaseIndexComponent } from './manufacture-production-edit-page/manufacture-production-purchase-index/manufacture-production-purchase-index.component';

export const productionSectionLeaveGuard: CanDeactivateFn<ManufactureProductionPurchaseIndexComponent> = component => component.canLeaveSection();
