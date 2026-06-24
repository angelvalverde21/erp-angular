import { Component, effect, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { JsonPipe, CurrencyPipe } from '@angular/common';
import { ButtonSaveComponent } from '@shared/components/buttons/button-save/button-save.component';
import Swal from 'sweetalert2';
import { Subject, switchMap, takeUntil } from 'rxjs';
import { LoadingComponent } from '@shared/components/loading/loading.component';
import { ManufactureOrderService } from '../../manufacture.order.service';
import { ManufactureOrderFormComponent } from '../../manufacture-order-form/manufacture-order-form.component';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ManufactureService } from '@dashboard/manufactures/manufacture.service';
import { ImagePreviewComponent } from '@shared/components/image-preview/image-preview.component';
import { PenPipe } from '@shared/pipes/pen.pipe';

@Component({
  selector: 'app-manufacture-order-resumen',
  imports: [
    JsonPipe,
    ButtonSaveComponent,
    LoadingComponent,
    ManufactureOrderFormComponent,
    ImagePreviewComponent,
    PenPipe,
    RouterModule
],
  templateUrl: './manufacture-order-resumen.component.html',
  styleUrl: './manufacture-order-resumen.component.scss'
})
export class ManufactureOrderResumenComponent implements OnInit, OnDestroy {

  @Output() emitUpdateManufacture = new EventEmitter<any>();

  loading: boolean = false;
  disabledButton: boolean = false;
  manufacture_id: number = 0;
  variants: any[] = [];
  payments: any[] = [];

  constructor(
    private _manufactureOrder: ManufactureOrderService,
    private _manufacture: ManufactureService,
    private route: ActivatedRoute
  ) {
    this.route.paramMap.subscribe(params => {
      this.manufacture_id = Number(params.get('order_id'));

    });

    //Escuchar cambios en la orden de compra para actualizar el formulario
    effect(() => {
      const event = this._manufacture.manufactureSingnalEvent();
      if (!event) return;

      this.variants = event.variants;
      this.payments = event.payments;

    });
  }

  ngOnInit(): void {



  }

  totalPrice() {

    return this.variants.reduce((acc, variant) => {
      return acc + (this.stock_received(variant.manufacture_kardexes) * variant.pivot.price);
    }, 0);  

  }

  subTotalPrice(variant: any){
    return this.stock_received(variant.manufacture_kardexes) * variant.pivot.price;
  }

  ngOnDestroy(): void {
  }


  get sum_payments(){
    return this.payments.reduce((acc, payment) => {
      return acc + (Number(payment.amount) || 0);
    }, 0);
  }

  manufacture: any;

  stock_received(manufacture_kardexes: any) { //avance de stock 

    const sum = manufacture_kardexes.reduce((acc: number, item: any) => {
      return acc + (Number(item.quantity) || 0);
    }, 0);

    return sum;
  }
}
