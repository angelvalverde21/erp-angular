import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faBoxes, faChartSimple, faArrowUpRightFromSquare } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-manufacture-production-link',
  imports: [
    RouterModule,
    FontAwesomeModule
  ],
  templateUrl: './manufacture-production-link.component.html',
  styleUrl: './manufacture-production-link.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class ManufactureProductionLinkComponent {

  @Input() color: string = 'primary';

  faBoxes = faBoxes;
  faArrowUpRightFromSquare = faArrowUpRightFromSquare;
  store: string | null = null;

}
