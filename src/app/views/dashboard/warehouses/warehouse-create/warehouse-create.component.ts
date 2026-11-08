import { RouterLink } from '@angular/router';
import { BranchFieldValidationDirective } from '../../branches/branch-field-validation.directive';
import { Component, EventEmitter, Input, OnDestroy, Output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { WarehousePayload } from 'src/app/interfaces/warehouse.interface';
import { bindAutomaticCode } from '../../branches/automatic-code';
import { Subscription } from 'rxjs';
import { BranchAddress } from 'src/app/interfaces/branch.interface';
@Component({ selector: 'app-warehouse-create', imports: [RouterLink, ReactiveFormsModule, BranchFieldValidationDirective], templateUrl: './warehouse-create.component.html', styleUrl: './warehouse-create.component.scss' })
export class WarehouseCreateComponent implements OnDestroy {
  @Input() saving = false;
  @Input() editing = false;
  @Input() cancelPath = ['../'];
  @Input() submitLabel = 'Crear almacén';
  @Input() parentId = 0;
  @Input() branchAddress: BranchAddress | null = null;
  
  @Output() save = new EventEmitter<WarehousePayload>();
  readonly form;
  private readonly codeSubscription: Subscription;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.nonNullable.group({
      name: ['', [Validators.required, Validators.maxLength(255), Validators.pattern(/\S/)]],
      subtitle: ['', Validators.maxLength(255)],
      code: ['', [Validators.required, Validators.pattern(/\S/), Validators.maxLength(50)]],
      is_active: [true],
    });
    this.codeSubscription = bindAutomaticCode(this.form.controls.name, this.form.controls.code);
  }

  ngOnDestroy(): void {
    this.codeSubscription.unsubscribe();
  }

  submit(): void {
    if (this.saving) return;
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    const values = this.form.getRawValue();
    this.save.emit({ ...values, name: values.name.trim(), subtitle: values.subtitle.trim() || null, code: values.code.trim(), branch_id: this.parentId });
  }
}
