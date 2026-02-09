import { Component, OnDestroy, OnInit, TemplateRef, ViewEncapsulation } from '@angular/core';
import { ButtonLinkComponent } from '@shared/components/buttons/button-link/button-link.component';
import { HeadPageComponent } from '@shared/components/head-page/head-page.component';
import { LoadingComponent } from '@shared/components/loading/loading.component';
import { UserHeadTableComponent } from '../../users/shared/user-head-table/user-head-table.component';
import { GatewayIndexComponent } from '../gateway-index/gateway-index.component';
import { Subject, takeUntil } from 'rxjs';
import { GatewayService } from '../gateway.service';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { GatewayCreateComponent } from '../gateway-create/gateway-create.component';

@Component({
  selector: 'app-gateway-index-page',
  imports: [
    LoadingComponent,
    ButtonLinkComponent,
    HeadPageComponent,
    UserHeadTableComponent,
    UserHeadTableComponent,
    GatewayIndexComponent,
    GatewayCreateComponent
  ],
  templateUrl: './gateway-index-page.component.html',
  styleUrl: './gateway-index-page.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class GatewayIndexPageComponent implements OnInit {

  modal: any;
  constructor(
    private _gateway: GatewayService,
    config: NgbModalConfig,
    private modalService: NgbModal,
  ) {
    // customize default values of modals used by this component tree
    config.backdrop = 'static';
    config.keyboard = false;
  }

  loading: boolean = false;

  gateways: any;

  ngOnInit() {
    this.gatewaysInit();
  }

  gatewaysInit() {

    this.loading = true;

    this._gateway.index().pipe(takeUntil(this.destroy$)).subscribe({

      next: (resp: any) => {
        console.log(resp);
        this.gateways = resp.data;
        this.loading = false;
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

  receiveSearchResult(gateways: any) {
    this.gateways = gateways;
  }


  openVerticallyCentered(content: TemplateRef<any>) {
    this.modal = this.modalService.open(content, { centered: true });
  }

  closeModal() {
    this.modal.close();
  }

  receiveGatewayCreate(gateway: any) {
    this.closeModal();
    this.gateways.unshift(gateway);
  }
}

