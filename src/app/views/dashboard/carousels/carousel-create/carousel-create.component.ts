import { Component, EventEmitter, Output } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
  faPenToSquare,
  faPlus,
  faLink,
  faCalendarDays,
} from '@fortawesome/free-solid-svg-icons';
import Swal from 'sweetalert2';
import { CarouselService } from '../carousel.service';
import { InputGroupComponent } from '../../shared/form/input-group/input-group.component';
import { ButtonComponent } from '../../shared/components/buttons/button/button.component';

@Component({
  selector: 'app-carousel-create',
  imports: [ReactiveFormsModule, InputGroupComponent, ButtonComponent],
  templateUrl: './carousel-create.component.html',
  styleUrl: './carousel-create.component.scss',
})
export class CarouselCreateComponent {
  carousel_id: number | null = null;
  disabledButton: boolean = true;
  loadingIcon: boolean = false;

  @Output() carouselUpdated = new EventEmitter<boolean>();

  faPenToSquare = faPenToSquare;
  faPlus = faPlus;
  faLink = faLink;
  faCalendarDays = faCalendarDays;

  constructor(
    private fb: FormBuilder,
    private _route: ActivatedRoute,
    private _carousel: CarouselService,
    private _router: Router
  ) {}

  private formInit(): void {
    this.form = this.fb.group({
      name: ['', [Validators.required]],
      url: ['', [Validators.required]],
      date_start: [''],
      date_end: [''],
    });
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
  }

  form!: FormGroup;
  loading: boolean = false;
  success: boolean = false;

  create() {
    this.success = false;
    this.loadingIcon = true;
    this.disabledButton = true;

    if (this.form.invalid) {
      Swal.fire(
        'Error',
        'Por favor completa todos los campos requeridos.',
        'error'
      );
      return;
    } else {
      this._carousel.store(this.form.getRawValue()).subscribe({
        next: (resp: any) => {
          Swal.fire('Guardado', 'El registro ha sido creado', 'success');
          console.log(resp);

          this.success = true;
          this.loadingIcon = false;
          this.form.reset(); // Reinicia el formulario pero los valores de has_color y has_reset los coloca null

          this._router.navigate(['/', 'web', 'carousels']);
        },

        error: (error: any) => {
          Swal.fire(
            'Error',
            'Ocurrió un problema al crear. Inténtalo nuevamente.',
            'error'
          );
          console.error(error);
          this.loadingIcon = false;
        },
      });
    }
  }
}
