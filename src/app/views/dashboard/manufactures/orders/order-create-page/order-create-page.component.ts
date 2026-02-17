import { Component } from '@angular/core';
import { ManufactureCreateComponent } from '../../manufacture-create/manufacture-create.component';
import { ButtonBackComponent } from '@shared/components/buttons/button-back/button-back.component';
import { HeadPageComponent } from '@shared/components/head-page/head-page.component';
import { LoadingComponent } from '@shared/components/loading/loading.component';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-order-create-page',
  imports: [
    ManufactureCreateComponent,
    ButtonBackComponent,
    HeadPageComponent,
    LoadingComponent
  ],
  templateUrl: './order-create-page.component.html',
  styleUrl: './order-create-page.component.scss'
})
export class OrderCreatePageComponent {

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
