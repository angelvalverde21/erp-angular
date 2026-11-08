import { Component, Input } from '@angular/core';
import { DatePipe, UpperCasePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { InventoryCount, InventoryVariant } from 'src/app/interfaces/inventory-workspace.interface';
import { InventoryStatusComponent } from '../../inventory-status/inventory-status.component';
interface CountGroup {
  variantId: number;
  name: string;
  sku: string;
  options: NonNullable<InventoryVariant['variant_option_values']>;
  records: InventoryCount[];
  total: number;
}

@Component({ selector: 'app-inventory-count-index', imports: [DatePipe, UpperCasePipe, RouterLink, InventoryStatusComponent], templateUrl: './inventory-count-index.component.html', styleUrl: './inventory-count-index.component.scss' })
export class InventoryCountIndexComponent {
  groups: CountGroup[] = [];

  @Input() set records(records: InventoryCount[]) {
    const groups = new Map<number, CountGroup>();
    for (const record of records) {
      let group = groups.get(record.variant_id);
      if (!group) {
        group = {
          variantId: record.variant_id,
          name: record.variant?.product?.name || 'Variante #' + record.variant_id,
          sku: record.variant?.sku || 'Sin SKU',
          options: record.variant?.variant_option_values ?? [],
          records: [],
          total: 0,
        };
        groups.set(record.variant_id, group);
      }
      if (!group.options.length && record.variant?.variant_option_values?.length) {
        group.options = record.variant.variant_option_values;
      }
      group.records.push(record);
      if (record.status === 'valid') group.total += Number(record.quantity);
    }
    this.groups = [...groups.values()];
  }

}
