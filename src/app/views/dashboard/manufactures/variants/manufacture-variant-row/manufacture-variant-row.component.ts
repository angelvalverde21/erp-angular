import { Component, EventEmitter, Input, OnDestroy, Output } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faBarcode, faTrash } from '@fortawesome/free-solid-svg-icons';
import { ButtonComponent } from 'src/app/views/shared/components/buttons/button/button.component';
import { ManufactureVariantService } from '../manufactureVariant.service';
import Swal from 'sweetalert2';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'tr[app-manufacture-variant-row]',
  imports: [
    FontAwesomeModule,
    ButtonComponent
  ],
  templateUrl: './manufacture-variant-row.component.html',
  styleUrl: './manufacture-variant-row.component.scss'
})
export class ManufactureVariantRowComponent implements OnDestroy{

// import { Subject, takeUntil } from 'rxjs';

  faBarcode = faBarcode;
  faTrash = faTrash;

  @Output() emitDeleteManufactureVariantId = new EventEmitter<number>();
  
  constructor(
    private _manufactureVariantService: ManufactureVariantService
  ) {

  }


  destroy$ = new Subject<void>();

  ngOnDestroy(): void {

    this.destroy$.next();
    this.destroy$.complete();

  }

  @Input() manufacture_variant: any = {};

  removeVariant(manufacture_variant_id: number, manufacture_id: number) {

    Swal.fire({
      title: 'Espere...',
      html: 'Procesando solicitud',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    })

    this._manufactureVariantService.destroy(manufacture_variant_id, manufacture_id).pipe(takeUntil(this.destroy$)).subscribe({

      next: (resp: any) => {
        Swal.fire('Guardado', 'El registro ha sido creado', 'success');
        console.log(resp);

        Swal.fire({
          icon: 'success',
          title: 'Correcto',
          text: 'La operacion ha sido ejecutada correctamente',
          confirmButtonText: 'OK',
          showConfirmButton: true
        })

        this.emitDeleteManufactureVariantId.emit(manufacture_variant_id);

      },

      error: (error: any) => {
        Swal.fire('Error', 'Ocurrió un problema al eliminar el registro. Inténtalo nuevamente.', 'error');
        console.error(error);
      },

    });

    // Aquí puedes agregar la lógica para eliminar el variante del manufacture_variants
  }
}
