import { Component } from '@angular/core';
import { NgbProgressbarConfig, NgbProgressbarModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-manufacture-widgets',
  imports: [
    NgbProgressbarModule,

  ],
  templateUrl: './manufacture-widgets.component.html',
  styleUrl: './manufacture-widgets.component.scss',
  providers: [NgbProgressbarConfig],
})
export class ManufactureWidgetsComponent {

  constructor(
    config: NgbProgressbarConfig
  ) {
    config.max = 1000;
    config.striped = true;
    config.animated = true;
    config.type = 'primary';
    config.height = '20px';
  }
  
}
