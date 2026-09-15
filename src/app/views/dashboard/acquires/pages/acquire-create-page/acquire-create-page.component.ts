import { Component } from '@angular/core';
import { ButtonBackComponent } from '@shared/components/buttons/button-back/button-back.component';
import { HeadPageComponent } from '@shared/components/head-page/head-page.component';
import { LoadingComponent } from '@shared/components/loading/loading.component';
import { ActivatedRoute, Router } from '@angular/router';
import { AcquireCreateComponent } from '../../acquire-create/acquire-create.component';

@Component({
  selector: 'app-acquire-create-page',
  imports: [
    AcquireCreateComponent,
    ButtonBackComponent,
    HeadPageComponent,
    LoadingComponent
  ],
  templateUrl: './acquire-create-page.component.html',
  styleUrl: './acquire-create-page.component.scss'
})

export class AcquireCreatePageComponent {

  loading: boolean = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute
  ) { }

  receiveAcquireCreate(acquire: any) {
    console.log(acquire);
    if (acquire) {
      this.router.navigate(['../', acquire.id], { relativeTo: this.route })
        .then(() => {
          console.log('Nueva URL:', this.router.url);
        });
    }
  }

}
