import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import Swal from 'sweetalert2';
import { InputGroupComponent } from '../../shared/form/input-group/input-group.component';
import {
  faEdit,
  faTags,
  faPlus,
  faIdCard,
  faAddressCard,
} from '@fortawesome/free-solid-svg-icons';
import { ButtonComponent } from '../../shared/components/buttons/button/button.component';
import { JsonPipe } from '@angular/common';
import { LoadingComponent } from '../../shared/components/loading/loading.component';
import { SupplierService } from '../supplier.service';
import { IdentitySelectedComponent } from '../../identities/identity-selected/identity-selected.component';

@Component({
  selector: 'app-supplier-edit',
  imports: [
    ReactiveFormsModule,
    InputGroupComponent,
    ButtonComponent,
    IdentitySelectedComponent,
    JsonPipe,
    LoadingComponent,
  ],
  templateUrl: './supplier-edit.component.html',
  styleUrl: './supplier-edit.component.scss'
})
export class SupplierEditComponent implements OnInit, OnDestroy{

disabledButton: boolean = true;
  loadingIcon: boolean = false;
  form!: FormGroup;
  loading: boolean = true;
  success: boolean = false;

  faEdit = faEdit;
  faTags = faTags;
  faPlus = faPlus;
  faIdCard = faIdCard;
  faAddressCard = faAddressCard;
  units: any[] = [];

  @Input() supplier_id: number = 0;

  supplier: any;

  @Output() emitSupplierCreate = new EventEmitter<any | boolean>();

  private destroy$ = new Subject<void>();

  constructor(private fb: FormBuilder, private _supplier: SupplierService) {}


  private formInit(): void {
    this.form = this.fb.group({
      name: ['', [Validators.required]],
      address: [''],
      email: [''],
      identity_id: [1],
      document_number: [''],
      phone: [''],
    });
  }

  ngOnInit(): void {
    this.formInit();
    this.loadSupplier();

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

  loadSupplier() {
    this._supplier.get(this.supplier_id).pipe(takeUntil(this.destroy$)).subscribe((resp: any) => {
      console.log(resp.data);
      this.form.patchValue(resp.data);
      this.supplier = resp.data;
      //  console.log(this.supplier.category);
      this.loading = false;
    });
  }

  update() {
    console.log('form enviado');
    this.success = false;
    this.disabledButton = true;
    this.loadingIcon = true;
    this._supplier.update(this.supplier_id, this.form.value).subscribe({
      next: (resp: any) => {
        Swal.fire('Guardado', 'El registro ha sido actualizado', 'success');
        this.disabledButton = false;
        this.loadingIcon = false;
        this.success = true;
      },
      error: (error: any) => {
        Swal.fire(
          'Error',
          'Ocurrió un problema al actualizar. Inténtalo nuevamente.',
          'error'
        );
        console.error(error);
      },
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
