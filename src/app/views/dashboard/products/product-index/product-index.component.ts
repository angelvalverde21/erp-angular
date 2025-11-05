import { Component, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { faPen, faTrash } from '@fortawesome/free-solid-svg-icons';
import { Product } from 'src/app/interfaces/product.interface';
import { ButtonComponent } from 'src/app/views/shared/components/buttons/button/button.component';

@Component({
  selector: 'app-product-index',
  imports: [
    ButtonComponent
  ],
  templateUrl: './product-index.component.html',
  styleUrl: './product-index.component.scss'
})
export class ProductIndexComponent {

  faTrash = faTrash;
  faPen = faPen;

  constructor(
    private router: Router,
    private route: ActivatedRoute
  ){
  
  }

  @Input() products: Product[] = []; 

  getProduct(id : number){
    this.router.navigate([id], { relativeTo: this.route });
  }

}
