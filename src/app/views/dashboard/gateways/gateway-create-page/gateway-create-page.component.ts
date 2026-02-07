import { Component } from '@angular/core';
import { GatewayCreateComponent } from '../gateway-create/gateway-create.component';
import { ButtonBackComponent } from '@shared/components/buttons/button-back/button-back.component';
import { HeadPageComponent } from '@shared/components/head-page/head-page.component';
import { LoadingComponent } from '@shared/components/loading/loading.component';
import { ButtonLinkComponent } from '@shared/components/buttons/button-link/button-link.component';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-gateway-create-page',
  imports: [
    GatewayCreateComponent,
    ButtonBackComponent,
    HeadPageComponent,
    ButtonLinkComponent
  ],
  templateUrl: './gateway-create-page.component.html',
  styleUrl: './gateway-create-page.component.scss'
})
export class GatewayCreatePageComponent {

  constructor(
    private router: Router,
    private route: ActivatedRoute
  ){
  
  }

  receiveGatewayCreate(gateway: any) {
    console.log(gateway);
    if (gateway) {
      this.router.navigate(['../', gateway.id], { relativeTo: this.route })
        .then(() => {
          console.log('Nueva URL:', this.router.url);
        });
    }
  }

}
