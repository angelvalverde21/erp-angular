import { Component, OnInit } from '@angular/core';
import { InputGroupComponent } from '../../../shared/components/form/input-group/input-group.component';
import { faMoneyBill } from '@fortawesome/free-solid-svg-icons';
import { ButtonComponent } from '../../../shared/components/buttons/button/button.component';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { LoadingComponent } from '../../../shared/components/loading/loading.component';
import { JsonPipe } from '@angular/common';
import { MercadoPagoService } from '../mercadopago.service';
import { Subject, takeUntil } from 'rxjs';
import Swal from 'sweetalert2';
// import { ButtonComponent } from '../../../dashboard/shared/components/buttons/button.component';

@Component({
  selector: 'app-mp-pago-link-create',
  imports: [InputGroupComponent, ButtonComponent, ReactiveFormsModule, FormsModule, LoadingComponent, JsonPipe],
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

  constructor(private fb: FormBuilder, private _mercadoPago: MercadoPagoService) {

  }

  ngOnInit(): void {
    this.formInit();
  }

  private formInit(): void {
    this.form = this.fb.group({
      amount: ['', [Validators.required]],
    });
  }

  createLink() {

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

  destroy$ = new Subject<void>();

  ngOnDestroy(): void {

    this.destroy$.next();
    this.destroy$.complete();

  }

}
