import { Component, EventEmitter, Input, OnDestroy, Output, OnInit, TemplateRef, ViewEncapsulation } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faBarcode, faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import { ButtonComponent } from 'src/app/views/shared/components/buttons/button/button.component';
import { ManufactureVariantService } from '../manufactureVariant.service';
import Swal from 'sweetalert2';
import { debounceTime, Subject, takeUntil } from 'rxjs';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { InputGroupComponent } from 'src/app/views/shared/components/form/input-group/input-group.component';
import { JsonPipe } from '@angular/common';
import { LoadingComponent } from 'src/app/views/shared/components/loading/loading.component';


@Component({
  selector: 'tr[app-manufacture-variant-row]',
  imports: [
    FontAwesomeModule,
    ButtonComponent,
    ReactiveFormsModule,
    InputGroupComponent,
    JsonPipe,
    LoadingComponent
  ],
  templateUrl: './manufacture-variant-row.component.html',
  styleUrl: './manufacture-variant-row.component.scss',
  encapsulation: ViewEncapsulation.None

})
export class ManufactureVariantRowComponent implements OnDestroy {

  // import { Subject, takeUntil } from 'rxjs';

  faBarcode = faBarcode;
  faTrash = faTrash;
  faEdit = faEdit;

  form!: FormGroup;

  @Output() emitDeleteManufactureVariantId = new EventEmitter<number>();
  @Output() emitUpdatedQuantity = new EventEmitter<any>();

  modal: any;
  constructor(
    config: NgbModalConfig,
    private modalService: NgbModal,
    private _manufactureVariantService: ManufactureVariantService,
    private fb: FormBuilder

  ) {
    // customize default values of modals used by this component tree
    config.backdrop = 'static';
    config.keyboard = false;
  }
  destroy$ = new Subject<void>();

  ngOnDestroy(): void {

    this.destroy$.next();
    this.destroy$.complete();


  }

  @Input() manufacture_variant: any = {};

  removeVariant(manufacture_variant_id: number, manufacture_id: number) {

    Swal.fire({
      title: 'Espere...',
      html: 'Procesando solicitud',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    })

    this._manufactureVariantService.destroy(manufacture_variant_id, manufacture_id).pipe(takeUntil(this.destroy$)).subscribe({

      next: (resp: any) => {
        Swal.fire('Guardado', 'El registro ha sido creado', 'success');
        console.log(resp);

        Swal.fire({
          icon: 'success',
          title: 'Correcto',
          text: 'La operacion ha sido ejecutada correctamente',
          confirmButtonText: 'OK',
          showConfirmButton: true
        })

        this.emitDeleteManufactureVariantId.emit(manufacture_variant_id);

      },

      error: (error: any) => {
        Swal.fire('Error', 'Ocurrió un problema al eliminar el registro. Inténtalo nuevamente.', 'error');
        console.error(error);
      },

    });

    // Aquí puedes agregar la lógica para eliminar el variante del manufacture_variants
  }

  editManufactureVariant(content: TemplateRef<any>, manufacture_variant_id: number, manufacture_id: number) {
    this.modal = this.modalService.open(content, { centered: true, size: 'xl' });

  }

  quantitySubject: Subject<any> = new Subject();

  ngOnInit(): void {

    this.form = this.fb.group({
      quantity: [''],
    });

    this.form.patchValue({
      quantity: this.manufacture_variant.quantity
    });

    this.quantitySubject
      .pipe(debounceTime(500))
      .subscribe(data => {
        this.updateQuantity();
      });

  }

  closeModal() {
    this.modal.close();
  }

  loading: boolean = false;

  updateQuantity(){

    this.loading = true;

    this._manufactureVariantService.updateQuantity(this.manufacture_variant.manufacture_id, this.manufacture_variant.id, this.form.value).pipe(takeUntil(this.destroy$)).subscribe({

      next: (resp: any) => {
        console.log(resp);
        this.loading = false;
        this.emitUpdatedQuantity.emit(resp.data); //emite el manufacture_variant actualizado
      },
    
      error: (error: any) => {
        Swal.fire('Error','Debe especificar una cantidad.','error');
        console.error(error);
        this.loading = false;
        this.emitUpdatedQuantity.emit(false);
      },
    
    });

  }

  getUpdateQuantity(){

    this.quantitySubject.next(this.form.value);

  }

}

