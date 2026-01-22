import { Component, OnInit } from '@angular/core';
import { InputGroupComponent } from '../../../shared/components/form/input-group/input-group.component';
import { faCopy, faMoneyBill } from '@fortawesome/free-solid-svg-icons';
import { ButtonComponent } from '../../../shared/components/buttons/button/button.component';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { LoadingComponent } from '../../../shared/components/loading/loading.component';
import { CommonModule, JsonPipe } from '@angular/common';
import { MercadoPagoService } from '../mercadopago.service';
import { Subject, takeUntil } from 'rxjs';
import Swal from 'sweetalert2';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
// import { ButtonComponent } from '../../../dashboard/shared/components/buttons/button.component';


@Component({
  selector: 'app-mp-pago-link-create',
  imports: [
    InputGroupComponent,
    ButtonComponent,
    ReactiveFormsModule,
    FormsModule,
    LoadingComponent,
    JsonPipe,
    CommonModule,
    FontAwesomeModule
  ],
  templateUrl: './mp-pago-link-create.component.html',
  styleUrl: './mp-pago-link-create.component.scss'
})
export class MpPagoLinkCreateComponent {

  faMoneyBill = faMoneyBill;
  resp: any;
  loading: boolean = false;
  showFormCopy: boolean = false;
  form!: FormGroup;
  link: string = "";
  display: number = 0;

  faCopy = faCopy;

  constructor(private fb: FormBuilder, private _mercadoPago: MercadoPagoService) {

  }

  ngOnInit(): void {

    this.formInit();

    this.form.valueChanges.subscribe((value) => {
      console.log(value);
      this.display = value.amount + (value.amount * this.form.get('comision')?.value) / 100;
    });

  }

  private formInit(): void {
    this.form = this.fb.group({
      amount: ['', [Validators.required]],
      comision: [5, [Validators.required]],
    });
  }

  createLink2() {

    if (this.form.valid) {
      this.loading = true;
      this.showFormCopy = false;

      this._mercadoPago.createLink(this.form.value).pipe(takeUntil(this.destroy$)).subscribe({

        next: (resp: any) => {
          console.log(resp);
          this.resp = resp;

          if (this.resp.success) {

            this.loading = false;
            // this.link = this.resp.sandbox_link;
            this.link = this.resp.link_pago;

            navigator.clipboard.writeText(this.link)
              .then(() => {
                Swal.fire('Generado', 'El link ha sido copiado al portapapeles', 'success');
                this.showFormCopy = true;
              })
              .catch(err => console.error('Error al copiar', err));

          } else {
            Swal.fire('Error', 'Ocurrió un problema al crear. Inténtalo nuevamente.', 'error');
          }
        },

        // error: (error: any) => {
        //   Swal.fire('Error', 'Ocurrió un problema al crear. Inténtalo nuevamente.', 'error');
        //   console.error(error);
        // },

      });
    }


  }

  createLink() {

    // this.form.get('amount')?.setValue(this.display);

    this.loading = true;

    this._mercadoPago.createLink(this.form.value)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (resp: any) => {
          this.loading = false;

          if (!resp?.success) {
            Swal.fire('Error', 'Ocurrió un problema al crear.', 'error');
            return;
          }

          this.resp = resp;
          this.link = resp.link_pago;
          this.showFormCopy = true;

          Swal.fire('Generado', 'Link creado correctamente', 'success');
        },

        error: () => {
          this.loading = false;
          Swal.fire('Error', 'Ocurrió un problema al crear.', 'error');
        }
      });
  }

  copyLink() {

    if (!this.link) return;

    // Safari + navegadores antiguos
    if (!navigator.clipboard || !window.isSecureContext) {
      this.fallbackCopy(this.link);
      return;
    }

    navigator.clipboard.writeText(this.link)
      .then(() => {
        Swal.fire('Copiado', 'El link fue copiado al portapapeles', 'success');
      })
      .catch(() => {
        this.fallbackCopy(this.link);
      });
  }

  fallbackCopy(text: string) {

    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();

    //deprecated pero necesario en Safari antiguo
    try {
      document.execCommand('copy');
      Swal.fire('Copiado', 'El link fue copiado al portapapeles', 'success');
    } catch {
      console.error('Error al copiar con execCommand');
    }

    document.body.removeChild(textarea);

  }

  destroy$ = new Subject<void>();

  ngOnDestroy(): void {

    this.destroy$.next();
    this.destroy$.complete();

  }

}
