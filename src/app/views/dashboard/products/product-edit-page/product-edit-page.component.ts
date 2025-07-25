import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { LoadingComponent } from '../../shared/components/loading/loading.component';
import { 
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators
 } from '@angular/forms';
import { ProductService } from '../product.service';
import { CategoryService } from '../../categories/category.service';
import { ButtonComponent } from "../../shared/components/buttons/button/button.component";
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { GalleryComponent } from '../../shared/components/gallery/gallery.component';
// import { UploadDropzoneComponent } from '@shared/upload-dropzone/upload-dropzone.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faPenToSquare, faGear, faSave, faShirt, faTags } from '@fortawesome/free-solid-svg-icons';
import { faImage, faCircleCheck } from '@fortawesome/free-regular-svg-icons';

import { InputGroupComponent } from '../../shared/form/input-group/input-group.component';
import { NgbAccordionModule } from '@ng-bootstrap/ng-bootstrap';
import { ButtonAddComponent } from '../../shared/components/buttons/button-add/button-add.component';
import { OptionsComponent } from './options/options.component';
import { FormSearchComponent } from '../../shared/form/form-search/form-search.component';
import { ProductColorComponent } from './product-color/product-color.component';
import { ButtonAddColorComponent } from '../../shared/components/buttons/button-add-color/button-add-color.component';

@Component({
  selector: 'app-product-edit-page',
  imports: [
    LoadingComponent, 
    InputGroupComponent,
    ButtonComponent, 
    CommonModule, 
    ReactiveFormsModule,
    GalleryComponent,
    NgbAccordionModule,
    FontAwesomeModule,
    ButtonAddComponent,
    OptionsComponent,
    ProductColorComponent,
    FormSearchComponent,
    ButtonAddColorComponent,
    ],
  templateUrl: './product-edit-page.component.html',
  styleUrl: './product-edit-page.component.scss'
})
export class ProductEditPageComponent implements OnInit, OnDestroy {

  faPenToSquare = faPenToSquare;
  faImage = faImage;
  faGear = faGear;
  faSave = faSave;
  faShirt = faShirt;
  faCircleCheck = faCircleCheck;
  faTags = faTags;

  items = ['First', 'Second', 'Third'];
  
  constructor(private fb: FormBuilder, private _product: ProductService, private _category: CategoryService, private route: ActivatedRoute) {
    this.route.params.subscribe(params => {
      this.product_id = params['product_id'];
    });
  }

  categories: any[] = [];
  loadingSubcategories: boolean = true;
  disabledButton: boolean = true;
  loadingIcon: boolean = false;
  nameControl = new FormControl('');
  product_id: number | null = null;
  productSubscription! : Subscription;
  
  @Input() user_id: number | null = null;
  form!: FormGroup;
  loading: boolean = true;
  success: boolean = false;
  product: any;

  ngOnInit(): void {

    this.formInit();
    this.formLoad();

    this.productSubscription = this._product.get(this.product_id).subscribe((resp: any) => {
      console.log(resp.data);  
      this.form.patchValue(resp.data);
      this.product = resp.data;
      this.loading = false;
    });

    this.form.statusChanges.subscribe(status => {

      console.log(status);

      if (status === 'VALID') {
        this.disabledButton = false;
      }else{
        this.disabledButton = true;
      }
    });

    //recibir cambios del categoria

  }

  private formLoad() {
    
  }

  update() {

    console.log('form enviado');
    this.success = false;
    this.disabledButton = true;
    this.loadingIcon = true;
    this._product.update(this.product_id, this.form.value).subscribe({

      next: (resp: any) => {
        Swal.fire('Guardado', 'El registro ha sido actualizado', 'success');
        this.disabledButton = false;
        this.loadingIcon = false;
        this.success = true;
      },
      error: (error: any) => {
        Swal.fire('Error', 'Ocurrió un problema al actualizar. Inténtalo nuevamente.', 'error');
        console.error(error);
      },

    });
  }

  private formInit(): void {
    this.form = this.fb.group({
      name: ['', [Validators.required]],
      price: ['', [Validators.required]],
      body: [''],
      tags: [''],
    });
  }

  ngOnDestroy(): void {
    if (this.productSubscription) {
      this.productSubscription.unsubscribe();
    }
  }

  colorCreate(color: any) {
    console.log('Color upload event:', color);
    this.product.colors.unshift(color);
    // Aquí puedes manejar el evento de carga de color
    // Por ejemplo, enviar el color al servidor o procesarlo de alguna manera
  }

}


