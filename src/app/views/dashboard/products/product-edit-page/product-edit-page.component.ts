import { Component, OnDestroy, OnInit, TemplateRef, ViewEncapsulation } from '@angular/core';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { LoadingComponent } from '../../../shared/components/loading/loading.component';
import { ProductService } from '../product.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
// import { UploadDropzoneComponent } from '@shared/upload-dropzone/upload-dropzone.component';
import { faCircleCheck, faPalette, faPenToSquare, faPlus, faRulerCombined, faRulerVertical, faBarcode } from '@fortawesome/free-solid-svg-icons';
import { ProductEditComponent } from '../product-edit/product-edit.component';
import { Product } from '../../../../interfaces/product.interface';
import { Resp } from '../../../../interfaces/response.interface';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { Category } from '../../../../interfaces/category.interface';
import { Size } from '../../../../interfaces/size.interface';
import { ButtonComponent } from '../../../shared/components/buttons/button/button.component';
import { ButtonBackComponent } from '../../../shared/components/buttons/button-back/button-back.component';
import { HeadPageComponent } from "../../../shared/components/head-page/head-page.component";
import { Brand } from '../../../../interfaces/brand.interface';
import { StoreService } from '../../../stores/store.service';
import { BaseService } from '../../../base.service';
import Swal from 'sweetalert2';
import { Color } from '../../colors/color.interface';
import { JsonPipe } from '@angular/common';
import { OptionIndexComponent } from '../options/option-index/option-index.component';
import { NgbAccordionModule } from '@ng-bootstrap/ng-bootstrap';
import { VariantIndexComponent } from '../variants/variant-index/variant-index.component';
import { BarcodeIndexComponent } from '../../barcodes/barcode-index/barcode-index.component';

@Component({
  selector: 'app-product-edit-page',
  imports: [
    LoadingComponent,
    ProductEditComponent,
    FontAwesomeModule,
    ButtonComponent,
    ButtonBackComponent,
    HeadPageComponent,
    JsonPipe,
    OptionIndexComponent,
    NgbAccordionModule,
    VariantIndexComponent,
    BarcodeIndexComponent
  ],
  templateUrl: './product-edit-page.component.html',
  styleUrl: './product-edit-page.component.scss',
  encapsulation: ViewEncapsulation.None
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

    this.route.params.subscribe(params => {
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

  categories: Category[] = [];
  brands: Brand[] = [];

  productSetup() {

    this.setupLoading = true;

    this._store.get(this._base.store).pipe(takeUntil(this.destroy$)).subscribe({

      next: (resp: any) => {
        // Swal.fire('Guardado', 'El registro ha sido creado', 'success');
        console.log(resp);
        this.categories = resp.data.categories;
        this.brands = resp.data.brands;
        this.setupLoading = false;
      },

      error: (error: any) => {
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

