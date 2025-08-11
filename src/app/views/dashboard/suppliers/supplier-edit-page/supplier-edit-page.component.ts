import { Component } from '@angular/core';
import { SupplierEditComponent } from '../supplier-edit/supplier-edit.component';
import { faPenToSquare } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-supplier-edit-page',
  imports: [SupplierEditComponent, FontAwesomeModule],
  templateUrl: './supplier-edit-page.component.html',
  styleUrl: './supplier-edit-page.component.scss'
})
export class SupplierEditPageComponent {

  supplier_id: number | null = null;
  faPenToSquare = faPenToSquare;
  
  constructor(private route: ActivatedRoute) {
    this.route.params.subscribe((params) => {
      this.supplier_id = params['supplier_id'];
    });
  }
  

}
