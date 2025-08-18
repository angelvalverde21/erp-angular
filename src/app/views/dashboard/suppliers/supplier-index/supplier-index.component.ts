import { Component, Input } from '@angular/core';
import { SupplierIndexRowComponent } from '../supplier-index-row/supplier-index-row.component';

@Component({
  selector: 'app-supplier-index',
  imports: [SupplierIndexRowComponent],
  templateUrl: './supplier-index.component.html',
  styleUrl: './supplier-index.component.scss',
})
export class SupplierIndexComponent {

  @Input() suppliers: any[] = [];

  reListSuppliers(id: any) {
    // this.images = this.images.filter((image) => image.id !== id);/
    // console.log('Re-listing supplier after deletion of ID:', id);
    this.suppliers = this.suppliers.filter((supplier) => supplier.id !== id);
  }
  
}
