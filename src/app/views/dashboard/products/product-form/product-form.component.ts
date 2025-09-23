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
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';

import { faEdit, faPlus, faPalette, faCircleDot } from '@fortawesome/free-solid-svg-icons';
import { InputGroupComponent } from '../../shared/components/form/input-group/input-group.component';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CategorySelectedComponent } from '../../categories/category-selected/category-selected.component';
import { Category } from '../../../../interfaces/category.interface';
import { CategoryCreateComponent } from '../../categories/category-create/category-create.component';
import { ButtonComponent } from '../../shared/components/buttons/button/button.component';
import { JsonPipe } from '@angular/common';
import { QuillModule } from 'ngx-quill';
import { BrandSelectedComponent } from '../../brands/brand-selected/brand-selected.component';
import { BrandCreateComponent } from '../../brands/brand-create/brand-create.component';
import { Brand } from '../../../../interfaces/brand.interface';
import { BrandInputComponent } from '../../brands/brand-input/brand-input.component';
import { BrandService } from '../../brands/brand.service';

@Component({
  selector: 'app-product-form',
  imports: [
    InputGroupComponent,
    ReactiveFormsModule,
    CategorySelectedComponent,
    CategoryCreateComponent,
    ButtonComponent,
    JsonPipe,
    QuillModule,
    BrandSelectedComponent,
    BrandCreateComponent,
    BrandInputComponent
  ],
  templateUrl: './product-form.component.html',
  styleUrl: './product-form.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class ProductFormComponent{

  modules = {
    toolbar: [
      ['bold', 'italic', 'underline'],         
      [{ list: 'ordered' }, { list: 'bullet' }],
      ['link', 'image']
    ]
  };

  faEdit = faEdit;
  faPalette = faPalette;
  faPlus = faPlus;
  faCircleDot = faCircleDot;

  @Input() form!: FormGroup;
  @Input() categories: Category[] = [];
  @Input() brands: Brand[] = [];
  @Output() emitCategorySelected = new EventEmitter<Category>();
  @Output() emitBrandSelected = new EventEmitter<Brand>();
  

  modal: any;
  constructor(config: NgbModalConfig, private modalService: NgbModal, private _brand: BrandService) {
    // customize default values of modals used by this component tree
    config.backdrop = 'static';
    config.keyboard = false;
  }

  cambio(event: any) {
    console.log('Contenido cambiado:', event.html);
  }
  
  openVerticallyCentered(content: TemplateRef<any>) {
    this.modal = this.modalService.open(content, { centered: true });
  }


  closeModal() {
    this.modal.close();
  }

  reListCategories(category: any) {

    console.log('categorias re listadas');
    console.log(category);

    this.categories = [category, ...this.categories]; // nueva referencia
    console.log(this.categories);

    console.log(category.id);
    
    this.form.get('category_id')?.setValue(category.id != null ? String(category.id) : '');

    this.closeModal();

  }

  reListBrands(brand: any) {

    console.log('marcas re listadas');
    console.log(brand);

    this.brands = [brand, ...this.brands]; // nueva referencia
    console.log(this.brands);

    console.log(brand.id);

    this.form.get('brand_id')?.setValue(brand.id);

    this._brand.addLocal(brand);

    this.closeModal();

  }

  categorySelected(category: Category){
    this.emitCategorySelected.emit(category);
  }

  brandSelected(brand: Brand){
    // this.emitBrandSelected.emit(brand);
    console.log(brand);
    
  }

}
