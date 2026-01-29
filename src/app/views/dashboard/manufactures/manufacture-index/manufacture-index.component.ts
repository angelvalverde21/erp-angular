import { Component, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DateShopifyPipe } from 'src/app/views/shared/pipes/date-shopify.pipe';

@Component({
  selector: 'app-manufacture-index',
  imports: [
    DateShopifyPipe
  ],
  templateUrl: './manufacture-index.component.html',
  styleUrl: './manufacture-index.component.scss'
})
export class ManufactureIndexComponent {

  @Input() manufactures: any; 

  constructor(
    private router: Router,
    private route: ActivatedRoute
  ) {}

  getManufactureId(id: number = 0) {
    this.router.navigate([id], { relativeTo: this.route });
  }
}
