import { RouterLink } from '@angular/router';
import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { Warehouse } from 'src/app/interfaces/warehouse.interface';
import { WarehouseCreateComponent } from '../warehouse-create/warehouse-create.component';
import { BranchFieldValidationDirective } from '../../branches/branch-field-validation.directive';
import { snakeCaseCode } from '../../branches/automatic-code';

@Component({
  selector: 'app-warehouse-edit',
  imports: [RouterLink, ReactiveFormsModule, BranchFieldValidationDirective],
  templateUrl: '../warehouse-create/warehouse-create.component.html',
  styleUrl: '../warehouse-create/warehouse-create.component.scss',
})
export class WarehouseEditComponent extends WarehouseCreateComponent implements OnChanges {
  @Input({ required: true }) record!: Warehouse;
  override submitLabel = 'Guardar cambios';
  override editing = true;
  override cancelPath = ['../../'];

  ngOnChanges(changes: SimpleChanges): void {
    if (!changes['record'] || !this.record) return;
    this.form.patchValue({ ...this.record, subtitle: this.record.subtitle ?? '', code: this.record.code?.trim() || snakeCaseCode(this.record.name) });
    this.form.markAsPristine();
  }
}
