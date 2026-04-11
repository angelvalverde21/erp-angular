import { Component, EventEmitter, OnDestroy, Output } from '@angular/core';
import { InventoryVariantSearchComponent } from '../variants/inventory-variant-search/inventory-variant-search.component';
import { InventoryService } from '../inventory.service';
import { Subject, takeUntil } from 'rxjs';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-inventory-create',
  imports: [
    InventoryVariantSearchComponent
  ],
  templateUrl: './inventory-create.component.html',
  styleUrl: './inventory-create.component.scss'
})
export class InventoryCreateComponent implements OnDestroy {


  loading: boolean = false;
  inventories: any[] = [];

  constructor(
    private _inventory: InventoryService
  ) {

  }

  @Output() emitInventoryCreate = new EventEmitter<any>();

  receiveSearchSelectedVariants(event: any) {

    console.log('Variantes seleccionadas:', event);

    this.loading = true;

    console.log('Variantes seleccionadas:', event);

    this._inventory.batch(event).pipe(takeUntil(this.destroy$)).subscribe({

      next: (resp: any) => {

        Swal.fire('Guardado', 'Inventario generado correctamente', 'success');
        console.log(resp);
        this.inventories = resp.data;
        this.emitInventoryCreate.emit(resp.data);
        this.loading = false;

      },

      error: (error: any) => {

        Swal.fire({
          title: "Los productos ya existen",
          icon: "warning",
          showCloseButton: true,
          focusConfirm: false,
        });

        console.error(error);
      },

    });

    // Aquí puedes manejar las variantes seleccionadas, por ejemplo, agregándolas a un formulario o a una lista.
  }

  destroy$ = new Subject<void>();

  ngOnDestroy(): void {

    this.destroy$.next();
    this.destroy$.complete();

  }


}
