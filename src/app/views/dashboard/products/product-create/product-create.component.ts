/************ El Componente ***************************/

import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
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
import { InputGroupComponent } from '../../shared/components/form/input-group/input-group.component';
import { LoadingComponent } from '../../shared/components/loading/loading.component';
import { ButtonComponent } from '../../shared/components/buttons/button/button.component';
import { ProductService } from '../product.service';
import { ButtonLinkComponent } from '../../shared/components/buttons/button-link/button-link.component';
import { CategoryService } from '../../categories/category.service';

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
  faBarcode
} from '@fortawesome/free-solid-svg-icons';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, Subscription, takeUntil } from 'rxjs';
import { BrandService } from '../../brands/brand.service';
import { BrandCreateComponent } from '../../brands/brand-create/brand-create.component';
import { UnitSelectedComponent } from '../../units/unit-selected/unit-selected.component'
import { UnitService } from '../../units/unit.service';
import { ProductFormComponent } from '../product-form/product-form.component';

@Component({
  selector: 'app-product-create',
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
    UnitSelectedComponent,
    ProductFormComponent
  ],
  templateUrl: './product-create.component.html',
  styleUrl: './product-create.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class ProductCreateComponent implements OnInit, OnDestroy {
  editIcon = faPenToSquare;
  faPlus = faPlus;
  faArrowLeft = faArrowLeft;
  faTags = faTags;
  faBarcode = faBarcode;

  private destroy$ = new Subject<void>();

  @Output() emitProductCreate = new EventEmitter<[] | boolean>();

  constructor(
    private fb: FormBuilder,
    private _product: ProductService,
    private _category: CategoryService,
    private _unit: UnitService
  ) {
  }

  categories: any[] = [];
  loadingSubcategories: boolean = true;
  disabledButton: boolean = true;
  loadingIcon: boolean = false;
  nameControl = new FormControl('');
  loadingBrands: boolean = false;


  items = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'ESTANDAR'];

  brands: any[] = [];
  // selectedItems = [];


  private formInit(): void {
    this.form = this.fb.group({
      name: ['', [Validators.required]],
      price: ['', [Validators.required]],
      // unit_id: ['', [Validators.required]],
      category_id: ['null', [Validators.required]],
      body: ['']
    });
  }

  loadingUnits: boolean = false;
  units: any[] = [];

  ngOnDestroy(): void {

    this.destroy$.next();
    this.destroy$.complete();

  }

  ngOnInit(): void {
    this.formInit();
    this.initCategories();
    // this.initUnits();
    // this.initBrands();

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

  @Input() user_id: number | null = null;
  form!: FormGroup;
  loading: boolean = false;
  success: boolean = false;


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

    this._product.store(payload).pipe(takeUntil(this.destroy$)).subscribe({

      next: (resp: any) => {
        Swal.fire('Guardado', 'El registro ha sido creado', 'success');
        this.success = true;
        this.form.reset();
        this.disabledButton = true;
        this.loadingIcon = false;
        this.emitProductCreate.emit(resp.data);

      },

      error: (error: any) => {
        Swal.fire('Error', 'Ocurrió un problema al crear. Inténtalo nuevamente.', 'error');
        this.disabledButton = true;
        this.loadingIcon = false;
        this.emitProductCreate.emit(false);
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

  loadingCategories: boolean = false;

  initCategories() {

    this.loadingCategories = true;

    this._category.index().pipe(takeUntil(this.destroy$)).subscribe({

      next: (resp: any) => {
        // Swal.fire('Guardado', 'El registro ha sido creado', 'success');
        console.log(resp);
        this.categories = resp.data;
        this.loading = false;
        this.loadingCategories = false;
      },

      error: (error: any) => {
        // Swal.fire('Error','Ocurrió un problema al crear. Inténtalo nuevamente.','error');
        console.error(error);
        this.loadingCategories = false;
      },

    });

  }


}



