import { JsonPipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { NgbProgressbarConfig, NgbProgressbarModule } from '@ng-bootstrap/ng-bootstrap';
import { WidgetManufacture } from 'src/app/interfaces/widgetManufacture';

@Component({
  selector: 'app-manufacture-widgets',
  imports: [
    NgbProgressbarModule,
    JsonPipe

  ],
  templateUrl: './manufacture-widgets.component.html',
  styleUrl: './manufacture-widgets.component.scss',
  providers: [NgbProgressbarConfig],
})
export class ManufactureWidgetsComponent implements OnInit {

  constructor(
    config: NgbProgressbarConfig
  ) {
    config.max = 1000;
    config.striped = true;
    config.animated = true;
    config.type = 'primary';
    config.height = '20px';
  }
  ngOnInit(): void {
    this.calculateCost();
  }

  @Input() widget: WidgetManufacture = {
    cost: 0,
    purchase_total: 0,
    quantity_total: 0,
    quantity_received: 0,
    progress: 0
  };

  calculateCost() {
    this.widget.cost = Math.round((this.widget.purchase_total / this.widget.quantity_total) * 100) / 100;
  }

}
