import { Component, effect, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { JsonPipe, CurrencyPipe } from '@angular/common';
import { ButtonSaveComponent } from '@shared/components/buttons/button-save/button-save.component';
import Swal from 'sweetalert2';
import { Subject, switchMap, takeUntil } from 'rxjs';
import { LoadingComponent } from '@shared/components/loading/loading.component';
import { AcquireFormComponent } from '../../acquire-form/acquire-form.component';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ImagePreviewComponent } from '@shared/components/image-preview/image-preview.component';
import { PenPipe } from '@shared/pipes/pen.pipe';
import { AcquireEditComponent } from '../acquire-edit/acquire-edit.component';
import { AcquireService } from '../../acquire.service';

@Component({
  selector: 'app-acquire-resumen',
  imports: [
    JsonPipe,
    ButtonSaveComponent,
    LoadingComponent,
    AcquireFormComponent,
    ImagePreviewComponent,
    PenPipe,
    JsonPipe,
    RouterModule,
    AcquireEditComponent
],
  templateUrl: './acquire-resumen.component.html',
  styleUrl: './acquire-resumen.component.scss'
})

export class AcquireResumenComponent implements OnInit, OnDestroy {

  @Output() emitUpdateAcquire = new EventEmitter<any>();

  loading: boolean = false;
  disabledButton: boolean = false;
  // acquire_id: number = 0;
  variants: any[] = [];
  payments: any[] = [];

  acquire: any;

  constructor(
    private _acquire: AcquireService,
    private route: ActivatedRoute
  ) {
    // this.route.paramMap.subscribe(params => {
    //   this.acquire_id = Number(params.get('acquire_id'));

    // });

    //Escuchar cambios en la orden de compra para actualizar el formulario
    effect(() => {

      const event = this._acquire.acquireSingnalEvent();
      console.log(event);

      if (!event) return;

      this.acquire = event;

      console.log(this.acquire);
      
      this.variants = event.variants;
      this.payments = event.payments;

    });
  }

  ngOnInit(): void {

  }

  totalPrice() {

    return this.variants.reduce((acc, variant) => {
      return acc + (this.stock_received(variant.acquire_kardexes) * variant.pivot.price);
    }, 0);  

  }

  subTotalPrice(variant: any){
    return this.stock_received(variant.acquire_kardexes) * variant.pivot.price;
  }

  ngOnDestroy(): void {
  }


  get sum_payments(){
    return this.payments.reduce((acc, payment) => {
      return acc + (Number(payment.amount) || 0);
    }, 0);
  }

  // acquire: any;

  stock_received(acquire_kardexes: any) { //avance de stock 

    const sum = acquire_kardexes.reduce((acc: number, item: any) => {
      return acc + (Number(item.quantity) || 0);
    }, 0);

    return sum;
  }
}
