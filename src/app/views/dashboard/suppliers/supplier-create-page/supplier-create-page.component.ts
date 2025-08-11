import { Component } from '@angular/core';
import { SupplierCreateComponent } from '../supplier-create/supplier-create.component';
import { ButtonLinkComponent } from '../../shared/components/buttons/button-link/button-link.component';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-supplier-create-page',
  imports: [SupplierCreateComponent, ButtonLinkComponent],
  templateUrl: './supplier-create-page.component.html',
  styleUrl: './supplier-create-page.component.scss',
})
export class SupplierCreatePageComponent {
  faArrowLeft = faArrowLeft;

  receiveSupplierCreate(supplier: any) {}
}
