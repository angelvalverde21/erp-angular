import { Component } from '@angular/core';
import { PettyCashCreateComponent } from '../petty-cash-create/petty-cash-create.component';
import { HeadPageComponent } from '@shared/components/head-page/head-page.component';
import { ButtonBackComponent } from '@shared/components/buttons/button-back/button-back.component';
import { faCashRegister } from '@fortawesome/free-solid-svg-icons';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-petty-cash-create-page',
  imports: [
    PettyCashCreateComponent,
    HeadPageComponent,
    ButtonBackComponent
  ],
  templateUrl: './petty-cash-create-page.component.html',
  styleUrl: './petty-cash-create-page.component.scss'
})
export class PettyCashCreatePageComponent {

  faCashRegister = faCashRegister;

  constructor(
    private router: Router,
    private route: ActivatedRoute
  ) {

  }

  receivePettyCashCreate(petty_cash: any) {
    console.log(petty_cash);
    if (petty_cash) {
      this.router.navigate(['../', petty_cash.id], { relativeTo: this.route })
        .then(() => {
          console.log('Nueva URL:', this.router.url);
        });
    }
  }


}
