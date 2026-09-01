import { Component, Input } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faEdit, faPrint } from '@fortawesome/free-solid-svg-icons';
import { ButtonPdfComponent } from 'src/app/views/shared/components/buttons/button-pdf/button-pdf.component';
import { ButtonComponent } from 'src/app/views/shared/components/buttons/button/button.component';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-menu-button',
  imports: [
    ButtonPdfComponent,
    FontAwesomeModule,
    ButtonComponent,
    NgbDropdownModule
  ],
  templateUrl: './menu-button.component.html',
  styleUrl: './menu-button.component.scss',
})
export class MenuButtonComponent {

  @Input() order: any;
  faPrint = faPrint;
  faEdit = faEdit;
  removeHash(name: string): number {
    const clean = name?.startsWith('#') ? name.substring(1) : name;
    return Number(clean);
  }

  getURlShopify(gid: string): string {
    const id = gid.split('/').pop() ?? '';
    return `https://admin.shopify.com/store/sorelleperu/orders/${id}`;
  }
}
