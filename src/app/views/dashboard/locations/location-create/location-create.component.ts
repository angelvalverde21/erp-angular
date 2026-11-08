import { RouterLink } from '@angular/router';
import { BranchFieldValidationDirective } from '../../branches/branch-field-validation.directive';
import { Component, EventEmitter, Input, OnDestroy, Output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Location, LocationPayload } from 'src/app/interfaces/location.interface';
import { bindAutomaticCode } from '../../branches/automatic-code';
import { Subscription } from 'rxjs';
@Component({ selector: 'app-location-create', imports: [RouterLink, ReactiveFormsModule, BranchFieldValidationDirective], templateUrl: './location-create.component.html', styleUrl: './location-create.component.scss' })
export class LocationCreateComponent implements OnDestroy {
  @Input() saving = false;
  @Input() editing = false;
  @Input() cancelPath = ['../'];
  @Input() submitLabel = 'Crear ubicación';
  @Input() parentId = 0;
  @Input() parents: Location[] = [];
  @Input() set initialParentId(id: number | null) { this.form.controls.parent_id.setValue(id); }
  @Output() save = new EventEmitter<LocationPayload>();
  readonly form;
  private readonly codeSubscription: Subscription;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.nonNullable.group({
      name: ['', [Validators.required, Validators.maxLength(255), Validators.pattern(/\S/)]],
      code: ['', [ Validators.maxLength(255)]],
      parent_id: [null as number | null],
      is_active: [true],
    });
    this.codeSubscription = bindAutomaticCode(this.form.controls.name, this.form.controls.code, 255);
  }

  ngOnDestroy(): void {
    this.codeSubscription.unsubscribe();
  }

  submit(): void {
    if (this.saving) return;
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    const values = this.form.getRawValue();
    this.save.emit({ ...values, name: values.name.trim(), code: values.code.trim() || null, warehouse_id: this.parentId,  });
  }
}
