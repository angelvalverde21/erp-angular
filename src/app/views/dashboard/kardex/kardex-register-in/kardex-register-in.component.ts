import { Component, EventEmitter, Input, Output } from '@angular/core';
import { KardexIndexSelectedComponent } from '../kardex-index-selected/kardex-index-selected.component';
import { ButtonComponent } from '@buttons/button/button.component';
import { KardexService } from '../kardex.service';
import { Subject, takeUntil } from 'rxjs';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-kardex-register-in',
  imports: [

    KardexIndexSelectedComponent,
    ButtonComponent
  ],
  templateUrl: './kardex-register-in.component.html',
  styleUrl: './kardex-register-in.component.scss'
})
export class KardexRegisterInComponent {

  @Input() variants: any[] = [];

  variantsKardex: any[] = [];

  @Input() kardexable_type: string = '';
  @Input() kardexable_id: number = 0;


  @Output() emitKardexes = new EventEmitter<any>();

  buttonDisabled: boolean = true;

  constructor(
    private _kardex: KardexService
  ) {

  }

  receiveKardexVariants(event: any) {

    if (event.length > 0) {
      this.buttonDisabled = false;
    } else {
      this.buttonDisabled = true;
    }

    console.log("entrada de inventario", event);

    this.variantsKardex = event; //son variantes con informacion de entrada y salida de inventario
  }

  loading: boolean = false;
  kardexes: any[] = [];


  registerIn() {

    this.variantsKardex = this.variantsKardex.map(variant => ({
      ...variant,
      direction: 'in',
      kardexable_type: this.kardexable_type,
      kardexable_id: this.kardexable_id
    }));

    console.log("Registrar entrada de inventario", this.variantsKardex);


    Swal.fire({
      title: 'Espere...',
      html: 'Registrando entrada de productos',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    })


    this._kardex.batch(this.variantsKardex).pipe(takeUntil(this.destroy$)).subscribe({

      next: (resp: any) => {
        Swal.fire('Guardado', 'Se ha registrado la entrada de productos', 'success');
        console.log(resp);
        this.kardexes = resp.data;
        this.loading = false;
        this.emitKardexes.emit(this.kardexes);
      },

      error: (error: any) => {
        Swal.fire('Error', 'Ocurrió un problema al crear. Inténtalo nuevamente.', 'error');
        console.error(error);
      },

    });

  }

  destroy$ = new Subject<void>();

  ngOnDestroy(): void {

    this.destroy$.next();
    this.destroy$.complete();

  }
}
