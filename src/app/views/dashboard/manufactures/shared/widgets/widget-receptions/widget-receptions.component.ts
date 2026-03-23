import { Component, Input } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faRightLeft } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-widget-receptions',
  imports: [
    FontAwesomeModule
  ],
  templateUrl: './widget-receptions.component.html',
  styleUrl: './widget-receptions.component.scss'
})
export class WidgetReceptionsComponent {


  faRightLeft = faRightLeft;

  @Input() total_receptions: number = 0; 
  @Input() saldo: number = 0; 

  // quantity_received: number = 0;
 
}
