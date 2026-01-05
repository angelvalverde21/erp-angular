import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Form, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputGroupComponent } from '../../../../shared/components/form/input-group/input-group.component';
import { AttributeService } from '../attribute.service'
import { Subject, takeUntil } from 'rxjs';
import Swal from 'sweetalert2';
import { UpperCaseDirective } from "../../../../../core/directives/only-uppercase.directive";
import { ButtonComponent } from "../../../../shared/components/buttons/button/button.component";
import { faPlus } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-attribute-create',
  imports: [
    ReactiveFormsModule,
    CommonModule,
    InputGroupComponent,
    UpperCaseDirective,
    ButtonComponent
  ],
  templateUrl: './attribute-create.component.html',
  styleUrl: './attribute-create.component.scss'
})
export class AttributeCreateComponent implements OnInit {

  form!: FormGroup;
  faPlus = faPlus;

  @Input() attributes_init: any;
  @Input() product_id: number = 0;
  @Output() emitAttribute = new EventEmitter<any>();

  constructor(
    private fb: FormBuilder,
    private _attribute: AttributeService
  ) {

  }
  ngOnInit(): void {
    this.formInit();
  }

  formInit() {
    this.form = this.fb.group({
      name: ['', Validators.required],
      value: ['', Validators.required]
    });
  }

  attribute: any;

  loading: boolean = false;

  create() {

    if (!this.form.valid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading = true;

    this._attribute.store(this.product_id, this.form.value).pipe(takeUntil(this.destroy$)).subscribe({

      next: (resp: any) => {
        Swal.fire('Guardado', 'El registro ha sido creado', 'success');
        console.log(resp);
        this.attribute = resp.data;
        this.loading = false;
        this.emitAttribute.emit(this.attribute);
        this.form.reset();
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
