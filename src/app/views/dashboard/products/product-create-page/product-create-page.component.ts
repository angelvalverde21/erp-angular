/************ El Componente ***************************/

import {
  Component,
  Input,
  OnDestroy,
  OnInit,
  TemplateRef,
  ViewEncapsulation,
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
  FormsModule,
} from '@angular/forms';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { InputGroupComponent } from '../../shared/form/input-group/input-group.component';
import { LoadingComponent } from '../../shared/components/loading/loading.component';
import { ButtonComponent } from '../../shared/components/buttons/button/button.component';
import { ProductService } from '../product.service';
import { ButtonLinkComponent } from '../../shared/components/buttons/button-link/button-link.component';
import { CategoryService } from '../../categories/category.service';

import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';

import {
  ButtonCloseDirective,
  ModalBodyComponent,
  ModalComponent,
  ModalHeaderComponent,
  ModalTitleDirective,
} from '@coreui/angular';
import { CategorySelectedComponent } from '../../categories/category-selected/category-selected.component';
import { CategoryCreateComponent } from '../../categories/category-create/category-create.component';
// import { OnlyUppercaseDirective } from '../../../directives/only-uppercase.directive';
import { NgSelectModule } from '@ng-select/ng-select';
import {
  faPenToSquare,
  faPlus,
  faArrowLeft,
  faTags,
} from '@fortawesome/free-solid-svg-icons';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { BrandService } from '../../brands/brand.service';
import { BrandCreateComponent } from '../../brands/brand-create/brand-create.component';

@Component({
  selector: 'app-product-create-page',
  imports: [
    InputGroupComponent,
    CommonModule,
    ReactiveFormsModule,
    LoadingComponent,
    ButtonComponent,
    ButtonLinkComponent,
    CategorySelectedComponent,
    ButtonCloseDirective,
    ModalBodyComponent,
    ModalComponent,
    ModalHeaderComponent,
    ModalTitleDirective,
    CategoryCreateComponent,
    BrandCreateComponent,
    // OnlyUppercaseDirective,
    NgSelectModule,
    FormsModule,
  ],
  templateUrl: './product-create-page.component.html',
  styleUrl: './product-create-page.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class ProductCreatePageComponent implements OnInit, OnDestroy {
  editIcon = faPenToSquare;
  faPlus = faPlus;
  faArrowLeft = faArrowLeft;
  faTags = faTags;

  modal: any;

  constructor(
    private fb: FormBuilder,
    private _product: ProductService,
    private _category: CategoryService,
    private _router: Router,
    private _brand: BrandService,
    configModal: NgbModalConfig,
    private modalService: NgbModal
  ) {
    configModal.backdrop = 'static';
    configModal.keyboard = false;
  }

  categories: any[] = [];
  loadingSubcategories: boolean = true;
  disabledButton: boolean = true;
  loadingIcon: boolean = false;
  nameControl = new FormControl('');
  loadingBrands: boolean = false;
  subscriptionBrands!: Subscription;

  items = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'ESTANDAR'];

  brands: any[] = [];
  // selectedItems = [];

  initBrands() {
    this.loadingBrands = true;
    this.subscriptionBrands = this._brand.index().subscribe({
      next: (resp: any) => {
        this.brands = resp.data;
        console.log(this.brands);

        this.loadingBrands = false;
      },
      error: (error: any) => {
        console.error(error);
        this.loadingBrands = false;
      },
    });
  }

  relistBrands(brand: any) {
    console.log('marcas re listadas');
    console.log(brand);

    this.brands = [brand, ...this.brands]; // nueva referencia
    console.log(this.brands);
  }

  ngOnDestroy(): void {
    if (this.subscriptionBrands) {
      this.subscriptionBrands.unsubscribe();
    }
  }

  ngOnInit(): void {
    this.formInit();
    this.formLoad();
    // this.initBrands();
    // this.initCategories();

    this.form.statusChanges.subscribe((status) => {
      console.log(status);

      if (status === 'VALID') {
        this.disabledButton = false;
      } else {
        this.disabledButton = true;
      }
    });

    //recibir cambios del categoria
  }

  initCategories() {
    this._category.index().subscribe({
      next: (resp: any) => {
        this.categories = resp.data;
        this.loadingSubcategories = false;
      },
    });
  }

  @Input() user_id: number | null = null;
  form!: FormGroup;
  loading: boolean = false;
  success: boolean = false;

  private formInit(): void {
    this.form = this.fb.group({
      name: ['', [Validators.required]],
      body: [''],
      tags: [''],
      price: ['', [Validators.required]],
      brand_id: [null],
      sizes: [[]],
      category_id: ['', [Validators.required]],
    });
  }

  private formLoad() {
    // this.form.patchValue(this.shipment);
  }

  create() {
    this.loadingIcon = true;
    this.disabledButton = true;

    const rawData = this.form.value;

    // convierte el array en string
    const payload = {
      ...rawData,
      sizes: (rawData.sizes || []).join(','), // <-- conversión aquí
    };

    this.success = false;
    // console.log(this.form.value);

    this._product.store(payload).subscribe({
      next: (resp: any) => {
        Swal.fire('Guardado', 'El registro ha sido creado', 'success');
        this.success = true;
        this.form.reset();
        this.disabledButton = true;
        this.loadingIcon = false;
        this._router.navigate(['/', 'products', resp.data.id]);
      },
      error: (error: any) => {
        Swal.fire(
          'Error',
          'Ocurrió un problema al crear. Inténtalo nuevamente.',
          'error'
        );
        console.error(error);
      },
    });
  }

  public visible = false;

  toggleLiveDemo() {
    this.visible = !this.visible;
    console.log('toggleLiveDemo');
  }

  handleLiveDemoChange(event: any) {
    this.visible = event;
    console.log('handleLiveDemoChange', event);
  }

  // categorySelected : any = null;

  has_size: boolean = false;

  fnCategorySelected(categorySelected: any) {
    if (categorySelected.has_size) {
      this.has_size = true;
    } else {
      this.has_size = false;
    }

    console.log(this.has_size);
  }

  openVerticallyCentered(content: TemplateRef<any>) {
    this.modal = this.modalService.open(content, { centered: true, size: 'lg' });
  }

  closeModal() {
    this.modal.close();
  }

  reListCategories(category: any) {
    console.log('categorias re listadas');
    console.log(category);

    this.categories = [category, ...this.categories]; // nueva referencia
    console.log(this.categories);
  }
}



