import { Component } from '@angular/core';
import { ProductionCreateComponent } from '../production-create/production-create.component';
import { ButtonBackComponent } from '@shared/components/buttons/button-back/button-back.component';
import { HeadPageComponent } from '@shared/components/head-page/head-page.component';
import { LoadingComponent } from '@shared/components/loading/loading.component';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-production-create-page',
  imports: [
    ProductionCreateComponent,
    ButtonBackComponent,
    HeadPageComponent,
    LoadingComponent
  ],
  templateUrl: './production-create-page.component.html',
  styleUrl: './production-create-page.component.scss'
})
export class ProductionCreatePageComponent {

  loading: boolean = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute
  ) { }

  receiveProductionCreate(production: any) {
    console.log(production);
    if (production) {
      this.router.navigate(['../', production.id], { relativeTo: this.route })
        .then(() => {
          console.log('Nueva URL:', this.router.url);
        });
    }
  }

}
