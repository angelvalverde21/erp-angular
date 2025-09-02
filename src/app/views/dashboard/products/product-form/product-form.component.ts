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

import { faEdit, faPlus } from '@fortawesome/free-solid-svg-icons';
import { InputGroupComponent } from '../../shared/components/form/input-group/input-group.component';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CategorySelectedComponent } from '../../categories/category-selected/category-selected.component';
import { Category } from '../../../../interfaces/category.interface';
import { CategoryCreateComponent } from '../../categories/category-create/category-create.component';
import { ButtonComponent } from '../../shared/components/buttons/button/button.component';
import { JsonPipe } from '@angular/common';

@Component({
  selector: 'app-product-form',
  imports: [
    InputGroupComponent,
    ReactiveFormsModule,
    CategorySelectedComponent,
    CategoryCreateComponent,
    ButtonComponent,
    JsonPipe
  ],
  templateUrl: './product-form.component.html',
  styleUrl: './product-form.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class ProductFormComponent{

  faEdit = faEdit;
  faPlus = faPlus;

  @Input() form!: FormGroup;
  @Input() categories: Category[] = [];
  @Output() emitCategorySelected = new EventEmitter<Category>();
  

  modal: any;
  constructor(config: NgbModalConfig, private modalService: NgbModal) {
    // customize default values of modals used by this component tree
    config.backdrop = 'static';
    config.keyboard = false;
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

  categorySelected(category: Category){
    this.emitCategorySelected.emit(category);
  }

}
