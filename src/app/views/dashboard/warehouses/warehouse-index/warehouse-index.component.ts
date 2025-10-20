import {
  Component,
  OnInit,
  OnDestroy,
  TemplateRef,
  ViewEncapsulation,
} from '@angular/core';
import { Subscription } from 'rxjs';
import { WarehouseService } from '../warehouse.service';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faPlus, faWarehouse } from '@fortawesome/free-solid-svg-icons';

import { LoadingComponent } from '../../../shared/components/loading/loading.component';
import { CommonModule, JsonPipe } from '@angular/common';
import { ButtonComponent } from '../../../shared/components/buttons/button/button.component';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { WarehouseCreateComponent } from '../warehouse-create/warehouse-create.component';
import { ButtonLinkComponent } from '../../../shared/components/buttons/button-link/button-link.component';

@Component({
  selector: 'app-warehouse-index',
  imports: [
    ButtonComponent, 
    LoadingComponent, 
    CommonModule, 
    FontAwesomeModule,
    WarehouseCreateComponent,
    JsonPipe,
    ButtonLinkComponent
  ],
  templateUrl: './warehouse-index.component.html',
  styleUrl: './warehouse-index.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class WarehouseIndexComponent implements OnInit {

  SubscriptionWarehouse!: Subscription;
  faPlus = faPlus;
  faWarehouse = faWarehouse;
  loading: boolean = true;
  warehouses: any[] = [];

  ngOnInit(): void {
    this.SubscriptionWarehouse = this._warehouse
      .index()
      .subscribe((resp: any) => {
        this.loading = false;
        console.log(resp.data);
        this.warehouses = resp.data;
      });
  }

  create() {}

  modal: any;
  constructor(
    private _warehouse: WarehouseService,
    config: NgbModalConfig,
    private modalService: NgbModal
  ) {
    // customize default values of modals used by this component tree
    config.backdrop = 'static';
    config.keyboard = false;
  }
  openVerticallyCentered(content: TemplateRef<any>) {
    this.modal = this.modalService.open(content, { centered: true, size: 'lg' });
  }

  ngOnDestroy(): void {}
  closeModal() {
    this.modal.close();
  }

  reListWarehouse(warehouse: []){
    this.warehouses.unshift(warehouse);
  }
}
