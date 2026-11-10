import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { ImagePreviewComponent } from 'src/app/views/shared/components/image-preview/image-preview.component';
import { buildVariantMatrices, ManufactureMatrixVariant, VariantMatrixGroup, VariantMatrixRow } from './variant-matrix.model';
import { VariantMatrixCellComponent } from './variant-matrix-cell.component';

@Component({
  selector: 'app-variant-matrix',
  imports: [DecimalPipe, ImagePreviewComponent, VariantMatrixCellComponent],
  templateUrl: './variant-matrix.component.html',
  styleUrl: './variant-matrix.component.scss',
})
export class VariantMatrixComponent implements OnChanges {
  @Input() records: ManufactureMatrixVariant[] = [];
  @Input() manufactureId = 0;
  @Input() showPrices = false;
  @Output() updated = new EventEmitter<ManufactureMatrixVariant>();
  groups: VariantMatrixGroup[] = [];

  ngOnChanges(): void {
    this.groups = buildVariantMatrices(this.records ?? []);
  }

  rowName(group: VariantMatrixGroup, row: VariantMatrixRow): string {
    const name = group.name.trim().toLocaleLowerCase('es');
    const option = row.label.trim().toLocaleLowerCase('es');
    if (row.label === 'Presentación única' || name === option || name.endsWith(` ${option}`)) return group.name;
    return `${group.name} ${row.label}`;
  }
}
