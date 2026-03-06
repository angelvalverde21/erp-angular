import { Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faArrowUpRightFromSquare, faChartSimple } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-order-link',
  imports: [
    FontAwesomeModule,
    RouterModule
  ],
  templateUrl: './order-link.component.html',
  styleUrl: './order-link.component.scss'
})
export class OrderLinkComponent {

  faChartSimple = faChartSimple;
  faArrowUpRightFromSquare = faArrowUpRightFromSquare;

    @Input() color: string = 'secondary';

}
