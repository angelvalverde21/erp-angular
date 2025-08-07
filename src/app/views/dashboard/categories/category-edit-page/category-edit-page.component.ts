import { Component, Input, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { LoadingComponent } from '../../shared/components/loading/loading.component';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { faPenToSquare } from '@fortawesome/free-regular-svg-icons';
import { faTags, faSave, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { CategoryService } from '../category.service';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ButtonComponent } from '../../shared/components/buttons/button/button.component';
import { InputGroupComponent } from '../../shared/form/input-group/input-group.component';
import Swal from 'sweetalert2';
import { ButtonLinkComponent } from '../../shared/components/buttons/button-link/button-link.component';

@Component({
  selector: 'app-category-edit-page',
  imports: [
    LoadingComponent,
    ButtonComponent,
    ReactiveFormsModule,
    InputGroupComponent,
    FontAwesomeModule,
    ButtonLinkComponent,
  ],
  templateUrl: './category-edit-page.component.html',
  styleUrl: './category-edit-page.component.scss',
})
export class CategoryEditPageComponent implements OnDestroy {
  category_id: number = 0;
  subscriptionComponent!: Subscription;
  loading: boolean = true;
  success: boolean = true;

  //icons
  faPenToSquare = faPenToSquare;
  faTags = faTags;
  faSave = faSave;
  faArrowLeft = faArrowLeft;

  @Input() category: any;

  constructor(
    private route: ActivatedRoute,
    private _category: CategoryService,
    private fb: FormBuilder
  ) {
    this.route.params.subscribe((params) => {
      this.category_id = params['category_id'];

      this.loading = true;

      this.subscriptionComponent = this._category
        .get(this.category_id)
        .subscribe((resp: any) => {
          this.loading = false;
          this.category = resp.data;
          this.form.patchValue(resp.data);
          console.log(this.category);
        });
    });
  }

  ngOnDestroy(): void {
    if (this.subscriptionComponent) {
      this.subscriptionComponent.unsubscribe();
    }
  }

  form!: FormGroup;

  disabledButton: boolean = false;
  loadingIcon: boolean = false;

  ngOnInit(): void {
    this.formInit();
  }

  private formInit(): void {
    this.form = this.fb.group({
      name: ['', [Validators.required]],
      slug: [''],
    });
  }

  update() {
    console.log('form enviado');
    this.success = false;
    this.disabledButton = true;
    this.loadingIcon = true;
    this._category.update(this.category.id, this.form.value).subscribe({
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
}
