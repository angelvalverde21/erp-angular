import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faUser,
  faHome,
  faLock,
  faPhone,
  faEnvelope,
} from '@fortawesome/free-solid-svg-icons';
import { InputGroupComponent } from '../../dashboard/shared/components/form/input-group/input-group.component';
import { JsonPipe, NgClass } from '@angular/common';
import { ButtonComponent } from '../../dashboard/shared/components/buttons/button/button.component';
import { Subject, takeUntil } from 'rxjs';
import { AuthService } from '../auth.service';
import Swal from 'sweetalert2';
import { ButtonLinkComponent } from '../../dashboard/shared/components/buttons/button-link/button-link.component';
import { Router } from '@angular/router';
import { StoreService } from '../../../core/services/store.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  imports: [
    ReactiveFormsModule,
    InputGroupComponent,
    FontAwesomeModule,
    JsonPipe,
    ButtonComponent,
    NgClass,
    ButtonLinkComponent
  ],
})
export class RegisterComponent implements OnInit, OnDestroy {
  faUser = faUser;
  faHome = faHome;
  faLock = faLock;
  faPhone = faPhone;
  faEnvelope = faEnvelope;

  loading: boolean = false;
  disabledButton: boolean = true;
  loadingIcon: boolean = false;

  error: any;

  constructor(private fb: FormBuilder, private _auth: AuthService, private _router: Router, private _store: StoreService) {}

  ngOnInit(): void {
    this.formInit();

    this.form.statusChanges.subscribe((status) => {
      console.log(status);

      if (status === 'VALID') {
        this.disabledButton = false;
      } else {
        this.disabledButton = true;
      }
    });
  }

  get store() {
    return this.form.get('store');
  }
  get name() {
    return this.form.get('name');
  }
  get phone() {
    return this.form.get('phone');
  }
  get email() {
    return this.form.get('email');
  }
  get password() {
    return this.form.get('password');
  }

  form!: FormGroup;

  private formInit(): void {
    this.form = this.fb.group({
      store: ['', [Validators.required, Validators.minLength(2)]],
      name: ['', [Validators.required, Validators.minLength(3)]],
      phone: ['', [Validators.required, Validators.pattern(/^\d{7,15}$/)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  destroy$ = new Subject<void>();

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  success: boolean = false;

  register() {
    this.loadingIcon = true;
    this.disabledButton = true;

    this._auth
      .isRegister(this.form.value)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (resp: any) => {

          this.success = true;
          this.loadingIcon = false;
          this.disabledButton = false;

          Swal.fire({
            icon: 'success',
            title: 'Correcto',
            text: 'su registro ha sido existoso',
            confirmButtonText: 'OK',
            showConfirmButton: true,
          });

          this._router.navigate(this._store.getLink(['dashboard']))
        },

        error: (error: any) => {
          console.error(error);
          this.error = error.error.message;

          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Error al crear la tienda',
          });

          this.loadingIcon = false;
          this.disabledButton = false;
        },
      });
  }
}
