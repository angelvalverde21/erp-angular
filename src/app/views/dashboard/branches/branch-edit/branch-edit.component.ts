import { RouterLink } from '@angular/router';
import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { Branch } from 'src/app/interfaces/branch.interface';
import { BranchCreateComponent } from '../branch-create/branch-create.component';
import { BranchFieldValidationDirective } from '../../branches/branch-field-validation.directive';
import { AddressCreateComponent } from '../../addresses/address-create/address-create.component';
import { AddressEditComponent } from '../../addresses/address-edit/address-edit.component';
import { snakeCaseCode } from '../automatic-code';

@Component({
  selector: 'app-branch-edit',
  imports: [RouterLink, ReactiveFormsModule, BranchFieldValidationDirective, AddressCreateComponent, AddressEditComponent],
  templateUrl: '../branch-create/branch-create.component.html',
  styleUrl: '../branch-create/branch-create.component.scss',
})
export class BranchEditComponent extends BranchCreateComponent implements OnChanges {
  @Input({ required: true }) record!: Branch;
  override submitLabel = 'Guardar cambios';
  override editing = true;
  override cancelPath = ['../../'];

  ngOnChanges(changes: SimpleChanges): void {
    if (!changes['record'] || !this.record) return;
    this.form.patchValue({ ...this.record, code: this.record.code?.trim() || snakeCaseCode(this.record.name) });
    this.form.markAsPristine();
  }
}
