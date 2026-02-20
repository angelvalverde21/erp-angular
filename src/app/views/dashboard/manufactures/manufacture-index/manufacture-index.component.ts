import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faScissors, faTape, faEdit, faGears, faBoxesStacked } from '@fortawesome/free-solid-svg-icons';
import { ButtonComponent } from 'src/app/views/shared/components/buttons/button/button.component';
import { DateShopifyPipe } from 'src/app/views/shared/pipes/date-shopify.pipe';
import { ManufactureIndexRowComponent } from '../manufacture-index-row/manufacture-index-row.component';


@Component({
  selector: 'app-manufacture-index',
  imports: [
    ManufactureIndexRowComponent
  ],
  templateUrl: './manufacture-index.component.html',
  styleUrl: './manufacture-index.component.scss'
})
export class ManufactureIndexComponent {


  
  @Input() manufactures: any; 


}
