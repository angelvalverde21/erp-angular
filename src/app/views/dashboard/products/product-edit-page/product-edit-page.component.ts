import { Component, OnDestroy, OnInit } from '@angular/core';
import { LoadingComponent } from '../../shared/components/loading/loading.component';
import {
  FormBuilder,
} from '@angular/forms';
import { ProductService } from '../product.service';
import { ActivatedRoute } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
// import { UploadDropzoneComponent } from '@shared/upload-dropzone/upload-dropzone.component';
import { faPenToSquare } from '@fortawesome/free-solid-svg-icons';
import { FormSearchComponent } from '../../shared/components/form/form-search/form-search.component';
import { ProductEditComponent } from '../product-edit/product-edit.component';
import { Product } from '../../../../interfaces/product.interface';
import { Resp } from '../../../../interfaces/response.interface';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { Category } from '../../../../interfaces/category.interface';
import { SizeCreateComponent } from '../../sizes/size-create/size-create.component';
import { SizeIndexComponent } from '../../sizes/size-index/size-index.component';
import { GalleryComponent } from '../../shared/components/gallery/gallery.component';
import { Size } from '../../../../interfaces/size.interface';

import { AttributeIndexComponent } from '../../attributes/attribute-index/attribute-index.component';
import { AttributeValueCreateComponent } from '../../attributes/attribute-value-create/attribute-value-create.component';
import { ColorIndexComponent } from '../../colors/color-index/color-index.component';

@Component({
  selector: 'app-product-edit-page',
  imports: [
    LoadingComponent,
    FormSearchComponent,
    ProductEditComponent,
    FontAwesomeModule,
    GalleryComponent,
    AttributeIndexComponent,
    AttributeValueCreateComponent,
    SizeCreateComponent,
    SizeIndexComponent,
    ColorIndexComponent,

  ],
  templateUrl: './product-edit-page.component.html',
  styleUrl: './product-edit-page.component.scss'
})

export class ProductEditPageComponent implements OnInit, OnDestroy {

  product_id: number = 0;
  product!: Product;

  faPenToSquare = faPenToSquare;

  constructor(private _product: ProductService, private route: ActivatedRoute) {

    this.route.params.subscribe(params => {
      this.product_id = params['product_id'];
    });

  }

  destroy$ = new Subject<void>();

  ngOnDestroy(): void {

    this.destroy$.next();
    this.destroy$.complete();

  }

  loading: boolean = true;

  ngOnInit(): void {

    // this.brandsInit();

    this._product.get(this.product_id!).pipe(takeUntil(this.destroy$)).subscribe({

      next: (resp: Resp) => {
        console.log(resp);
        this.product = resp.data;
        this.sizes = this.product.sizes;
        this.loading = false;
      },

      error: (error: any) => {
        console.error(error);
        this.loading = false;
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


}
