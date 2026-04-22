import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import Swal from 'sweetalert2';
import { InventoryService } from '../../inventory.service';
import { HeadPageComponent } from 'src/app/views/shared/components/head-page/head-page.component';
import { ButtonBackComponent } from 'src/app/views/shared/components/buttons/button-back/button-back.component';
import { LoadingComponent } from 'src/app/views/shared/components/loading/loading.component';
import { ButtonPrintBarcodeComponent } from 'src/app/views/shared/components/buttons/button-print-barcode/button-print-barcode.component';
import { InventoryBatchEditComponent } from '../inventory-batch-edit/inventory-batch-edit.component';

@Component({
  selector: 'app-inventory-batch-edit-page',
  imports: [
    HeadPageComponent,
    ButtonBackComponent,
    LoadingComponent,
    ButtonPrintBarcodeComponent,
    InventoryBatchEditComponent
  ],
  templateUrl: './inventory-batch-edit-page.component.html',
  styleUrl: './inventory-batch-edit-page.component.scss'
})
export class InventoryBatchEditPageComponent implements OnInit, OnDestroy{


  inventory_id: number = 0;
  inventory: any = null;  

  variants: any[] = [];

  loading: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private _inventory: InventoryService
  ) {

    this.route.params.subscribe(params => {
      this.inventory_id = Number(params['inventory_id']);
    });

  }

  ngOnInit(): void {
    this.inventoryInit();
  }

  inventoryInit(){

    this.loading = true;

    this._inventory.get(this.inventory_id).pipe(takeUntil(this.destroy$)).subscribe({

      next: (resp: any) => {
        console.log(resp);
        this.inventory = resp.data;

        this.variants = this.inventory.kardexes.map((kardex: any) => {
          return {
            id: kardex.variant_id,
            sku: kardex.variant.sku,
            quantity: kardex.quantity,
          }
        });

        this.loading = false;
      },
    
      error: (error: any) => {
        Swal.fire('Error','Ocurrió un problema al traer los datos. Inténtalo nuevamente.','error');
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
