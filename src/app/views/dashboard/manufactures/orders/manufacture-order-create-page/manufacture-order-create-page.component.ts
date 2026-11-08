import { ManufactureSectionHeaderComponent } from '../../components/manufacture-section-header/manufacture-section-header.component';
import { Component } from '@angular/core';
import { LoadingComponent } from '@shared/components/loading/loading.component';
import { ActivatedRoute, Router } from '@angular/router';
import { ManufactureOrderCreateComponent } from '../manufacture-order-create/manufacture-order-create.component';
@Component({
  selector: 'app-manufacture-order-create-page',
  imports: [
    ManufactureSectionHeaderComponent,
    ManufactureOrderCreateComponent,
    LoadingComponent
  ],
  templateUrl: './manufacture-order-create-page.component.html',
  styleUrl: './manufacture-order-create-page.component.scss'
})

export class ManufactureOrderCreatePageComponent {

  loading: boolean = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute
  ) { }

  receiveManufactureCreate(manufacture: any) {
    console.log(manufacture);
    if (manufacture) {
      this.router.navigate(['../', manufacture.id], { relativeTo: this.route })
        .then(() => {
          console.log('Nueva URL:', this.router.url);
        });
    }
  }

}
