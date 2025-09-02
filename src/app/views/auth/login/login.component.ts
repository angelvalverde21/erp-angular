import { Component } from '@angular/core';
import { JsonPipe, NgStyle } from '@angular/common';
import { IconDirective } from '@coreui/icons-angular';
import {
  ContainerComponent,
  RowComponent,
  ColComponent,
  CardGroupComponent,
  TextColorDirective,
  CardComponent,
  CardBodyComponent,
  FormDirective,
  InputGroupComponent,
  InputGroupTextDirective,
  FormControlDirective,
  ButtonDirective,
} from '@coreui/angular';
import { Router, RouterModule } from '@angular/router';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { User } from '../../../interfaces/user.interface';
import { ButtonLoginComponent } from '../../dashboard/shared/components/buttons/button-login/button-login.component';
import { AuthService } from '../auth.service';
import { StoreService } from '../../../core/services/store.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  imports: [
    ReactiveFormsModule,
    ContainerComponent,
    RowComponent,
    ColComponent,
    CardGroupComponent,
    TextColorDirective,
    CardComponent,
    CardBodyComponent,
    FormDirective,
    InputGroupComponent,
    InputGroupTextDirective,
    IconDirective,
    FormControlDirective,
    ButtonDirective,
    NgStyle,
    ButtonLoginComponent,
    RouterModule,
    JsonPipe
  ],
})
export class LoginComponent {
  user!: User;
  form!: FormGroup;
  valid: boolean = true;
  loading: boolean = false;
  buttonLoginActive: boolean = true;
  loadingIcon: boolean = false;
  disabledButton: boolean = true;
  message: string = '';
  web: any;
  error: any;

  constructor(
    private _auth: AuthService,
    public fb: FormBuilder,
    private router: Router,
    private _store: StoreService
  ) {
    /** inicio **/

    this._store.getStore().subscribe((store) => {
      console.log(store);
    });
    

    console.log('se paso por LoginComponent constructor');

    // if (this._auth.estaAutenticado()) {
    //   console.log("hola");

    //   this.router.navigateByUrl('/');
    // }

    this.form = this.fb.group({
      email: ['', [Validators.required, this.emailOrNumberValidator]],
      password: ['', [Validators.required]],
      recuerdame: ['', false],
    });

    this.form.statusChanges.subscribe((status) => {
      console.log(status);

      if (status === 'VALID') {
        this.disabledButton = false;
      } else {
        this.disabledButton = true;
      }
    });

    /** final **/
  }

  emailOrNumberValidator(
    control: AbstractControl
  ): { [key: string]: boolean } | null {
    const value = control.value ? control.value.trim() : ''; // Elimina espacios en blanco al inicio o final
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    const numberPattern = /^9\d{8}$/;

    if (!value) {
      return null; // No hay valor, deja que el validador 'required' lo maneje
    }

    if (emailPattern.test(value) || numberPattern.test(value)) {
      return null; // Válido
    }

    console.log('Valor ingresado:', value); // Para depurar
    return { emailOrNumberInvalid: true }; // No válido
  }

  login() {
    console.log('iniciar sesion');

    this.loadingIcon = true;
    this.buttonLoginActive = false;
    this.disabledButton = true;

    this._auth.isLogin(this.form.value).subscribe({
      next: (resp: any) => {
        console.log(resp);

        this.loading = false;
        this.message = resp.message;
        this.error = null;

        if (resp.success) {
          console.log('respuesta login correcto');
          this.router.navigate(this._store.getLink(['dashboard']));
        }
      },

      error: (resp: any) => {
        console.log('error en iniciar sesion');

        this.valid = false;
        this.loading = false;
        this.error = resp.error.message;
        this.buttonLoginActive = true;
        this.loadingIcon = false;
        this.disabledButton = false; //en caso de fallar el login activa nuevamente el boton
        console.log(resp);
      },

      complete: () => {
        this.loading = false;
        console.log('Request complete');
      },
    });
  }

  ngOnInit() {}
}
