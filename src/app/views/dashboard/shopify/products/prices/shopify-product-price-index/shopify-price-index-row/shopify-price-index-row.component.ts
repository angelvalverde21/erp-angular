import { CommonModule, JsonPipe } from '@angular/common';
import { ChangeDetectorRef, Component, ElementRef, Input, OnChanges, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Product } from 'src/app/interfaces/product.interface';
import { ShopifyImageThumbnailPipe } from '@shared/pipes/shopify/shopify-image-thumbnail.pipe';
import { TwoDecimalsDirective } from '../../../../../../../core/directives/two-decimals.directive';
import { ButtonSaveComponent } from '@shared/components/buttons/button-save/button-save.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faCheck, faSync, faSave } from '@fortawesome/free-solid-svg-icons';
import { ShopifyProductService } from '../../../shopify.product.service';
import { debounceTime, Subject, takeUntil } from 'rxjs';
import Swal from 'sweetalert2';
import { LoadingComponent } from '@shared/components/loading/loading.component';
import { Fancybox } from '@fancyapps/ui';
import { ShopifyImageLargePipe } from '@shared/pipes/shopify/shopify-image-large.pipe';
import { ShopifyImageMediumPipe } from '@shared/pipes/shopify/shopify-image-medium.pipe';
import { DateShopifyPipe } from '@shared/pipes/date-shopify.pipe';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'tr[app-shopify-price-index-row]',
  imports: [
    ShopifyImageThumbnailPipe,
    ShopifyImageLargePipe,
    ShopifyImageMediumPipe,
    ReactiveFormsModule,
    JsonPipe,
    TwoDecimalsDirective,
    ButtonSaveComponent,
    FontAwesomeModule,
    LoadingComponent,
    DateShopifyPipe,
    CommonModule,
    NgbTooltipModule
  ],
  templateUrl: './shopify-price-index-row.component.html',
  styleUrl: './shopify-price-index-row.component.scss'
})
export class ShopifyPriceIndexRowComponent implements OnInit, OnDestroy, OnChanges {

  @Input() product: any;
  @Input() head: boolean = false;
  // @Input() price_keys: any;
  faCheck = faCheck;
  faSync = faSync;
  faSave = faSave;

  @Input() price_keys: string[] = []; 

  form!: FormGroup

  sync_status = false;

  variant: any;

  loading: boolean = false;

  date: Date = new Date();

  constructor(
    private fb: FormBuilder,
    private _shopifyProduct: ShopifyProductService,
    private elRef: ElementRef,
    private cdr: ChangeDetectorRef
  ) {

  }

  ngOnChanges() {
    
    this.cdr.markForCheck();
    console.log("hola ngOnChanges", this.product);

    if(this.head){
      this.formInit();
    }

  }

  ngOnInit(): void {

    this.sync_status = this.product.sync_status;
    this.date = this.product.variants[0].updated_at;

    this.formInit();
    // this.form.patchValue(this.product);

    this.priceSubject
      .pipe(debounceTime(500))
      .subscribe(data => {
        this.savePrice(data);
      });

    Fancybox.bind(this.elRef.nativeElement, '[data-fancybox]', {
      // Custom options
    })

  }

  private priceSubject = new Subject<object>();

  formInit(): void {

    this.variant = this.product.variants[0];

    // Crear el form dinámicamente
    const group: any = {};
    this.price_keys.forEach(field => {
      group[field] = [''];
    });

    this.form = this.fb.group(group);

    this.loadPrices();

  }

  loadPrices(){
    // Patch dinámico desde variant
    const values: any = {};
    this.price_keys.forEach(field => {
      values[field] = this.variant?.[field];
    });

    this.form.patchValue(values);
  }

  getSavePrice() {
    this.priceSubject.next(this.form.value);
  }

  savePrice(data: any = this.form.value): void {

    this.loading = true;

    console.log('savePrice', this.product.id);

    this._shopifyProduct.updateProductPrice(this.product.id, data).pipe(takeUntil(this.destroy$)).subscribe({

      next: (resp: any) => {
        // Swal.fire('Guardado', 'El registro ha sido creado', 'success');
        console.log(resp);
        const variants = resp.data;
        this.date = variants[0].updated_at;
        this.loading = false;
      },

      error: (error: any) => {
        Swal.fire('Error', 'Ocurrió un problema actualizar el precio.', 'error');
        console.error(error);
        this.loading = false;
      },

    });
  }

  syncProductPrices() {


  }

  destroy$ = new Subject<void>();

  ngOnDestroy(): void {

    this.destroy$.next();
    this.destroy$.complete();

    Fancybox.unbind(this.elRef.nativeElement);
    Fancybox.close();
  }

  setSyncStatus() {

    this.sync_status = !this.sync_status;
    console.log(this.sync_status);

    this._shopifyProduct.updateProductSyncStatus(this.product.id, this.sync_status).pipe(takeUntil(this.destroy$)).subscribe({

      next: (resp: any) => {

        console.log(resp);

        this.sync_status = resp.data.sync_status;

      },

      error: (error: any) => {
        this.sync_status = !this.sync_status; //vuelve a su estado anterior
        Swal.fire('Error', 'Ocurrió un problema al actualizar el estado de sincronización.', 'error');
        console.error(error);
      },

    });
  }



}
