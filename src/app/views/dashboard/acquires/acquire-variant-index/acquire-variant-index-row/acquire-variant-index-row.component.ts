import { Component, EventEmitter, Input, OnDestroy, Output, OnInit, TemplateRef, ViewEncapsulation, ElementRef } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faBarcode, faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import { ButtonComponent } from '@shared/components/buttons/button/button.component';
import Swal from 'sweetalert2';
import { debounceTime, Subject, takeUntil } from 'rxjs';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { InputGroupComponent } from '@shared/components/form/input-group/input-group.component';
import { JsonPipe } from '@angular/common';
import { LoadingComponent } from '@shared/components/loading/loading.component';
import { ShopifyImageThumbnailPipe } from '@shared/pipes/shopify/shopify-image-thumbnail.pipe';
import { ShopifyImageMediumPipe } from '@shared/pipes/shopify/shopify-image-medium.pipe';
import { ImagePreviewComponent } from '@shared/components/image-preview/image-preview.component'
import { AcquireVariantService } from '../../acquire.variant.service';

@Component({
  selector: 'tr[app-acquire-variant-index-row]',
  imports: [
    FontAwesomeModule,
    ButtonComponent,
    ReactiveFormsModule,
    InputGroupComponent,
    JsonPipe,
    LoadingComponent,
    ShopifyImageThumbnailPipe,
    ShopifyImageMediumPipe,
    ImagePreviewComponent
  ],
  templateUrl: './acquire-variant-index-row.component.html',
  styleUrl: './acquire-variant-index-row.component.scss',
  encapsulation: ViewEncapsulation.None

})
export class AcquireVariantIndexRowComponent implements OnDestroy, OnInit {

  // import { Subject, takeUntil } from 'rxjs';

  faBarcode = faBarcode;
  faTrash = faTrash;
  faEdit = faEdit;

  form!: FormGroup;

  @Output() emitDeleteAcquireVariantId = new EventEmitter<number>();
  @Output() emitUpdatedQuantity = new EventEmitter<any>();

  modal: any;
  constructor(
    config: NgbModalConfig,
    private modalService: NgbModal,
    private _acquireVariantService: AcquireVariantService,
    private fb: FormBuilder,
    private elRef: ElementRef

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

  @Input() acquire_variant: any = {};

  removeLoading: boolean = false;

  removeAcquireVariant(acquire_variant_id: number, acquire_id: number) {


    Swal.fire({
      title: '¿Estás seguro?',
      text: "No podrás deshacer esta acción",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'No, cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        // Acción para eliminar el elemento

        this.removeLoading = true;

        this._acquireVariantService.setAcquireId(acquire_id);

        this._acquireVariantService.destroy(acquire_variant_id).pipe(takeUntil(this.destroy$)).subscribe({

          next: (resp: any) => {

            console.log(resp);
            this.removeLoading = false;
            this.emitDeleteAcquireVariantId.emit(acquire_variant_id);

            Swal.fire(
              'Eliminado!',
              'El elemento ha sido eliminado.',
              'success'
            );

          },

          error: (error: any) => {
            this.loading = false;
            Swal.fire('Error', 'Ocurrió un problema al eliminar el registro. Inténtalo nuevamente.', 'error');
            console.error(error);
          },

        });


      }
    });




    // Aquí puedes agregar la lógica para eliminar el variante del acquire_variants
  }



  editAcquireVariant(content: TemplateRef<any>, acquire_variant_id: number, acquire_id: number) {
    this.modal = this.modalService.open(content, { centered: true, size: 'xl' });

  }

  quantitySubject: Subject<any> = new Subject();

  originalQuantity: any;


  ngOnInit(): void {

    this.form = this.fb.group({
      quantity: [''],
      price: [''],
    });

    this.form.patchValue({
      quantity: this.acquire_variant.quantity,
      price: this.acquire_variant.price
    });


    this.quantitySubject
      .pipe(debounceTime(500))
      .subscribe(data => {
        this.update();
      });


    //Para actualizar el valor original de quantity cuando el control no esté sucio (dirty) y
    // const control = this.form.get('quantity');

    this.originalQuantity = this.form.get('quantity')?.value;

    // this.form.get('quantity')?.valueChanges.subscribe(value => {

    //   this.originalQuantity = control?.dirty ? this.originalQuantity : value;
    //     console.log('Valor de quantity:', value);

    // });

  }

  closeModal() {
    this.modal.close();
  }

  loading: boolean = false;

  update() {

    console.log(this.form.value);


    console.log("click en update");

    // const currentValue = this.form.get('quantity')?.value;

    // if (currentValue == this.originalQuantity) {
    //   // this.originalQuantity = currentValue;
    //   return;
    // }

    this.loading = true;

    this._acquireVariantService.setAcquireId(this.acquire_variant.acquire_id);

    this._acquireVariantService.update(this.acquire_variant.id, this.form.value).pipe(takeUntil(this.destroy$)).subscribe({

      next: (resp: any) => {
        console.log(resp);
        this.loading = false;
        // this.acquire_variant = resp.data;
        this.emitUpdatedQuantity.emit(resp.data); //emite el acquire_variant actualizado
      },

      error: (error: any) => {
        // Swal.fire('Error', 'Debe especificar una cantidad.', 'error');
        console.error(error);
        this.loading = false;
        this.emitUpdatedQuantity.emit(false);
      },

    });

  }

  getUpdateQuantity() {

    this.quantitySubject.next(this.form.value);

  }

}

