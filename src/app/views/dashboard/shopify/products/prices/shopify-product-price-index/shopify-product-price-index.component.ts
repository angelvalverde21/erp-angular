import { Component, Input, OnDestroy, OnInit } from '@angular/core';
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
import { Subject, takeUntil } from 'rxjs';
import Swal from 'sweetalert2';
import { ShopifyImageThumbnailPipe } from '../../../../../shared/pipes/shopify/shopify-image-thumbnail.pipe';

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
    ShopifyImageThumbnailPipe
  ],
  templateUrl: './shopify-product-price-index.component.html',
  styleUrl: './shopify-product-price-index.component.scss'
})
export class ShopifyProductPriceIndexComponent {

  faSync = faSync;
  faShopify = faShopify;
  @Input() products: any[] = [];

  current_accordion: string = "";
  current_product_id: number = 0;

  variants: any;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private _productShopify: ShopifyProductService
  ) {

  }

  getProductId(id: number = 0) {
    this.router.navigate([id], { relativeTo: this.route });
  }

  expandedId: any = null;

  onAccordionShown(value: any) {
    this.expandedId = value; // ID del panel abierto
    console.log(value);
    // console.log(this.expandedId);
    this.current_accordion = value;
    // console.log(this.current_accordion);
  }

  onAccordionLast(value: any) {

    console.log('----------');

  }

  onAccordionHidden(item: any) {
    // Si quieres permitir abrir solo 1 a la vez:
    this.expandedId = null;
    console.log('onAccordionHidden');
    this.current_accordion = "";
  }

  productSelectedId(product_id: number = 0) {
    this.current_product_id = product_id;
  }

  productSelected(product: any) {

    this.variants = product.variants;

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

  receivePrices(setPrice: any, product: any) {

    // Swal.fire({
    //   title: 'Espere...',
    //   html: 'Guardando',
    //   allowOutsideClick: false,
    //   didOpen: () => {
    //     Swal.showLoading();
    //   }
    // })

    // Copiamos las variantes para evitar mutar el array original
    this.variants = [...product.variants];

    // Sobrescribir TODAS las variantes con setPrice
    this.variants = this.variants.map((variant: any) => {
      return {
        ...variant,
        ...setPrice
      };
    });

    // Forzar nueva referencia (por si Angular necesita refrescar)
    this.variants = [...this.variants];

    console.log(this.variants);

    // 2. Reemplazar el producto dentro de products (sin mutar arrays)
    //Se usa para reemplazar los precios del array que vienen de la api
    this.products = this.products.map((p: any) =>
      p.id === product.id
        ? { ...p, variants: this.variants }   // producto actualizado
        : p                                     // los demás iguales
    );

    console.log(setPrice);

    //guardando los precios

    this._productShopify.updatePrices(this.variants).pipe(takeUntil(this.destroy$)).subscribe({

      next: (resp: any) => {
        // Swal.close()
        // Swal.fire('Guardado', 'El registro ha sido creado', 'success');
        console.log(resp);
        // this.product_productShopifys = resp.data;
        // this.loading = false;
      },

      error: (error: any) => {
        Swal.fire('Error', 'Ocurrió un problema al guardar los precios, intentelo de nuevo', 'error');
        console.error(error);
      },

    });

    // this.variants.map((variant:any) => variant = this.item);

  }

  receivePrice(price: any) {

    this._productShopify.updatePrice(price).pipe(takeUntil(this.destroy$)).subscribe({

      next: (resp: any) => {
        Swal.fire('Guardado', 'El registro ha sido creado', 'success');
        console.log(resp);
        console.log("respuesta recibida del servidor");
        // this.product_productShopifys = resp.data;
        // this.loading = false;
      },

      error: (error: any) => {
        Swal.fire('Error', 'Ocurrió un problema al guardar los precios, intentelo de nuevo', 'error');
        console.error(error);
      },

    });

  }

  destroy$ = new Subject<void>();

  ngOnDestroy(): void {

    this.destroy$.next();
    this.destroy$.complete();

  }

  syncPrice(price_key: any) {

    console.log(price_key);
    

    const price = {
      "product_id": "gid://shopify/Product/9066191323360",
      "variants": [
        {
          "variant_id": "gid://shopify/ProductVariant/48124316057824",
          "price": "129.90",
          "compareAtPrice": "159.90"
        }
      ]
    }

    console.log(price);
 
    this._productShopify.syncPrice(price).pipe(takeUntil(this.destroy$)).subscribe({

      next: (resp: any) => {
        Swal.fire('Guardado', 'Sincronizacion correcta', 'success');
        console.log(resp);
        // this.loading = false;
      },

      error: (error: any) => {
        Swal.fire('Error', 'Ocurrió al sincronizar el precio. Inténtalo nuevamente.', 'error');
        console.error(error);
      },

    });

  }

  syncPrices(price_key: any) {

    console.log(price_key);
 
    this._productShopify.syncPrices(price_key).pipe(takeUntil(this.destroy$)).subscribe({

      next: (resp: any) => {
        Swal.fire('Guardado', 'Sincronizacion correcta', 'success');
        console.log(resp);
        // this.loading = false;
      },

      error: (error: any) => {
        Swal.fire('Error', 'Ocurrió al sincronizar el precio. Inténtalo nuevamente.', 'error');
        console.error(error);
      },

    });

  }

}
