import { Component } from '@angular/core';
import { ManufactureOrderService } from '../order.service';
import { LoadingComponent } from '../../../../shared/components/loading/loading.component';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { OrderEditHeadComponent } from './order-edit-head/order-edit-head.component';
import { Subject, takeUntil } from 'rxjs';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-manufacture-order-edit-page',
  imports: [
    LoadingComponent,
    RouterModule,
    OrderEditHeadComponent
  ],
  templateUrl: './manufacture-order-edit-page.component.html',
  styleUrl: './manufacture-order-edit-page.component.scss'
})

export class ManufactureOrderEditPageComponent {

  loading: boolean = false;
  manufacture: any = null;
  manufacture_id: number = 0;


  constructor(
    private _manufactureOrder: ManufactureOrderService,
    private route: ActivatedRoute,
  ) {

    this.route.params.subscribe(params => {
      this.manufacture_id = params['order_id'];
    });

  }

}


