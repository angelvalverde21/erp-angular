import { Component, OnDestroy, OnInit, TemplateRef } from '@angular/core';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { LoadingComponent } from '../../../shared/components/loading/loading.component';
import { ProductService } from '../product.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
// import { UploadDropzoneComponent } from '@shared/upload-dropzone/upload-dropzone.component';
import { faPalette, faPenToSquare, faPlus, faRulerCombined, faBarcode } from '@fortawesome/free-solid-svg-icons';
import { ProductEditComponent } from '../product-edit/product-edit.component';
import { Product } from '../../../../interfaces/product.interface';
import { Resp } from '../../../../interfaces/response.interface';
import { Category } from '../../../../interfaces/category.interface';
import { Size } from '../../../../interfaces/size.interface';
import { Brand } from '../../../../interfaces/brand.interface';
import { StoreService } from '../../../stores/store.service';
import { BaseService } from '../../../base.service';
import Swal from 'sweetalert2';
import { Color } from '../../colors/color.interface';
import { DatePipe } from '@angular/common';
import { OptionIndexComponent } from '../options/option-index/option-index.component';
import { VariantIndexComponent } from '../variants/variant-index/variant-index.component';
import { BarcodeIndexComponent } from '../../barcodes/barcode-index/barcode-index.component';
import { ProductPricesComponent } from '../product-prices/product-prices.component';
import { OptionValueDeletion } from '../options/OptionValues/option_value.service';
import { OptionRemoval } from '../options/option.service';

@Component({
  selector: 'app-product-edit-page',
  imports: [
    LoadingComponent,
    ProductEditComponent,
    RouterLink,
    DatePipe,
    OptionIndexComponent,
    VariantIndexComponent,
    BarcodeIndexComponent,
    ProductPricesComponent
  ],
  templateUrl: './product-edit-page.component.html',
  styleUrl: './product-edit-page.component.scss',
})

export class ProductEditPageComponent implements OnInit, OnDestroy {

  product_id: number = 0;
  product!: Product;

  faPlus = faPlus;
  faPenToSquare = faPenToSquare;
  faPalette = faPalette;
  faRulerCombined = faRulerCombined;
  faBarcode = faBarcode;

  constructor(
    private _product: ProductService,
    private route: ActivatedRoute,
    private router: Router,
    private _store: StoreService,
    private _base: BaseService,
    config: NgbModalConfig,
    private modalService: NgbModal,
  ) {

    config.backdrop = 'static';
    config.keyboard = false;

    this.route.params.pipe(takeUntil(this.destroy$)).subscribe(params => {
      this.product_id = params['product_id'];
    });

  }

  has_color: boolean = false;
  has_talla: boolean = false;

  options: any;

  destroy$ = new Subject<void>();

  ngOnDestroy(): void {

    this.destroy$.next();
    this.destroy$.complete();

  }

  loadingProduct: boolean = true;

  ngOnInit(): void {

    // this.brandsInit();
    this.productSetup();
    this.productInit();

    this.options = localStorage.getItem('store') ? JSON.parse(localStorage.getItem('store')!).options_default : [];

  }

  productInit() {

    this.loadingProduct = true;

    this._product.get(this.product_id!).pipe(takeUntil(this.destroy$)).subscribe({

      next: (resp: Resp) => {
        console.log(resp);

        this.product = resp.data;
        this.sizes = this.product.sizes;
        this.loadingProduct = false;

        const options = this.product.options;
      },

      error: (error: any) => {
        if (error.status != 200) {
          this.router.navigate(['404']);
          console.log('404');
        }
        // console.error(error);
        // this.loading = false;
      },

    });

  }

  receiveAttributeCreate() {

  }

  categorySelected(category: Category) {
    this.product.category = category;

  }

  productUpdated(product: Product): void {
    this.product.name = product.name;
    this.product.price = product.price;
    this.product.body = product.body;
  }

  optionValueDeleted(event: OptionValueDeletion): void {
    this.product.options = this.product.options.map(option => option.id === event.option_id
      ? { ...option, option_values: (option.option_values || []).filter((value: any) => value.id !== event.option_value_id) }
      : option);
    const deletedIds = new Set(event.deleted_variant_ids);
    this.product.variants = this.product.variants.filter(variant => !deletedIds.has(variant.id));
    this.product.stock_total = this.product.variants.reduce((total, variant) => total + Number(variant.stock || 0), 0);
  }

  optionBlockRemoved(event: OptionRemoval): void {
    this.product.options = this.product.options.filter(option => option.id !== event.option_id);
    const hiddenIds = new Set(event.hidden_variant_ids);
    this.product.variants = this.product.variants.filter(variant => !hiddenIds.has(variant.id));
    this.product.stock_total = this.product.variants.reduce((total, variant) => total + Number(variant.stock || 0), 0);
  }
  // colorCreate(color: any) {
  //   console.log('Color upload event:', color);
  //   this.product.colors.unshift(color);
  //   // Aquí puedes manejar el evento de carga de color
  //   // Por ejemplo, enviar el color al servidor o procesarlo de alguna manera
  // }

  // reListColors(color_id: number) {
  //   // this.images = this.images.filter((image) => image.id !== id);/
  //   console.log('Re-listing images after deletion of ID:', color_id);
  //   this.product.colors = this.product.colors.filter((color: any) => color.id !== color_id);
  // }

  sizes: Size[] = [];

  receiveSizeCreate(size: Size) {

    console.log(size);
    this.sizes = [...this.sizes, size];

  }

  colors: Color[] = [];

  receiveColorCreate(color: Color) {

    console.log(color);
    // this.colors = [...this.colors, color];

    this.product.colors = [...this.product.colors, color];

  }

  setupLoading: boolean = true;
  setupError = '';

  categories: Category[] = [];
  brands: Brand[] = [];

  productSetup() {

    this.setupLoading = true;
    this.setupError = '';

    this._store.get(this._base.store).pipe(takeUntil(this.destroy$)).subscribe({

      next: (resp: any) => {
        // Swal.fire('Guardado', 'El registro ha sido creado', 'success');
        console.log(resp);
        this.categories = resp.data.categories;
        this.brands = resp.data.brands;
        this.setupLoading = false;
      },

      error: (error: any) => {
        this.setupLoading = false;
        this.setupError = 'No se pudo cargar la configuración del producto. Inténtalo nuevamente.';
        Swal.fire('Error', 'Ocurrió un problema al solicitar la informacion del producto. Inténtalo nuevamente.', 'error');
        console.error(error);
      },

    });
  }

  modal: any;

  closeModal() {
    this.modal.close();
  }

  openVerticallyCentered(content: TemplateRef<any>) {
    this.modal = this.modalService.open(content, { centered: true, size: 'xl' });
  }


}

