import { Component} from '@angular/core';
import { ButtonLinkComponent } from '../../shared/components/buttons/button-link/button-link.component';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { PurchaseIndexComponent } from '../purchase-index/purchase-index.component';

@Component({
  selector: 'app-purchase-index-page',
  imports: [ButtonLinkComponent, PurchaseIndexComponent],
  templateUrl: './purchase-index-page.component.html',
  styleUrl: './purchase-index-page.component.scss'
})
export class PurchaseIndexPageComponent{
  
  faPlus = faPlus;

}
