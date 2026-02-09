import { Component, OnInit } from '@angular/core';
import { ButtonBackComponent } from '@shared/components/buttons/button-back/button-back.component';
import { HeadPageComponent } from '@shared/components/head-page/head-page.component';
import { LoadingComponent } from '@shared/components/loading/loading.component';
import { GatewayEditComponent } from '../gateway-edit/gateway-edit.component';
import { GatewayService } from '../gateway.service';
import { Subject, takeUntil } from 'rxjs';
import Swal from 'sweetalert2';
import { ActivatedRoute } from '@angular/router';
import { JsonPipe } from '@angular/common';

@Component({
  selector: 'app-gateway-edit-page',
  imports: [
    ButtonBackComponent,
    HeadPageComponent,
    LoadingComponent,
    GatewayEditComponent,
    ButtonBackComponent,
    JsonPipe
  ],
  templateUrl: './gateway-edit-page.component.html',
  styleUrl: './gateway-edit-page.component.scss'
})
export class GatewayEditPageComponent implements OnInit {

  gateway_id: number = 0;
  gateway: any;

  constructor(
    private _gateway: GatewayService,
    private route: ActivatedRoute,

  ) {

    this.route.params.subscribe(params => {
      this.gateway_id = params['gateway_id'];
    });

  }

  ngOnInit(): void {

    this.gatewayInit();

  }

  loading: boolean = false;

  gatewayInit() {
    
    this.loading = true;

    this._gateway.get(this.gateway_id).pipe(takeUntil(this.destroy$)).subscribe({

      next: (resp: any) => {
        console.log(resp);
        this.gateway = resp.data;
        this.loading = false;
      },
    
      error: (error: any) => {
        Swal.fire('Error','Ocurrió un problema al traer los datos.','error');
        console.error(error);
      },
    
    });
  }

  receiveGatewayUpdate(gateway: any) {
    console.log(gateway);
  }

  destroy$ = new Subject<void>();
  
  ngOnDestroy(): void {
  
    this.destroy$.next();
    this.destroy$.complete();
  
  }



}
