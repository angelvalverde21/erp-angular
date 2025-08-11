import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PurchaseEditComponent } from '../purchase-edit/purchase-edit.component';
import { faPenToSquare } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@Component({
  selector: 'app-purchase-edit-page',
  imports: [PurchaseEditComponent, FontAwesomeModule],
  templateUrl: './purchase-edit-page.component.html',
  styleUrl: './purchase-edit-page.component.scss',
})
export class PurchaseEditPageComponent {

  purchase_id: number | null = null;
  faPenToSquare = faPenToSquare;
  
  constructor(private route: ActivatedRoute) {
    this.route.params.subscribe((params) => {
      this.purchase_id = params['purchase_id'];
    });
  }
  
}
