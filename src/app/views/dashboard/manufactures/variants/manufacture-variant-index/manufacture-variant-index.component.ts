import { Component, Input } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faBarcode, faTrash } from '@fortawesome/free-solid-svg-icons';
import { ButtonComponent } from '../../../../shared/components/buttons/button/button.component';
import Swal from 'sweetalert2';
import { ManufactureVariantService } from '../manufactureVariant.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-manufacture-variant-index',
  imports: [
    FontAwesomeModule,
    ButtonComponent
  ],
  templateUrl: './manufacture-variant-index.component.html',
  styleUrl: './manufacture-variant-index.component.scss'
})
export class ManufactureVariantIndexComponent {

  constructor(
    private _manufactureVariantService: ManufactureVariantService
  ) {

  }

  faBarcode = faBarcode;
  faTrash = faTrash;

  @Input() manufacture_variants: any;

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

        this.manufacture_variants = this.manufacture_variants.filter((manufacture_variant: any) => manufacture_variant.id !== manufacture_variant_id);
      },

      error: (error: any) => {
        Swal.fire('Error', 'Ocurrió un problema al eliminar el registro. Inténtalo nuevamente.', 'error');
        console.error(error);
      },

    });

    // Aquí puedes agregar la lógica para eliminar el variante del manufacture_variants
  }

  destroy$ = new Subject<void>();

  ngOnDestroy(): void {

    this.destroy$.next();
    this.destroy$.complete();

  }

}
