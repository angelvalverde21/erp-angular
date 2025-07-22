import { Component, EventEmitter, Output } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CategoryService } from '../category.service';
import Swal from 'sweetalert2';
import { ActivatedRoute } from '@angular/router';
import { LoadingComponent } from '../../shared/components/loading/loading.component';

import { InputGroupComponent } from '../../shared/form/input-group/input-group.component';
import { ButtonComponent } from '../../shared/components/buttons/button/button.component';
import { CommonModule, JsonPipe } from '@angular/common';
import { ButtonCheckComponent } from '../../shared/components/buttons/button-check/button-check.component';
import { CategorySelectedComponent } from '../category-selected/category-selected.component';
import { faPenToSquare, faPlus } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-category-create',
  imports: [
    LoadingComponent, 
    ReactiveFormsModule, 
    InputGroupComponent,
    ButtonComponent, 
    CommonModule, 
    ButtonCheckComponent,
    JsonPipe,
    CategorySelectedComponent
  ],
  templateUrl: './category-create.component.html',
  styleUrl: './category-create.component.scss'
})

export class CategoryCreateComponent {

  category_id: number | null = null;
  categories: any[] = [];
  loadingSubcategories: boolean = true;
  disabledButton: boolean = true;
  loadingIcon: boolean = false;
  @Output() categoryUpdated = new EventEmitter<boolean>();
  
  editIcon = faPenToSquare;
  faPlus = faPlus;
  
  constructor(
    private fb: FormBuilder,
    private _route: ActivatedRoute,
     private _category: CategoryService,
  ) {
    
    // this._route.params.subscribe((params) => {
    //   this.category_id = params['category_id'];

    //   console.log(this.category_id);
      
    // });
  }

  ngOnInit(): void {
    this.formInit();
    // this.formLoad();
    this.loadCategories();

    this.form.statusChanges.subscribe(status => {
      if (status === 'VALID') {
        this.disabledButton = false;
      }else{
        this.disabledButton = true;
      }
    });
  }

  private formInit(): void {
    this.form = this.fb.group({
      name: ['', [Validators.required]],
      has_size: [false],
      has_color: [false],
      category_id: [null]
    });
  }

  form!: FormGroup;
  loading: boolean = false;
  success: boolean = false;

  loadCategories() {

    this.loadingSubcategories = true;

    this._category.index().subscribe((resp: any) => {

      console.log(resp);

      if (resp.status == 200) {
        this.categories = resp.data;
      } else {
        this.categories = [];
      }

      this.loadingSubcategories = false;
    });

  }

  private formLoad() {
    // this.form.patchValue(this.shipment);
  }

  create() {
    this.success = false;
    this.loadingIcon = true;
    this.disabledButton = true;

    if (this.form.invalid) {
      Swal.fire('Error', 'Por favor completa todos los campos requeridos.', 'error');
      return;
    }else{

      this._category.store(this.form.value).subscribe({
        next: (resp: any) => {

          Swal.fire('Guardado', 'El registro ha sido creado', 'success');
          console.log(resp);
          
          this.success = true;
          this.loadingIcon = false;
          
          this.loadCategories();
          this.form.reset(); // Reinicia el formulario pero los valores de has_color y has_reset los coloca null
          this.categoryUpdated.emit(true); // Emitir el evento para notificar que se ha creado una categoría

        },

        error: (error: any) => {
          Swal.fire('Error', 'Ocurrió un problema al crear. Inténtalo nuevamente.', 'error');
          console.error(error);
        },
      });
    }

  }

}
