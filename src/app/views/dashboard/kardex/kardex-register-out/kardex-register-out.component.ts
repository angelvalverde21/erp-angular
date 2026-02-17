import { Component, EventEmitter, Input, Output } from '@angular/core';
import { KardexIndexSelectedComponent } from '../kardex-index-selected/kardex-index-selected.component';
import { ButtonComponent } from '@buttons/button/button.component';
import { KardexService } from '../kardex.service';
import { Subject, takeUntil } from 'rxjs';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-kardex-register-out',
  imports: [
    KardexIndexSelectedComponent,
    ButtonComponent
  ],
  templateUrl: './kardex-register-out.component.html',
  styleUrl: './kardex-register-out.component.scss'
})
export class KardexRegisterOutComponent {
  @Input() variants: any[] = [];

  buttonDisabled: boolean = true;

  @Input() kardexable_type: string = '';
  @Input() kardexable_id: number = 0;

  variantsKardex: any[] = [];

  @Output() emitKardexes = new EventEmitter<any>();

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

  registerOut() {

    Swal.fire({
      title: 'Espere...',
      html: 'Registrando salida de productos',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    })

    this.variantsKardex = this.variantsKardex.map(variant => ({
      ...variant,
      direction: 'out',
      kardexable_type: this.kardexable_type,
      kardexable_id: this.kardexable_id
    }));

    console.log("Registrar salida de inventario", this.variantsKardex);

    this._kardex.batch(this.variantsKardex).pipe(takeUntil(this.destroy$)).subscribe({

      next: (resp: any) => {
        Swal.fire('Guardado', 'Se ha registrado la salida de productos', 'success');
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
