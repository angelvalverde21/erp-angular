import { Component, Input } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faTruckFast, faTruck } from '@fortawesome/free-solid-svg-icons';


@Component({
  selector: 'app-fillment-status',
  imports: [FontAwesomeModule],
  templateUrl: './fillment-status.component.html',
  styleUrl: './fillment-status.component.scss'
})
export class FillmentStatusComponent {

  faTruckFast = faTruckFast;
  faTruck = faTruck;
  
  @Input() status: string = "";

}
