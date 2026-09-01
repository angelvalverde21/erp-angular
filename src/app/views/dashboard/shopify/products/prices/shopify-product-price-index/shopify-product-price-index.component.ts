import { Component, Input, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DateShopifyPipe } from '../../../../../shared/pipes/date-shopify.pipe';
import { InputGroupComponent } from '../../../../../shared/components/form/input-group/input-group.component'
import { NgbAccordionModule } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule, JsonPipe } from '@angular/common';
import { EditPriceCascadeComponent } from '../../shared/edit-price-cascade/edit-price-cascade.component';
import { EditPriceComponent } from '../../shared/edit-price/edit-price.component'
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faSync } from '@fortawesome/free-solid-svg-icons';
import { faShopify } from '@fortawesome/free-brands-svg-icons';
import { ShopifyProductService } from '../../shopify.product.service';
import { debounceTime, map, merge, Subject, Subscription, switchMap, takeUntil, tap } from 'rxjs';
import Swal from 'sweetalert2';
import { ShopifyImageThumbnailPipe } from '../../../../../shared/pipes/shopify/shopify-image-thumbnail.pipe';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ShopifyPriceIndexRowComponent } from './shopify-price-index-row/shopify-price-index-row.component';
import { TwoDecimalsDirective } from 'src/app/core/directives/two-decimals.directive';
import { LoadingComponent } from 'src/app/views/shared/components/loading/loading.component';

@Component({
  selector: 'app-shopify-product-price-index',
  imports: [
    DateShopifyPipe,
    InputGroupComponent,
    NgbAccordionModule,
    JsonPipe,
    CommonModule,
    EditPriceCascadeComponent,
    EditPriceComponent,
    FontAwesomeModule,
    ShopifyImageThumbnailPipe,
    ReactiveFormsModule,
    ShopifyPriceIndexRowComponent,
    TwoDecimalsDirective,
    LoadingComponent
  ],
  templateUrl: './shopify-product-price-index.component.html',
  styleUrl: './shopify-product-price-index.component.scss'
})
export class ShopifyProductPriceIndexComponent implements OnInit, OnDestroy {

  faSync = faSync;
  faShopify = faShopify;

  @Input() head: boolean = false;

  @Input() products: any[] = [];

  form!: FormGroup;

  current_accordion: string = "";
  current_product_id: number = 0;

  variants: any;

  // price_keys = [
  //   'price_etiqueta',
  //   'price_oferta',
  //   'price_sale',
  //   'price_feria',
  //   'price_wholesaler',
  //   'price_live',
  //   'price_blackfriday'
  // ] as const;

  subscription!: Subscription;

  ngOnInit() {

    console.log('Se inicia con:', this.head);
    this.formInit();
    console.log(this.products);

    this.listenPriceChanges();
  }

  ngOnChanges(changes: SimpleChanges) {
    console.log('Los cambios entrantes son:', changes['head']);
  }

  loading: boolean = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private _productShopify: ShopifyProductService,
    private fb: FormBuilder,
    private _shopifyProduct: ShopifyProductService,
  ) {

  }

  //escuchas los cambios de la cabercera para controlar el formulario de precios masivos
  listenPriceChanges(): void {

    const observables = this.price_keys.map(field =>
      this.form.get(field)!.valueChanges.pipe(
        map(value => ({ field, value }))
      )
    );

    this.subscription = merge(...observables).pipe(
      debounceTime(300),

      tap(({ field, value }) => {
        console.log(`Campo ${field}:`, value);

        this.products = this.products.map(product => ({
          ...product,
          variants: product.variants.map((variant: any) => ({
            ...variant,
            [field]: value
          }))
        }));

        console.log('Productos actualizados:', this.products);

        this.loading = true;
        this.form.disable({ emitEvent: false }); // Evita que el cambio de estado del formulario dispare eventos adicionales y por ende llamadas al servidor inncesarias
      }),

      //Evita hacer múltiples llamadas a la API mientras el usuario sigue editando los precios
      switchMap(() =>
        this._shopifyProduct.updatePrices(this.products)
      ),

      takeUntil(this.destroy$)

    ).subscribe({
      next: (resp: any) => {
        console.log(resp);
        this.form.enable({ emitEvent: false }); // Evita que el cambio de estado del formulario dispare eventos adicionales y por ende llamadas al servidor inncesarias
        this.loading = false;
      },

      error: (error: any) => {
        Swal.fire('Error', 'Ocurrió un problema al crear. Inténtalo nuevamente.', 'error');
        console.error(error);
        this.form.enable();
        this.loading = false;
      }
    });
  }

  formInit(): void {
    const group: any = {};

    this.price_keys.forEach(field => {
      group[field] = [''];
    });

    this.form = this.fb.group(group);
  }

  price_keys = [
    'price_etiqueta',
    'price_oferta',
    'price_sale',
    'price_feria',
    'price_wholesaler',
    'price_live',
    'price_blackfriday'
  ];

  item: any;

  new_variant: any;

  priceName(value: any) {
    const split = value.split("_");
    return split[1];
  }

  setVariantDefault: any;

  destroy$ = new Subject<void>();

  ngOnDestroy(): void {

    this.subscription?.unsubscribe();

    this.destroy$.next();
    this.destroy$.complete();

  }

  syncPrices(price_key: any) {

    Swal.fire({
      title: '¿Confirmar sincronización?',
      text: 'Se sincronizarán los precios con Shopify',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, sincronizar',
      cancelButtonText: 'Cancelar',
      reverseButtons: true,
    }).then((result) => {

      if (!result.isConfirmed) {
        return;
      }

      // 🔄 Loading
      Swal.fire({
        title: 'Espere...',
        html: 'Sincronizando precios',
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        }
      });

      this._productShopify
        .syncPrices(price_key)
        .pipe(takeUntil(this.destroy$))
        .subscribe({

          next: (resp: any) => {
            Swal.fire({
              icon: 'success',
              title: 'Correcto',
              text: 'Sincronización completada',
            });

            console.log(resp);
          },

          error: (error: any) => {
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'Ocurrió un error al sincronizar los precios. Inténtalo nuevamente.',
            });

            console.error(error);
          },

        });

    });

  }


}
