import { Component, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faScissors, faTape, faEdit } from '@fortawesome/free-solid-svg-icons';
import { ButtonComponent } from 'src/app/views/shared/components/buttons/button/button.component';
import { DateShopifyPipe } from 'src/app/views/shared/pipes/date-shopify.pipe';

@Component({
  selector: 'app-manufacture-index',
  imports: [
    DateShopifyPipe,
    ButtonComponent,
    FontAwesomeModule
  ],
  templateUrl: './manufacture-index.component.html',
  styleUrl: './manufacture-index.component.scss'
})
export class ManufactureIndexComponent {

  faScissors = faScissors;
  faTape = faTape;
  faEdit = faEdit;
  
  @Input() manufactures: any; 

  constructor(
    private router: Router,
    private route: ActivatedRoute
  ) {}

  getManufactureId(id: number = 0) {
    this.router.navigate([id], { relativeTo: this.route });
  }
}
