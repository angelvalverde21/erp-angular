import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import Swal from 'sweetalert2';
import { SupplierService } from '../supplier.service';
import { InputGroupComponent } from '../../../shared/form/input-group/input-group.component';
import { faEdit,faTags, faPlus, faIdCard, faAddressCard } from '@fortawesome/free-solid-svg-icons';
import { ButtonComponent } from '../../../shared/components/buttons/button/button.component';


@Component({
  selector: 'app-supplier-create',
  imports: [ReactiveFormsModule, InputGroupComponent, ButtonComponent],
  templateUrl: './supplier-create.component.html',
  styleUrl: './supplier-create.component.scss',
})
export class SupplierCreateComponent implements OnInit, OnDestroy {
  disabledButton: boolean = true;
  loadingIcon: boolean = false;
  form!: FormGroup;
  loading: boolean = false;
  success: boolean = false;

  faEdit = faEdit;
  faTags = faTags;
  faPlus = faPlus;
  faIdCard = faIdCard;
  faAddressCard = faAddressCard;

  @Output() emitSupplierCreate = new EventEmitter<any | boolean>();
  private destroy$ = new Subject<void>();

  constructor(private fb: FormBuilder, private _supplier: SupplierService) {}

  ngOnInit(): void {
    this.formInit();

    // this.initBrands();
    // this.initCategories();

    this.form.statusChanges.subscribe((status) => {
      console.log(status);

      if (status === 'VALID') {
        this.disabledButton = false;
      } else {
        this.disabledButton = true;
      }
    });

    //recibir cambios del categoria
  }

  private formInit(): void {
    this.form = this.fb.group({
      name: ['', [Validators.required]],
      address: [''],
      email: [''],
      identity_id: [''],
      document_number: [''],
      phone: [''],
    });
  }

  create() {
    this.loadingIcon = true;
    this.disabledButton = true;

    this.success = false;
    // console.log(this.form.value);

    this._supplier
      .store(this.form.value)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (resp: any) => {
          Swal.fire('Guardado', 'El registro ha sido creado', 'success');
          this.success = true;
          this.form.reset();
          this.disabledButton = true;
          this.loadingIcon = false;
          // Emitimos los datos creados
          this.emitSupplierCreate.emit(resp.data);
        },
        error: (error: any) => {
          Swal.fire(
            'Error',
            'Ocurrió un problema al crear. Inténtalo nuevamente.',
            'error'
          );
          this.disabledButton = true;
          this.loadingIcon = false;
          // Emitimos false para indicar fallo
          this.emitSupplierCreate.emit(false);
          console.error(error);
        },
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
