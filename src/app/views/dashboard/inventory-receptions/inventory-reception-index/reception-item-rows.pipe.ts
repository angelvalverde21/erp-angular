import { Pipe, PipeTransform } from '@angular/core';
import { InventoryReception } from '../inventory-reception.service';

type ReceptionItem = InventoryReception['items'][number];

@Pipe({ name: 'receptionItemRows' })
export class ReceptionItemRowsPipe implements PipeTransform {
  transform(items: ReceptionItem[]): { item: ReceptionItem; striped: boolean; startsGroup: boolean }[] {
    const groups = new Map<string, ReceptionItem[]>();
    for (const item of items) {
      // Sizes share a background; colors and other explicit attributes separate groups.
      const attributes = item.options
        .filter(option => !['size', 'talla', 'tamaño', 'tamano'].includes(option.name?.trim().toLocaleLowerCase()))
        .map(option => [option.name?.trim().toLocaleLowerCase(), option.value?.trim().toLocaleLowerCase()])
        .sort((a, b) => JSON.stringify(a).localeCompare(JSON.stringify(b)));
      const key = JSON.stringify([item.product_id ?? item.product_name, attributes]);
      const group = groups.get(key) ?? [];
      group.push(item); groups.set(key, group);
    }
    return [...groups.values()].flatMap((group, index) => group.map((item, row) => ({ item, striped: index % 2 === 1, startsGroup: row === 0 })));
  }
}
