import { Component } from '@angular/core';
import { SupplierIndexComponent } from '../supplier-index/supplier-index.component';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { ButtonLinkComponent } from '../../../shared/components/buttons/button-link/button-link.component';

@Component({
  selector: 'app-supplier-index-page',
  imports: [SupplierIndexComponent, ButtonLinkComponent],
  templateUrl: './supplier-index-page.component.html',
  styleUrl: './supplier-index-page.component.scss'
})
export class SupplierIndexPageComponent {

  faPlus = faPlus;


}
