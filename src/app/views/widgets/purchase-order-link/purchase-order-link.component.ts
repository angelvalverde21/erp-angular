import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faBoxes, faChartSimple, faArrowUpRightFromSquare } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-purchase-order-link',
  imports: [
    RouterModule,
    FontAwesomeModule
  ],
  templateUrl: './purchase-order-link.component.html',
  styleUrl: './purchase-order-link.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class PurchaseOrderLinkComponent {

  @Input() color: string = 'secondary';

  faBoxes = faBoxes;
  faArrowUpRightFromSquare = faArrowUpRightFromSquare;
  store: string | null = null;

}

