import { Component } from '@angular/core';
import { ManufactureCreateComponent } from '../manufacture-create/manufacture-create.component';
import { ButtonBackComponent } from '../../../shared/components/buttons/button-back/button-back.component';
import { HeadPageComponent } from '../../../shared/components/head-page/head-page.component';
import { LoadingComponent } from '../../../shared/components/loading/loading.component';

@Component({
  selector: 'app-manufacture-create-page',
  imports: [
    ManufactureCreateComponent,
    ButtonBackComponent,
    HeadPageComponent,
    LoadingComponent
  ],
  templateUrl: './manufacture-create-page.component.html',
  styleUrl: './manufacture-create-page.component.scss'
})
export class ManufactureCreatePageComponent {

  loading: boolean = false;
  

  
}
