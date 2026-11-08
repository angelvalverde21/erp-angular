import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
// import { ButtonComponent } from 'src/app/views/shared/components/buttons/button/button.component';
import { OptionService } from '../option.service'
import { Subject, takeUntil } from 'rxjs';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-option-create',
  imports: [
    ReactiveFormsModule
  ],
  templateUrl: './option-create.component.html',
  styleUrl: './option-create.component.scss'
})
export class OptionCreateComponent {


  @Output() emitOption = new EventEmitter<any>();
  

  @Input() options_init: any;
  form!: FormGroup
  @Input() product_id: number = 0;

  loading: boolean = false;

  option: any;

  constructor(
    private fb: FormBuilder,
    private _option: OptionService
  ) {

  }
  ngOnInit(): void {
    this.formInit();
  }

  formInit() {
    this.form = this.fb.group({
      name: ["", Validators.required]
    });
  }

  create() {
    if (this.loading) return;

    if (!this.form.valid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading = true;

    console.log(this.form.value);


    this._option.store(this.product_id, this.form.value).pipe(takeUntil(this.destroy$)).subscribe({

      next: (resp: any) => {
        // Swal.fire('Guardado', 'El registro ha sido creado', 'success');
        console.log(resp);
        this.option = resp.data;
        this.form.reset({ name: '' });
        this.emitOption.emit(this.option);
        this.loading = false;
      },

      error: (error: any) => {
        Swal.fire('Error', 'Ocurrió un problema al crear. Inténtalo nuevamente.', 'error');
        console.error(error);
        this.loading = false;
      },

    });

  }

  destroy$ = new Subject<void>();

  ngOnDestroy(): void {

    this.destroy$.next();
    this.destroy$.complete();

  }

}
