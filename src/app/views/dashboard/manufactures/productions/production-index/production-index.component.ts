import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faScissors, faTape, faEdit } from '@fortawesome/free-solid-svg-icons';
import { ButtonComponent } from 'src/app/views/shared/components/buttons/button/button.component';
import { DateShopifyPipe } from 'src/app/views/shared/pipes/date-shopify.pipe';
import { ManufactureIndexRowComponent } from '../../manufacture-index-row/manufacture-index-row.component';

@Component({
  selector: 'app-production-index',
  imports: [
    DateShopifyPipe,
    ButtonComponent,
    FontAwesomeModule,
    CommonModule,
    ManufactureIndexRowComponent
  ],
  templateUrl: './production-index.component.html',
  styleUrl: './production-index.component.scss'
})
export class ProductionIndexComponent {

  faScissors = faScissors;
  faTape = faTape;
  faEdit = faEdit;
  
  @Input() manufactures: any; 

  constructor(
    private router: Router,
    private route: ActivatedRoute
  ) {}

  getManufactureId(manufacture: any) {
    
    this.router.navigate([manufacture.id], { relativeTo: this.route });

  }
}
