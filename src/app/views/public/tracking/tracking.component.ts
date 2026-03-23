import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ShopifyWebService } from '../shopify.web.service'
import { Subject, takeUntil } from 'rxjs';
import Swal from 'sweetalert2';
import { DateShopifyPipe } from '../../shared/pipes/date-shopify.pipe';
import { CommonModule, JsonPipe } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputGroupComponent } from '../../shared/components/form/input-group/input-group.component';
import { ButtonComponent } from '../../shared/components/buttons/button/button.component';

@Component({
  selector: 'app-tracking',
  imports: [
    DateShopifyPipe,
    CommonModule,
    InputGroupComponent,
    ReactiveFormsModule,
    ButtonComponent,
    JsonPipe
  ],
  templateUrl: './tracking.component.html',
  styleUrl: './tracking.component.scss'
})
export class TrackingComponent implements OnInit, OnDestroy {

  order_id: number = 0;
  loading: boolean = false;
  tracking: any;

  form!: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private _shopifyWeb: ShopifyWebService,
    private fb: FormBuilder
  ) {

    console.log("hola");

    this.route.params.subscribe(params => {
      this.order_id = params['order_id'];
      console.log(this.order_id);

    });

  }

  ngOnInit(): void {
    this.orderInit();
    this.formInit();
  }

  formInit() {
    this.form = this.fb.group({
      order_id: ['', Validators.required],
      phone: ['', Validators.required]
    });
  }

  orderInit() {

    this.loading = true;

    this._shopifyWeb.tracking(this.order_id).pipe(takeUntil(this.destroy$)).subscribe({

      next: (resp: any) => {
        // Swal.fire('Guardado', 'El registro ha sido creado', 'success');
        console.log(resp);
        // this.orders = resp.data;
        this.loading = false;
        this.tracking = resp;

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
