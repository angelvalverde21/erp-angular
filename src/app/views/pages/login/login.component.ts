import { Component } from '@angular/core';
import { NgStyle } from '@angular/common';
import { IconDirective } from '@coreui/icons-angular';
import { ContainerComponent, RowComponent, ColComponent, CardGroupComponent, TextColorDirective, CardComponent, CardBodyComponent, FormDirective, InputGroupComponent, InputGroupTextDirective, FormControlDirective, ButtonDirective } from '@coreui/angular';
import { DashboardService } from '../../dashboard/dashboard.service';
import { Router } from '@angular/router';
import { AbstractControl, FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../../core/auth/auth.service';
import { User } from '../../../core/interfaces/user.interface';
import { ButtonLoginComponent } from "../../dashboard/shared/components/buttons/button-login/button-login.component";

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
    imports: [
    ReactiveFormsModule,
    ContainerComponent,
    RowComponent, ColComponent, CardGroupComponent, TextColorDirective, CardComponent,
    CardBodyComponent, FormDirective, InputGroupComponent, InputGroupTextDirective,
    IconDirective, FormControlDirective, ButtonDirective, NgStyle,
    ButtonLoginComponent
]
})
export class LoginComponent {

  user!: User;
  form!: FormGroup;
  valid: boolean = true;
  loading: boolean = false;
  buttonLoginActive: boolean = true;
  loadingIcon: boolean = false;
  disabledButton: boolean = false;
  message: string = '';
  web: any;

  constructor(
    private _auth: AuthService,
    public fb: FormBuilder,
    private router: Router,
    private _dashboard: DashboardService
  ) {
    /** inicio **/

    console.log("se paso por LoginComponent constructor");

    if (this._auth.estaAutenticado()) {
      console.log("hola");
      
      this.router.navigateByUrl('/');
    }

    this.form = this.fb.group({
      email: ['', [Validators.required, this.emailOrNumberValidator]],
      password: ['', [Validators.required]],
      recuerdame: ['', false],
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

  iniciarSesion() {

    console.log('iniciar sesion');

    this.loadingIcon = true;
    this.buttonLoginActive = false;
    this.disabledButton = true;

    this._auth.login(this.form.value).subscribe({
      next: (resp: any) => {
        console.log(resp);

        this.loading = false;
        this.message = resp.message;

        if (resp.success) {
          // const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';

          // localStorage.setItem('user',JSON.stringify(resp.user));
          // localStorage.setItem('roles',JSON.stringify(resp.user.roles));
          console.log('respuesta login correcto');

          this.router.navigateByUrl('/');
          // this.router.navigate([localStorage.getItem('slug_base'), 'auth']);
        }
      },

      error: (resp: any) => {
        console.log("error en iniciar sesion");
        
        this.valid = false;
        this.loading = false;
        this.message = resp.error.message;
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

  ngOnInit() {
    this.user = new User();
  }

}
