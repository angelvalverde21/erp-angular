import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import Swal from 'sweetalert2';
import { DateShopifyPipe } from '../../shared/pipes/date-shopify.pipe';
import { CommonModule, JsonPipe } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputGroupComponent } from '../../shared/components/form/input-group/input-group.component';
import { ButtonComponent } from '../../shared/components/buttons/button/button.component';
import { AppShopifyService } from '../app-shopify.service';
import { faGlasses, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-tracking',
  imports: [
    DateShopifyPipe,
    CommonModule,
    InputGroupComponent,
    ReactiveFormsModule,
    ButtonComponent,
    JsonPipe,
  ],
  templateUrl: './tracking.component.html',
  styleUrl: './tracking.component.scss'
})
export class TrackingComponent implements OnInit, OnDestroy {

  order_id: number = 0;
  loading: boolean = false;
  tracking: any;
  faMagnifyingGlass = faMagnifyingGlass;
  form!: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private _appShopifyService: AppShopifyService,
    private fb: FormBuilder
  ) {

    console.log("hola");

    this.route.params.subscribe(params => {
      this.order_id = params['order_id'];
      console.log(this.order_id);

    });

  }

  ngOnInit(): void {
    this.formInit();
  }

  formInit() {
    this.form = this.fb.group({
      order_id: ['', Validators.required],
      phone: ['', Validators.required]
    });
  }

  getStatus() {

    this.loading = true;

    console.log("getStatus");


    this._appShopifyService.tracking(this.form.value).pipe(takeUntil(this.destroy$)).subscribe({

      next: (resp: any) => {
        console.log(resp);
        this.loading = false;
        this.tracking = resp;

      },

      error: (error: any) => {
        console.error(error);
        this.loading = false;
      },

    });
  }



  destroy$ = new Subject<void>();

  ngOnDestroy(): void {

    this.destroy$.next();
    this.destroy$.complete();

  }

}
