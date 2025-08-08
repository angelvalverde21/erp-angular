import { Component, OnDestroy, OnInit } from '@angular/core';
import { LoadingComponent } from '../../shared/components/loading/loading.component';
import { InputGroupComponent } from '../../shared/form/input-group/input-group.component';
import Swal from 'sweetalert2';
import {
  faPenToSquare,
  faPlus,
  faSave,
  faTrash
} from '@fortawesome/free-solid-svg-icons';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BrandService } from '../brand.service';
import { ButtonComponent } from '../../shared/components/buttons/button/button.component';
import { Subscription } from 'rxjs';
import { GalleryComponent } from '../../shared/components/gallery/gallery.component';

@Component({
  selector: 'app-brand-edit-page',
  imports: [
    LoadingComponent,
    InputGroupComponent,
    ReactiveFormsModule,
    ButtonComponent,
    GalleryComponent
  ],
  templateUrl: './brand-edit-page.component.html',
  styleUrl: './brand-edit-page.component.scss',
})
export class BrandEditPageComponent implements OnDestroy, OnInit{
  faPenToSquare = faPenToSquare;
  faPlus = faPlus;
  faSave = faSave;
  faTrash = faTrash;

  form!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private _route: ActivatedRoute,
    private _brand: BrandService,
    private _router: Router
  
  ) {}

  disabledButton: boolean = true;
  loadingIcon: boolean = false;
  loading: boolean = false;
  success: boolean = false;
  brand_id: number = 0;
  brand: any;

  private formInit(): void {
    this.form = this.fb.group({
      name: ['name', [Validators.required]],
    });
  }

  subscriptionComponent! : Subscription;
  
  ngOnDestroy(): void {
  
    if(this.subscriptionComponent){
      this.subscriptionComponent.unsubscribe();
    }
  
  }

  ngOnInit(): void {
    this.formInit();
    // this.formLoad();

    this.form.statusChanges.subscribe((status) => {
      if (status === 'VALID') {
        this.disabledButton = false;
      } else {
        this.disabledButton = true;
      }
    });

    this._route.params.subscribe((params) => {
      this.brand_id = params['brand_id'];
      console.log(this.brand_id);

      this.loading = true;

      this.subscriptionComponent = this._brand
        .get(this.brand_id)
        .subscribe((resp: any) => {
          this.loading = false;
          this.brand = resp.data;
          this.form.patchValue(resp.data);
          console.log(this.brand);
        });
    });
  }

  update() {
    console.log('form enviado');
    this.success = false;
    this.disabledButton = true;
    this.loadingIcon = true;
    this._brand.update(this.brand_id, this.form.value).subscribe({
      next: (resp: any) => {
        Swal.fire('Guardado', 'El registro ha sido actualizado', 'success');
        this.disabledButton = false;
        this.loadingIcon = false;
        this.success = true;
      },
      error: (error: any) => {
        Swal.fire(
          'Error',
          'Ocurrió un problema al actualizar. Inténtalo nuevamente.',
          'error'
        );
        console.error(error);
      },
    });
  }

  archivar(){

    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción archivará la marca y no podrá ser deshecha.',
      icon: 'warning',
      confirmButtonColor: "#d33",
      showCancelButton: true,
      confirmButtonText: 'Sí, archivar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this._brand.destroy(this.brand_id).subscribe({
          next: (resp: any) => {
            Swal.fire('Archivado', 'La marca ha sido archivada.', 'success');
            this._router.navigate(['/','brands']);
            
          },
          error: (error: any) => {
            Swal.fire('Error', 'No se pudo archivar la marca.', 'error');
            console.error(error);
          }
        });
      }
    });
  }
}
