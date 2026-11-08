import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import Swal from 'sweetalert2';
import { OptionValueService } from '../option_value.service';
import { UpperCaseDirective } from '../../../../../../core/directives/only-uppercase.directive';
// import { OptionValueIndexComponent } from '../option-value-index/option-value-index.component';
import { noCommaValidator } from '../../../../../../core/validators/no-coma'

@Component({
  selector: 'app-option-value-create',
  imports: [
    ReactiveFormsModule,
    UpperCaseDirective,
    // OptionValueIndexComponent
    // OptionValueIndexComponent
  ],
  templateUrl: './option-value-create.component.html',
  styleUrl: './option-value-create.component.scss'
})
export class OptionValueCreateComponent implements OnInit {

  @Output() emitOptionValue = new EventEmitter<[]>();

  @Input() option_id: number = 0;
  @Input() existingValues: { value: string }[] = [];
  @Input() options: any[] = [];
  @Input() option_selected: string = "";
  @Input() text_selected: string = "Valor";

  form!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private _option_value: OptionValueService
  ) {

  }

  ngOnInit(): void {
    
    this.formInit();

    console.log(this.options);
    console.log(this.option_selected);


    if (this.option_selected != "") {
      const option = this.options.find((option: any) => option.name === this.option_selected)
      console.log(option);
      this.form.get("option_id")?.setValue(option.id);
    }

    this.form.valueChanges.subscribe(value => {
      console.log(value);
    });

  }

  formInit() {
    this.form = this.fb.group({
      option_id: [this.option_id, Validators.required],
      value: ["", [Validators.required, noCommaValidator, Validators.maxLength(255), (control: AbstractControl) => {
        const value = String(control.value ?? '').trim().toUpperCase();
        if (!value) return { required: true };
        return this.existingValues.some(existing => String(existing.value).trim().toUpperCase() === value)
          ? { duplicate: true } : null;
      }]]
    });
  }

  // get(name: string) {
  //   return this.form?.get(name) ?? null;
  // }

  loading: boolean = false;

  option_value: any;

  create() {
    if (this.loading) return;
    this.form.get('value')?.updateValueAndValidity();
    if (!this.form.valid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading = true;

    const values = { ...this.form.value, value: this.form.value.value.trim() };
    this._option_value.store(null, null, values).pipe(takeUntil(this.destroy$)).subscribe({

      next: (resp: any) => {
        // Swal.fire('Guardado', 'El registro ha sido creado', 'success');
        console.log(resp);
        this.option_value = resp.data;
        this.loading = false;

        if (this.option_selected != null) {

          const keepValue = this.form.get('option_id')?.value;
          this.form.reset({
            option_id: keepValue
          });

        } else {
          this.form.reset();
        }

        this.emitOptionValue.emit(resp.data);
      },

      error: (error: any) => {
        this.loading = false;

        if (error.status === 422 && error.error?.errors?.value) {
          this.form.get('value')?.setErrors({ server: error.error.errors.value.join(' ') });
          this.form.get('value')?.markAsTouched();
          return;
        }

        Swal.fire('Error', 'Ocurrió un problema al crear. Inténtalo nuevamente.', 'error');
        console.error(error);
      },

    });

  }

  destroy$ = new Subject<void>();

  ngOnDestroy(): void {

    this.destroy$.next();
    this.destroy$.complete();

  }

}
