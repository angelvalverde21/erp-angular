import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Product } from '../../../../interfaces/product.interface';
import { Subject, takeUntil } from 'rxjs';
import { ProductService } from '../product.service';
import Swal from 'sweetalert2';
import { Resp } from '../../../../interfaces/response.interface';
import { ProductFormComponent } from '../product-form/product-form.component';
import { Category } from '../../../../interfaces/category.interface';
import { CategoryService } from '../../categories/category.service';
import { LoadingComponent } from '../../shared/components/loading/loading.component';
import { ButtonComponent } from '../../shared/components/buttons/button/button.component';
import { faSave } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-product-edit',
  imports: [ReactiveFormsModule, ProductFormComponent, LoadingComponent, ButtonComponent],
  templateUrl: './product-edit.component.html',
  styleUrl: './product-edit.component.scss'
})
export class ProductEditComponent implements OnInit, OnDestroy {

  loadingCategories: boolean = false;
  form!: FormGroup;
  @Input() product!: Product;

  @Output() emitCategorySelected = new EventEmitter<Category>();
  
  faSave = faSave;

  constructor(private fb: FormBuilder, private _product: ProductService, private _category: CategoryService) {

  }

  ngOnInit(): void {
    this.formInit();
    this.initCategories();
    this.form.patchValue(this.product);
  }

  private formInit(): void {
    this.form = this.fb.group({
      name: ['', [Validators.required]],
      price: ['', [Validators.required]],
      body: [''],
      tags: [''],
      category_id: ['null'],
    });
  }

  destroy$ = new Subject<void>();

  ngOnDestroy(): void {

    this.destroy$.next();
    this.destroy$.complete();

  }

  success: boolean = false;
  disabledButton: boolean = false;
  loadingIcon: boolean = false;

  update() {

    this.success = false;
    this.disabledButton = true;
    this.loadingIcon = true;

    this._product.update(this.product.id!, this.form.value).pipe(takeUntil(this.destroy$)).subscribe({

      next: (resp: Resp) => {
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

  loading: boolean = false;

  categories: Category[] = [];

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

  categorySelected(category: Category){
    this.emitCategorySelected.emit(category)
  }

}
