import { Component, EventEmitter, Input, OnDestroy, Output, OnInit, TemplateRef, ViewEncapsulation, ElementRef } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faBarcode, faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import { ButtonComponent } from '@shared/components/buttons/button/button.component';
import { ManufactureVariantService } from '../manufactureVariant.service';
import Swal from 'sweetalert2';
import { debounceTime, Subject, takeUntil } from 'rxjs';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { InputGroupComponent } from '@shared/components/form/input-group/input-group.component';
import { JsonPipe } from '@angular/common';
import { LoadingComponent } from '@shared/components/loading/loading.component';
import { Fancybox } from '@fancyapps/ui';
import { ShopifyImageThumbnailPipe } from '@shared/pipes/shopify/shopify-image-thumbnail.pipe';
import { ShopifyImageMediumPipe } from '@shared/pipes/shopify/shopify-image-medium.pipe';

@Component({
  selector: 'tr[app-manufacture-variant-row]',
  imports: [
    FontAwesomeModule,
    ButtonComponent,
    ReactiveFormsModule,
    InputGroupComponent,
    JsonPipe,
    LoadingComponent,
    ShopifyImageThumbnailPipe,
    ShopifyImageMediumPipe
  ],
  templateUrl: './manufacture-variant-row.component.html',
  styleUrl: './manufacture-variant-row.component.scss',
  encapsulation: ViewEncapsulation.None

})
export class ManufactureVariantRowComponent implements OnDestroy, OnInit {

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

    Fancybox.unbind(this.elRef.nativeElement);
    Fancybox.close();
  }

  @Input() manufacture_variant: any = {};

  removeLoading: boolean = false;

  removeManufactureVariant(manufacture_variant_id: number, manufacture_id: number) {

    this.removeLoading = true;

    this._manufactureVariantService.destroy(manufacture_variant_id, manufacture_id).pipe(takeUntil(this.destroy$)).subscribe({

      next: (resp: any) => {

        console.log(resp);
        this.removeLoading = false;
        this.emitDeleteManufactureVariantId.emit(manufacture_variant_id);

      },

      error: (error: any) => {
        this.loading = false;
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

  originalQuantity: any;


  ngOnInit(): void {

    Fancybox.bind(this.elRef.nativeElement, '[data-fancybox]', {
      // Custom options
    })

    this.form = this.fb.group({
      quantity: [''],
      price: [''],
    });

    this.form.patchValue({
      quantity: this.manufacture_variant.quantity,
      price: this.manufacture_variant.price
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

    this._manufactureVariantService.update(this.manufacture_variant.manufacture_id, this.manufacture_variant.id, this.form.value).pipe(takeUntil(this.destroy$)).subscribe({

      next: (resp: any) => {
        console.log(resp);
        this.loading = false;
        this.emitUpdatedQuantity.emit(resp.data); //emite el manufacture_variant actualizado
      },

      error: (error: any) => {
        Swal.fire('Error', 'Debe especificar una cantidad.', 'error');
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

