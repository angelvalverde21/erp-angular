import { Component, EventEmitter, Output } from '@angular/core';
import { faPlus, faPenToSquare } from '@fortawesome/free-solid-svg-icons';
import { InputGroupComponent } from '../../shared/form/input-group/input-group.component';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { ButtonComponent } from '../../shared/components/buttons/button/button.component';
import Swal from 'sweetalert2';
import { BrandService } from '../brand.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-brand-create',
  imports: [ButtonComponent, InputGroupComponent, ReactiveFormsModule],
  templateUrl: './brand-create.component.html',
  styleUrl: './brand-create.component.scss',
})
export class BrandCreateComponent {
  faPlus = faPlus;
  faPenToSquare = faPenToSquare;

  loading: boolean = false;
  loadingIcon: boolean = false;
  disabledButton: boolean = true;

  @Output() emitBrandCreate = new EventEmitter<any[] | boolean>();

  constructor(
    private fb: FormBuilder,
    private _brand: BrandService,
    private _router: Router
  ) {}

  ngOnInit(): void {
    this.formInit();

    this.form.statusChanges.subscribe((status) => {
      if (status === 'VALID') {
        this.disabledButton = false;
      } else {
        this.disabledButton = true;
      }
    });
  }

  form!: FormGroup;

  private formInit(): void {
    this.form = this.fb.group({
      name: ['', [Validators.required]],
    });
  }

  success: boolean = false;

  create() {
    this.success = false;
    this.loadingIcon = true;
    this.disabledButton = true;

    if (this.form.invalid) {
      Swal.fire(
        'Error',
        'Por favor completa todos los campos requeridos.',
        'error'
      );
      return;
    } else {
      this._brand.store(this.form.getRawValue()).subscribe({
        next: (resp: any) => {
          Swal.fire('Guardado', 'El registro ha sido creado', 'success');
          console.log(resp);

          this.success = true;
          this.loadingIcon = false;

          this.emitBrandCreate.emit(resp.data);
        },

        error: (error: any) => {
          Swal.fire(
            'Error',
            'Ocurrió un problema al crear. Inténtalo nuevamente.',
            'error'
          );
          console.error(error);
        },
      });
    }
  }
}
