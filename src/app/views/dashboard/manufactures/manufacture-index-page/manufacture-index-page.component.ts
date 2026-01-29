import { Component } from '@angular/core';
import { ManufactureIndexComponent } from '../manufacture-index/manufacture-index.component';
import { HeadPageComponent } from "../../../shared/components/head-page/head-page.component";
import { ButtonBackComponent } from '../../../shared/components/buttons/button-back/button-back.component';
import { LoadingComponent } from '../../../shared/components/loading/loading.component';
import { ButtonLinkComponent } from '../../../shared/components/buttons/button-link/button-link.component';
import { UserHeadTableComponent } from '../../users/shared/user-head-table/user-head-table.component';

@Component({
  selector: 'app-manufacture-index-page',
  imports: [
    ManufactureIndexComponent,
    HeadPageComponent,
    ButtonBackComponent,
    LoadingComponent,
    ButtonLinkComponent,
    UserHeadTableComponent
  ],
  templateUrl: './manufacture-index-page.component.html',
  styleUrl: './manufacture-index-page.component.scss'
})

export class ManufactureIndexPageComponent {

  manufactures: any;

  loading: boolean = false;

  constructor(){
  
  }

  receiveSearchResult(manufactures: any) {
    this.manufactures = manufactures;
  }



}
