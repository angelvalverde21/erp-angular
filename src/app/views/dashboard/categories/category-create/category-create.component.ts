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
import { InputGroupComponent } from '../../shared/components/form/input-group/input-group.component';
import { ButtonComponent } from '../../shared/components/buttons/button/button.component';
import { CommonModule } from '@angular/common';
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
  
  @Output() emitCategoryCreate = new EventEmitter< any[] | boolean >();
  
  editIcon = faPenToSquare;
  faPlus = faPlus;
  
  constructor(
    private fb: FormBuilder,
    private _route: ActivatedRoute,
     private _category: CategoryService,
  ) {
  
  }

  
  private formInit(): void {
    this.form = this.fb.group({
      name: ['', [Validators.required]],
      has_size: ['', [Validators.required]],
      has_color: [true],
      category_id: [null] //No es obligatorio porque sino no se podria crear las categorias padre
    });
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

  form!: FormGroup;
  loading: boolean = false;
  success: boolean = false;
  activarSelected: boolean = true;

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

      this._category.store(this.form.getRawValue()).subscribe({
        next: (resp: any) => {

          Swal.fire('Guardado', 'El registro ha sido creado', 'success');
          console.log(resp);
          
          this.success = true;
          this.loadingIcon = false;
          
          this.loadCategories();
          this.form.reset(); // Reinicia el formulario pero los valores de has_color y has_reset los coloca null
          this.emitCategoryCreate.emit(resp.data); // Emitir el evento para notificar que se ha creado una categoría

          this.form.get('has_size')?.setValue("");
          this.form.get('has_size')?.enable();

        },

        error: (error: any) => {
          Swal.fire('Error', 'Ocurrió un problema al crear. Inténtalo nuevamente.', 'error');
          console.error(error);
        },
      });
    }

  }

  categorySelected(category: any){
    console.log(category);
    if (category != null) {
      category.has_size ? this.form.get('has_size')?.setValue(1, { emitEvent: false }) : this.form.get('has_size')?.setValue(0, { emitEvent: false });
      // this.form.get('has_size')?.disable();
      this.form.get('has_size')?.disable();
      
    }else{
      this.form.get('has_size')?.setValue(0);
      this.form.get('has_size')?.enable();
    }
  }

}
