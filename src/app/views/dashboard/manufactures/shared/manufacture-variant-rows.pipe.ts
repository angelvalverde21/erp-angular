import { Pipe, PipeTransform } from '@angular/core';
import { buildVariantMatrices, ManufactureMatrixVariant } from './variant-matrix/variant-matrix.model';

interface GroupedVariantRow {
  record: ManufactureMatrixVariant;
  striped: boolean;
  startsGroup: boolean;
}

@Pipe({ name: 'manufactureVariantRows' })
export class ManufactureVariantRowsPipe implements PipeTransform {
  transform(records: readonly ManufactureMatrixVariant[] | null | undefined): GroupedVariantRow[] {
    const groups = buildVariantMatrices(records ?? []);
    const collator = new Intl.Collator('es', { numeric: true, sensitivity: 'base' });
    groups.sort((a, b) => collator.compare(a.name, b.name));

    const result: GroupedVariantRow[] = [];
    let groupIndex = 0;
    for (const group of groups) {
      for (const row of group.rows) {
        let startsGroup = true;
        for (const size of group.sizes) {
          for (const record of row.cells.get(size) ?? []) {
            result.push({ record, striped: groupIndex % 2 === 1, startsGroup });
            startsGroup = false;
          }
        }
        groupIndex++;
      }
    }
    return result;
  }
}
