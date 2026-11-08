import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Product } from '../../../../interfaces/product.interface';
import { finalize, Subject, takeUntil } from 'rxjs';
import { ProductService } from '../product.service';
import Swal from 'sweetalert2';
import { Resp } from '../../../../interfaces/response.interface';
import { ProductFormComponent } from '../product-form/product-form.component';
import { Category } from '../../../../interfaces/category.interface';
import { ButtonComponent } from '../../../shared/components/buttons/button/button.component';
import { faSave } from '@fortawesome/free-solid-svg-icons';
import { Brand } from '../../../../interfaces/brand.interface';
import { GalleryComponent } from '../../../shared/components/gallery/gallery.component';

@Component({
  selector: 'app-product-edit',
  imports: [
    ReactiveFormsModule, 
    ProductFormComponent, 
    ButtonComponent,
    GalleryComponent
  ],
  templateUrl: './product-edit.component.html',
  styleUrl: './product-edit.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class ProductEditComponent implements OnInit, OnDestroy {

  loadingCategories: boolean = false;
  form!: FormGroup;
  @Input() product!: Product;
  @Input() categories: Category[] = [];
  @Input() brands: Brand[] = [];

  @Output() emitCategorySelected = new EventEmitter<Category>();
  @Output() emitProductUpdated = new EventEmitter<Product>();



  faSave = faSave;
  tagDraft = '';
  propertiesExpanded = false;

  get tagItems(): string[] {
    const value = this.form.get('tags')?.value;
    const tags: string[] = Array.isArray(value) ? value : typeof value === 'string' ? value.split(',') : [];
    return [...new Set(tags.map(tag => tag.trim()).filter(Boolean))];
  }

  onTagInput(input: HTMLInputElement): void {
    if (this.loadingIcon) return;
    const parts = input.value.split(',');
    this.tagDraft = parts.pop() ?? '';
    this.addTags(parts);
    this.form.get('tags')!.markAsDirty();
    input.value = this.tagDraft;
  }

  confirmTag(event: Event, input: HTMLInputElement): void {
    if (event instanceof KeyboardEvent && event.isComposing) return;
    event.preventDefault();
    this.commitTags(input);
  }

  commitTags(input?: HTMLInputElement): void {
    if (this.loadingIcon) return;
    this.addTags((input?.value ?? this.tagDraft).split(','));
    this.tagDraft = '';
    if (input) input.value = '';
  }

  removeTag(tag: string): void {
    if (this.loadingIcon) return;
    this.form.get('tags')!.setValue(this.tagItems.filter(item => item !== tag).join(', '));
    this.form.get('tags')!.markAsDirty();
  }

  private addTags(values: string[]): void {
    const tags = values.map(value => value.trim()).filter(Boolean);
    if (!tags.length) return;
    this.form.get('tags')!.setValue([...new Set([...this.tagItems, ...tags])].join(', '));
    this.form.get('tags')!.markAsDirty();
  }

  constructor(
    private fb: FormBuilder,
    private _product: ProductService,
  ) {

  }

  ngOnInit(): void {
    this.formInit();
    // this.productSetup();
    this.form.patchValue(this.product);
  }

  private formInit(): void {
    this.form = this.fb.group({
      name: ['', [Validators.required]],
      // color: ['', [Validators.required]],
      material: ['', [Validators.required]],
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
    if (this.loadingIcon) return;
    this.commitTags();
    this.form.markAllAsTouched();
    if (this.form.invalid) {
      if (['category_id', 'material'].some(field => this.form.get(field)?.invalid)) {
        this.propertiesExpanded = true;
      }
      return;
    }

    this.success = false;
    this.disabledButton = true;
    this.loadingIcon = true;

    const values = this.form.getRawValue();
    this.form.disable({ emitEvent: false });
    this._product.update(this.product.id!, values).pipe(
      takeUntil(this.destroy$),
      finalize(() => {
        this.disabledButton = false;
        this.loadingIcon = false;
        this.form.enable({ emitEvent: false });
      }),
    ).subscribe({

      next: (resp: Resp) => {
        Swal.fire('Guardado', 'El registro ha sido actualizado', 'success');
        this.product = { ...this.product, ...values, ...resp.data };
        this.form.markAsPristine();
        this.emitProductUpdated.emit(this.product);
        this.success = true;
      },

      error: (error: any) => {
        Swal.fire('Error', 'Ocurrió un problema al actualizar. Inténtalo nuevamente.', 'error');
        console.error(error);
      },

    });

  }

  categorySelected(category: Category) {
    this.emitCategorySelected.emit(category)
  }

}
