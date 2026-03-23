import { Component, Input } from '@angular/core';
import { WidgetCostComponent } from '../../shared/widgets/widget-cost/widget-cost.component';
import { WidgetReceptionsComponent } from '../../shared/widgets/widget-receptions/widget-receptions.component';
import { WidgetProductsComponent } from '../../shared/widgets/widget-products/widget-products.component';
import { BaseService } from 'src/app/views/base.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-order-widget',
  imports: [
    WidgetCostComponent,
    WidgetReceptionsComponent,
    WidgetProductsComponent
  ],
  templateUrl: './order-widget.component.html',
  styleUrl: './order-widget.component.scss'
})
export class OrderWidgetComponent {

  @Input() widget_summary: any = {};
  @Input() manufacture_id: number = 0;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private _base: BaseService
  ){
  
  }

  gotLink: any;

  goTo(link: string = "") {


    if (link == 'receptions') {
      this.gotLink = [this._base.store, 'dashboard', 'manufactures', 'orders', this.manufacture_id, link];
    } else {
      this.gotLink = [this._base.store, 'dashboard', 'manufactures', 'orders', this.manufacture_id];
    }


    return this.router.navigate(this.gotLink);
  }

}
