import { RouterLink } from '@angular/router';
import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { Location } from 'src/app/interfaces/location.interface';
import { LocationCreateComponent } from '../location-create/location-create.component';
import { BranchFieldValidationDirective } from '../../branches/branch-field-validation.directive';
import { snakeCaseCode } from '../../branches/automatic-code';

@Component({
  selector: 'app-location-edit',
  imports: [RouterLink, ReactiveFormsModule, BranchFieldValidationDirective],
  templateUrl: '../location-create/location-create.component.html',
  styleUrl: '../location-create/location-create.component.scss',
})
export class LocationEditComponent extends LocationCreateComponent implements OnChanges {
  @Input({ required: true }) record!: Location;
  override submitLabel = 'Guardar cambios';
  override editing = true;
  override cancelPath = ['../../'];

  ngOnChanges(changes: SimpleChanges): void {
    if (!changes['record'] || !this.record) return;
    this.form.patchValue({ ...this.record, code: this.record.code?.trim() || snakeCaseCode(this.record.name, 255) });
    this.form.markAsPristine();
  }
}
