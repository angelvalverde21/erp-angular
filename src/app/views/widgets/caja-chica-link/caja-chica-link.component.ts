import { Component } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faCalculator, faArrowUpRightFromSquare } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-caja-chica-link',
  imports: [
    FontAwesomeModule,
  ],
  templateUrl: './caja-chica-link.component.html',
  styleUrl: './caja-chica-link.component.scss'
})
export class CajaChicaLinkComponent {

  faCalculator = faCalculator;
  faArrowUpRightFromSquare = faArrowUpRightFromSquare;
  
}
